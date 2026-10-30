import { Schema, model, Types } from 'mongoose';

const noteSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Types.ObjectId, ref: 'Course', required: true },
    lectureId: { type: String, required: true },
    lectureTitle: { type: String, required: true, maxlength: 200 },
    timestampSeconds: { type: Number, min: 0, required: true },
    text: { type: String, required: true, maxlength: 5000 },
  },
  { timestamps: true, versionKey: false },
);

noteSchema.index({ userId: 1, courseId: 1, createdAt: -1 });
noteSchema.set('toJSON', { virtuals: true });

export const NoteModel = model('Note', noteSchema);
