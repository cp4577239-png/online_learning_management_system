import { z } from 'zod';
import { CourseModel } from '../models/Course.js';
import { UserModel } from '../models/User.js';
import { HttpError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const courseInputSchema = z.object({
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(3).max(180),
  subtitle: z.string().max(300).optional().default(''),
  description: z.string().min(10).max(10000),
  category: z.string().trim().min(2).max(80),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'All Levels']),
  price: z.number().min(0),
  originalPrice: z.number().min(0).optional().default(0),
  thumbnail: z.string().url().or(z.literal('')).optional().default(''),
  status: z.enum(['published', 'draft', 'under_review']).optional(),
  learningOutcomes: z.array(z.string().max(500)).max(30).optional().default([]),
  requirements: z.array(z.string().max(500)).max(30).optional().default([]),
  quiz: z.object({
    id: z.string().min(1),
    title: z.string().trim().min(1).max(180),
    description: z.string().max(2000).optional().default(''),
    timeLimitMinutes: z.number().int().min(1).max(600),
    passingScorePercentage: z.number().min(0).max(100),
    questions: z.array(z.object({
      id: z.string().min(1),
      question: z.string().min(1).max(2000),
      options: z.array(z.string().min(1).max(500)).min(2).max(10),
      correctOptionIndex: z.number().int().min(0),
      explanation: z.string().max(2000).optional().default(''),
    })).max(100),
  }).optional(),
  sections: z.array(z.object({
    id: z.string().min(1),
    title: z.string().min(1).max(200),
    order: z.number().int().min(0),
    lectures: z.array(z.object({
      id: z.string().min(1),
      title: z.string().min(1).max(200),
      durationMinutes: z.number().min(0).default(0),
      videoUrl: z.string().url().or(z.literal('')).optional().default(''),
      isFreePreview: z.boolean().default(false),
      order: z.number().int().min(0),
      summary: z.string().max(2000).optional().default(''),
    })).max(300).default([]),
  })).max(100).optional().default([]),
});
const statusSchema = z.object({ status: z.enum(['draft', 'under_review', 'published']) });

export const listCourses = asyncHandler(async (req, res) => {
  const filter: Record<string, unknown> = {};
  if (req.user?.role === 'admin') {
    if (req.query.status) filter.status = req.query.status;
  } else if (req.user?.role === 'instructor' && req.query.mine === 'true') {
    filter.instructorId = req.user.id;
  } else {
    filter.status = 'published';
  }
  if (typeof req.query.category === 'string' && req.query.category !== 'All') filter.category = req.query.category;
  if (typeof req.query.level === 'string' && req.query.level !== 'All') filter.level = req.query.level;
  if (typeof req.query.search === 'string' && req.query.search.trim()) {
    const search = req.query.search.trim().slice(0, 100);
    filter.$text = { $search: search };
  }
  const courses = await CourseModel.find(filter).sort({ isFeatured: -1, createdAt: -1 }).limit(100);
  res.json({ courses });
});

export const getCourse = asyncHandler(async (req, res) => {
  const value = req.params.slugOrId;
  const byId = /^[a-f\d]{24}$/i.test(value);
  const course = await CourseModel.findOne({
    ...(byId ? { _id: value } : { slug: value }),
    ...(req.user?.role === 'admin' ? {} : req.user?.role === 'instructor'
      ? { $or: [{ status: 'published' }, { instructorId: req.user.id }] }
      : { status: 'published' }),
  });
  if (!course) throw new HttpError(404, 'Course not found');
  res.json({ course });
});

export const createCourse = asyncHandler(async (req, res) => {
  const input = courseInputSchema.parse(req.body);
  const instructor = await UserModel.findById(req.user?.id);
  if (!instructor) throw new HttpError(401, 'Authentication required');
  const course = await CourseModel.create({
    ...input,
    instructorId: instructor._id,
    instructor: {
      id: instructor.id,
      name: instructor.name,
      avatar: instructor.avatar,
      title: instructor.headline,
      bio: instructor.bio,
    },
    sections: input.sections.map((section) => ({
      ...section,
      courseId: '',
      lectures: section.lectures.map((lecture) => ({ ...lecture, sectionId: section.id })),
    })),
    lecturesCount: input.sections.reduce((sum, section) => sum + section.lectures.length, 0),
    status: req.user?.role === 'admin'
      ? input.status ?? 'draft'
      : input.status === 'under_review' ? 'under_review' : 'draft',
  });
  for (const section of course.sections) section.courseId = course.id;
  await course.save();
  res.status(201).json({ course });
});

export const updateCourseStatus = asyncHandler(async (req, res) => {
  const { status } = statusSchema.parse(req.body);
  if (req.user?.role === 'instructor' && status !== 'under_review' && status !== 'draft') {
    throw new HttpError(403, 'Instructors may submit courses for review but cannot publish them');
  }
  const filter = {
    _id: req.params.courseId,
    ...(req.user?.role === 'instructor' ? { instructorId: req.user.id } : {}),
  };
  const course = await CourseModel.findOneAndUpdate(filter, { $set: { status } }, { new: true, runValidators: true });
  if (!course) throw new HttpError(404, 'Course not found');
  res.json({ course });
});
