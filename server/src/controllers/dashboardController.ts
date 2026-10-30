import { z } from 'zod';
import { CourseModel, serializeCourse } from '../models/Course.js';
import { EnrollmentModel } from '../models/Enrollment.js';
import { UserModel } from '../models/User.js';
import { OrderModel } from '../models/Order.js';
import { HttpError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getMyDashboard = asyncHandler(async (req, res) => {
  const [user, enrollments] = await Promise.all([
    UserModel.findById(req.user?.id),
    EnrollmentModel.find({ userId: req.user?.id })
      .populate<{ courseId: InstanceType<typeof CourseModel> }>({ path: 'courseId', select: '-__v' })
      .sort({ lastAccessedAt: -1 }),
  ]);
  const records = enrollments.map((item) => {
    const course = serializeCourse(item.courseId);
    const value = item.toJSON();
    return {
      ...value,
      id: item.id,
      userId: item.userId.toString(),
      courseId: course.id,
      course,
    };
  });
  res.json({
    user,
    stats: {
      enrolledCourses: records.length,
      completedCourses: records.filter((item) => item.progressPercentage === 100).length,
      inProgressCourses: records.filter((item) => item.progressPercentage < 100).length,
      completedLectures: records.reduce((sum, item) => sum + item.completedLectureIds.length, 0),
    },
    enrollments: records,
  });
});

export const getInstructorDashboard = asyncHandler(async (req, res) => {
  const courses = await CourseModel.find({ instructorId: req.user?.id }).sort({ createdAt: -1 });
  const courseIds = courses.map((course) => course._id);
  const [enrollmentCount, revenue] = await Promise.all([
    EnrollmentModel.countDocuments({ courseId: { $in: courseIds } }),
    OrderModel.aggregate([
      { $match: { status: 'completed', 'items.courseId': { $in: courseIds } } },
      { $unwind: '$items' },
      { $match: { 'items.courseId': { $in: courseIds } } },
      { $group: { _id: null, total: { $sum: '$items.price' } } },
    ]),
  ]);
  const transactions = await OrderModel.aggregate([
    { $match: { status: 'completed', 'items.courseId': { $in: courseIds } } },
    { $unwind: '$items' },
    { $match: { 'items.courseId': { $in: courseIds } } },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        id: { $concat: [{ $toString: '$_id' }, '-', { $toString: '$items.courseId' }] },
        orderNumber: 1,
        date: '$createdAt',
        description: '$items.title',
        amount: '$items.price',
        status: 1,
      },
    },
    { $limit: 100 },
  ]);
  res.json({
    stats: { courses: courses.length, students: enrollmentCount, grossRevenue: revenue[0]?.total ?? 0 },
    courses: courses.map(serializeCourse),
    transactions,
  });
});

export const getInstructorStudents = asyncHandler(async (req, res) => {
  const courseIds = await CourseModel.find({ instructorId: req.user?.id }).distinct('_id');
  const enrollments = await EnrollmentModel.find({ courseId: { $in: courseIds } })
    .populate({ path: 'userId', select: 'name email' })
    .populate({ path: 'courseId', select: 'title slug' })
    .sort({ enrolledAt: -1 });
  res.json({
    students: enrollments.map((enrollment) => {
      const student = enrollment.userId as unknown as { id: string; name: string; email: string };
      const course = enrollment.courseId as unknown as { id: string; title: string; slug: string };
      return {
        id: enrollment.id,
        name: student.name,
        email: student.email,
        courseTitle: course.title,
        enrolledAt: enrollment.enrolledAt,
        lastAccessedAt: enrollment.lastAccessedAt,
        progress: enrollment.progressPercentage,
      };
    }),
  });
});

export const getAdminDashboard = asyncHandler(async (_req, res) => {
  const [users, courses, enrollments] = await Promise.all([
    UserModel.countDocuments(),
    CourseModel.countDocuments(),
    EnrollmentModel.countDocuments(),
  ]);
  res.json({ stats: { users, courses, enrollments } });
});

export const listUsers = asyncHandler(async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 100) : '';
  const role = typeof req.query.role === 'string' && ['student', 'instructor', 'admin'].includes(req.query.role)
    ? req.query.role
    : undefined;
  const filter = {
    ...(role ? { role } : {}),
    ...(search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {}),
  };
  const users = await UserModel.find(filter).select('name email role status avatar createdAt').sort({ createdAt: -1 }).limit(100);
  const userIds = users.map((user) => user._id);
  const enrollmentCounts = await EnrollmentModel.aggregate([
    { $match: { userId: { $in: userIds } } },
    { $group: { _id: '$userId', count: { $sum: 1 } } },
  ]);
  const counts = new Map(enrollmentCounts.map((entry) => [entry._id.toString(), entry.count]));
  res.json({
    users: users.map((user) => ({
      ...user.toJSON(),
      status: user.status ?? 'active',
      joined: user.createdAt?.toISOString() ?? '',
      coursesEnrolled: counts.get(user.id) ?? 0,
    })),
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const userId = z.string().regex(/^[a-f\d]{24}$/i).parse(req.params.userId);
  const { status } = z.object({ status: z.enum(['active', 'suspended']) }).parse(req.body);
  if (userId === req.user?.id && status === 'suspended') {
    throw new HttpError(400, 'You cannot suspend your own account');
  }
  const user = await UserModel.findByIdAndUpdate(userId, { $set: { status } }, { new: true })
    .select('name email role status createdAt');
  if (!user) throw new HttpError(404, 'User account not found');
  res.json({ user });
});
