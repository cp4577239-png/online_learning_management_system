import { Schema, model, Types } from 'mongoose';

const certificateSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true, trim: true, maxlength: 100 },
    userAvatar: { type: String, default: '' },
    courseId: { type: Types.ObjectId, ref: 'Course', required: true },
    courseTitle: { type: String, required: true, maxlength: 180 },
    instructorName: { type: String, required: true, maxlength: 100 },
    issueDate: { type: String, required: true },
    gradePercentage: { type: Number, min: 0, max: 100, required: true },
    verificationUrl: { type: String, required: true },
    credentialHash: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });
certificateSchema.set('toJSON', { virtuals: true });

export const CertificateModel = model('Certificate', certificateSchema);
