import { Schema, model, Types } from 'mongoose';

const resourceSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    fileSize: { type: String, default: '' },
    type: { type: String, enum: ['pdf', 'zip', 'code', 'link'], default: 'link' },
  },
  { _id: false },
);

const lectureSchema = new Schema(
  {
    id: { type: String, required: true },
    sectionId: { type: String, required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    durationMinutes: { type: Number, min: 0, default: 0 },
    videoUrl: { type: String, default: '' },
    isFreePreview: { type: Boolean, default: false },
    order: { type: Number, min: 0, default: 0 },
    summary: { type: String, maxlength: 2000, default: '' },
    resources: { type: [resourceSchema], default: [] },
    starterCode: { type: String, default: '' },
  },
  { _id: false },
);

const sectionSchema = new Schema(
  {
    id: { type: String, required: true },
    courseId: { type: String, required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    order: { type: Number, min: 0, default: 0 },
    lectures: { type: [lectureSchema], default: [] },
  },
  { _id: false },
);

const instructorSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    title: { type: String, default: '' },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    studentsCount: { type: Number, min: 0, default: 0 },
    bio: { type: String, maxlength: 2000, default: '' },
  },
  { _id: false },
);

const quizQuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    question: { type: String, required: true, maxlength: 2000 },
    options: { type: [String], required: true },
    correctOptionIndex: { type: Number, min: 0, required: true },
    explanation: { type: String, default: '', maxlength: 2000 },
  },
  { _id: false },
);

const quizSchema = new Schema(
  {
    id: { type: String, required: true },
    courseId: { type: String, required: true },
    title: { type: String, required: true, maxlength: 180 },
    description: { type: String, default: '', maxlength: 2000 },
    timeLimitMinutes: { type: Number, min: 1, required: true },
    passingScorePercentage: { type: Number, min: 0, max: 100, required: true },
    questions: { type: [quizQuestionSchema], default: [] },
  },
  { _id: false },
);

const courseSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 180 },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    subtitle: { type: String, default: '', maxlength: 300 },
    description: { type: String, required: true, maxlength: 10000 },
    category: { type: String, required: true, maxlength: 80 },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], required: true },
    price: { type: Number, min: 0, required: true },
    originalPrice: { type: Number, min: 0, default: 0 },
    thumbnail: { type: String, default: '' },
    instructorId: { type: Types.ObjectId, ref: 'User', required: true },
    instructor: { type: instructorSchema, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, min: 0, default: 0 },
    enrolledCount: { type: Number, min: 0, default: 0 },
    durationHours: { type: Number, min: 0, default: 0 },
    lecturesCount: { type: Number, min: 0, default: 0 },
    lastUpdated: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    status: { type: String, enum: ['published', 'draft', 'under_review'], default: 'draft' },
    learningOutcomes: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    sections: { type: [sectionSchema], default: [] },
    quiz: { type: quizSchema },
  },
  { timestamps: true, versionKey: false },
);

courseSchema.index({ status: 1, category: 1, level: 1 });
courseSchema.index({ instructorId: 1, status: 1 });
courseSchema.index({ title: 'text', subtitle: 'text', description: 'text' });
courseSchema.set('toJSON', { virtuals: true });

export const CourseModel = model('Course', courseSchema);

export function serializeCourse(course: InstanceType<typeof CourseModel>) {
  const value = course.toObject();
  return {
    ...value,
    id: course.id,
    instructorId: course.instructorId.toString(),
    ...(value.quiz ? { quiz: { ...value.quiz, courseId: course.id } } : {}),
  };
}
