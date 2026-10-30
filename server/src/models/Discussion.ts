import { Schema, model, Types } from 'mongoose';

const discussionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Types.ObjectId, ref: 'Course', required: true },
    lectureId: { type: String, required: true },
    authorName: { type: String, required: true, maxlength: 100 },
    authorAvatar: { type: String, default: '' },
    content: { type: String, required: true, maxlength: 5000 },
  },
  { timestamps: true, versionKey: false },
);

discussionSchema.index({ courseId: 1, lectureId: 1, createdAt: 1 });
discussionSchema.set('toJSON', { virtuals: true });

export const DiscussionModel = model('Discussion', discussionSchema);
