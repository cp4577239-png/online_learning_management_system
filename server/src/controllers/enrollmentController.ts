import { z } from 'zod';
import { CourseModel, serializeCourse } from '../models/Course.js';
import { EnrollmentModel } from '../models/Enrollment.js';
import { OrderModel } from '../models/Order.js';
import { HttpError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const createEnrollmentSchema = z.object({ courseId: z.string().regex(/^[a-f\d]{24}$/i) });
const progressSchema = z.object({
  lectureId: z.string().min(1).max(100),
  completed: z.boolean().optional().default(false),
});

const populateCourse = {
  path: 'courseId',
  select: '-__v',
};

export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await EnrollmentModel.find({ userId: req.user?.id })
    .populate<{ courseId: InstanceType<typeof CourseModel> }>(populateCourse)
    .sort({ lastAccessedAt: -1 });
  res.json({
    enrollments: enrollments.map((enrollment) => {
      const course = serializeCourse(enrollment.courseId);
      const value = enrollment.toJSON();
      return {
        ...value,
        id: enrollment.id,
        userId: enrollment.userId.toString(),
        courseId: course.id,
        course,
      };
    }),
  });
});

export const createEnrollment = asyncHandler(async (req, res) => {
  const { courseId } = createEnrollmentSchema.parse(req.body);
  const course = await CourseModel.findOne({ _id: courseId, status: 'published' });
  if (!course) throw new HttpError(404, 'Published course not found');
  const existingEnrollment = await EnrollmentModel.findOne({ userId: req.user?.id, courseId });
  if (existingEnrollment) {
    const value = existingEnrollment.toJSON();
    res.json({
      enrollment: {
        ...value,
        id: existingEnrollment.id,
        userId: existingEnrollment.userId.toString(),
        courseId: course.id,
        course: serializeCourse(course),
      },
    });
    return;
  }
  if (course.price > 0 && !await OrderModel.exists({
    userId: req.user?.id,
    status: 'completed',
    'items.courseId': courseId,
  })) {
    throw new HttpError(402, 'Purchase this course before enrolling');
  }
  const firstLectureId = course.sections[0]?.lectures[0]?.id ?? '';
  let enrollment: InstanceType<typeof EnrollmentModel>;
  try {
    enrollment = await EnrollmentModel.create({
      userId: req.user?.id,
      courseId,
      currentLectureId: firstLectureId,
    });
  } catch (error) {
    if (!(error && typeof error === 'object' && 'code' in error && error.code === 11000)) {
      throw error;
    }
    const duplicateEnrollment = await EnrollmentModel.findOne({ userId: req.user?.id, courseId });
    if (!duplicateEnrollment) throw error;
    const value = duplicateEnrollment.toJSON();
    res.json({
      enrollment: {
        ...value,
        id: duplicateEnrollment.id,
        userId: duplicateEnrollment.userId.toString(),
        courseId: course.id,
        course: serializeCourse(course),
      },
    });
    return;
  }
  await CourseModel.updateOne({ _id: courseId }, { $inc: { enrolledCount: 1 } });
  course.enrolledCount += 1;
  const populatedCourse = serializeCourse(course);
  const value = enrollment.toJSON();
  res.status(201).json({
    enrollment: {
      ...value,
      id: enrollment.id,
      userId: enrollment.userId.toString(),
      courseId: course.id,
      course: populatedCourse,
    },
  });
});

export const updateProgress = asyncHandler(async (req, res) => {
  const { lectureId, completed } = progressSchema.parse(req.body);
  const enrollment = await EnrollmentModel.findOne({ _id: req.params.enrollmentId, userId: req.user?.id })
    .populate<{ courseId: InstanceType<typeof CourseModel> }>(populateCourse);
  if (!enrollment) throw new HttpError(404, 'Enrollment not found');
  const course = enrollment.courseId;
  const lectures = course.sections.flatMap((section) => section.lectures);
  if (!lectures.some((lecture) => lecture.id === lectureId)) {
    throw new HttpError(400, 'Lecture does not belong to this course');
  }
  enrollment.currentLectureId = lectureId;
  enrollment.lastAccessedAt = new Date();
  if (completed && !enrollment.completedLectureIds.includes(lectureId)) {
    enrollment.completedLectureIds.push(lectureId);
  }
  const total = lectures.length;
  enrollment.progressPercentage = total === 0
    ? 0
    : Math.round((enrollment.completedLectureIds.length / total) * 100);
  if (enrollment.progressPercentage === 100) enrollment.completedAt = new Date();
  await enrollment.save();
  const serializedCourse = serializeCourse(course);
  const value = enrollment.toJSON();
  res.json({
    enrollment: {
      ...value,
      id: enrollment.id,
      userId: enrollment.userId.toString(),
      courseId: serializedCourse.id,
      course: serializedCourse,
    },
  });
});
