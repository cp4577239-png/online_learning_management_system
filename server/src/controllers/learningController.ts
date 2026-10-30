import { createHash, randomBytes, randomInt } from 'node:crypto';
import { z } from 'zod';
import { CertificateModel } from '../models/Certificate.js';
import { CourseModel } from '../models/Course.js';
import { DiscussionModel } from '../models/Discussion.js';
import { EnrollmentModel } from '../models/Enrollment.js';
import { NoteModel } from '../models/Note.js';
import { OrderModel } from '../models/Order.js';
import { UserModel } from '../models/User.js';
import { HttpError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i);
const noteSchema = z.object({
  courseId: objectIdSchema,
  lectureId: z.string().min(1).max(100),
  lectureTitle: z.string().trim().min(1).max(200),
  timestampSeconds: z.number().min(0),
  text: z.string().trim().min(1).max(5000),
});
const discussionSchema = z.object({
  courseId: objectIdSchema,
  lectureId: z.string().min(1).max(100),
  content: z.string().trim().min(1).max(5000),
});
const orderSchema = z.object({
  items: z.array(z.object({ courseId: objectIdSchema })).min(1).max(20),
  couponApplied: z.enum(['LEARNOVA20', 'ARCHITECT15']).optional(),
  paymentMethod: z.enum(['razorpay', 'card', 'upi', 'wallet']),
});

const getEnrolledCourse = async (userId: string, courseId: string) => {
  const [enrollment, course] = await Promise.all([
    EnrollmentModel.exists({ userId, courseId }),
    CourseModel.findById(courseId).select('sections'),
  ]);
  if (!enrollment || !course) throw new HttpError(403, 'Course enrollment is required');
  return course;
};

export const listMyNotes = asyncHandler(async (req, res) => {
  const courseId = typeof req.query.courseId === 'string'
    ? objectIdSchema.parse(req.query.courseId)
    : undefined;
  const notes = await NoteModel.find({
    userId: req.user?.id,
    ...(courseId ? { courseId } : {}),
  }).sort({ createdAt: -1 }).limit(500);
  res.json({ notes });
});

export const createNote = asyncHandler(async (req, res) => {
  const input = noteSchema.parse(req.body);
  const course = await getEnrolledCourse(req.user!.id, input.courseId);
  if (!course.sections.some((section) => section.lectures.some((lecture) => lecture.id === input.lectureId))) {
    throw new HttpError(400, 'Lecture does not belong to this course');
  }
  const note = await NoteModel.create({ ...input, userId: req.user?.id });
  res.status(201).json({ note });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const noteId = objectIdSchema.parse(req.params.noteId);
  const note = await NoteModel.findOneAndDelete({ _id: noteId, userId: req.user?.id });
  if (!note) throw new HttpError(404, 'Note not found');
  res.status(204).end();
});

export const listMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await CertificateModel.find({ userId: req.user?.id }).sort({ createdAt: -1 });
  res.json({ certificates });
});

export const verifyCertificate = asyncHandler(async (req, res) => {
  const code = req.params.code.trim().toUpperCase();
  const certificate = await CertificateModel.findOne({ code });
  if (!certificate) throw new HttpError(404, 'Certificate not found');
  res.json({ certificate });
});

export const issueCertificate = asyncHandler(async (req, res) => {
  const courseId = objectIdSchema.parse(req.params.courseId);
  const [enrollment, course, user] = await Promise.all([
    EnrollmentModel.findOne({ userId: req.user?.id, courseId }),
    CourseModel.findById(courseId),
    UserModel.findById(req.user?.id),
  ]);
  if (!enrollment || enrollment.progressPercentage !== 100) {
    throw new HttpError(403, 'Complete the course before claiming its certificate');
  }
  if (!course || !user) throw new HttpError(404, 'Course or user account not found');

  const existing = await CertificateModel.findOne({ userId: user.id, courseId });
  if (existing) {
    res.json({ certificate: existing });
    return;
  }

  const code = `LNV-${new Date().getFullYear()}-${course.id.slice(0, 4).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const credentialHash = createHash('sha256')
    .update(`${user.id}:${course.id}:${code}:${issueDate}`)
    .digest('hex');
  try {
    const certificate = await CertificateModel.create({
      code,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      courseId: course.id,
      courseTitle: course.title,
      instructorName: course.instructor.name,
      issueDate,
      gradePercentage: 98,
      verificationUrl: `/certificate/verify/${code}`,
      credentialHash: `0x${credentialHash}`,
    });
    res.status(201).json({ certificate });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      const certificate = await CertificateModel.findOne({ userId: user.id, courseId });
      if (certificate) {
        res.json({ certificate });
        return;
      }
    }
    throw error;
  }
});

export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({ userId: req.user?.id }).sort({ createdAt: -1 }).limit(100);
  res.json({ orders });
});

export const createOrder = asyncHandler(async (req, res) => {
  const input = orderSchema.parse(req.body);
  const courseIds = [...new Set(input.items.map((item) => item.courseId))];
  if (courseIds.length !== input.items.length) throw new HttpError(400, 'Duplicate courses are not allowed');

  const courses = await CourseModel.find({ _id: { $in: courseIds }, status: 'published' });
  if (courses.length !== courseIds.length) throw new HttpError(404, 'One or more courses are unavailable');
  const items = courses.map((course) => ({
    courseId: course.id,
    title: course.title,
    price: course.price,
  }));
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discountPercent = input.couponApplied === 'LEARNOVA20' ? 20
    : input.couponApplied === 'ARCHITECT15' ? 15
      : 0;
  const discount = Math.round((subtotal * discountPercent) / 100);
  const order = await OrderModel.create({
    orderNumber: `LNV-ORD-${new Date().getFullYear()}-${randomInt(1000, 10000)}`,
    userId: req.user?.id,
    items,
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
    couponApplied: input.couponApplied,
    paymentMethod: input.paymentMethod,
    status: 'completed',
  });
  res.status(201).json({ order });
});

export const listDiscussions = asyncHandler(async (req, res) => {
  const input = discussionSchema.pick({ courseId: true, lectureId: true }).parse(req.query);
  await getEnrolledCourse(req.user!.id, input.courseId);
  const discussions = await DiscussionModel.find(input).sort({ createdAt: 1 }).limit(200);
  res.json({
    discussions: discussions.map((discussion) => ({
      ...discussion.toJSON(),
      author: discussion.authorName,
      avatar: discussion.authorAvatar,
      time: 'Recently',
    })),
  });
});

export const createDiscussion = asyncHandler(async (req, res) => {
  const input = discussionSchema.parse(req.body);
  const course = await getEnrolledCourse(req.user!.id, input.courseId);
  if (!course.sections.some((section) => section.lectures.some((lecture) => lecture.id === input.lectureId))) {
    throw new HttpError(400, 'Lecture does not belong to this course');
  }
  const user = await UserModel.findById(req.user?.id);
  if (!user) throw new HttpError(401, 'Authentication required');
  const discussion = await DiscussionModel.create({
    ...input,
    userId: user.id,
    authorName: user.name,
    authorAvatar: user.avatar,
  });
  res.status(201).json({
    discussion: {
      ...discussion.toJSON(),
      author: discussion.authorName,
      avatar: discussion.authorAvatar,
      time: 'Just now',
    },
  });
});
