import { Schema, model, Types } from 'mongoose';

const enrollmentSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Types.ObjectId, ref: 'Course', required: true },
    enrolledAt: { type: Date, default: Date.now },
    lastAccessedAt: { type: Date, default: Date.now },
    completedLectureIds: { type: [String], default: [] },
    currentLectureId: { type: String, default: '' },
    progressPercentage: { type: Number, min: 0, max: 100, default: 0 },
    completedAt: { type: Date },
  },
  { timestamps: true, versionKey: false },
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.set('toJSON', { virtuals: true });

export const EnrollmentModel = model('Enrollment', enrollmentSchema);
