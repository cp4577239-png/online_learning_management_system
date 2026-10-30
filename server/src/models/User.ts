import { Schema, model } from 'mongoose';

export const userRoles = ['student', 'instructor', 'admin'] as const;
export type UserRole = (typeof userRoles)[number];

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: userRoles, required: true, default: 'student' },
    status: { type: String, enum: ['active', 'suspended'], required: true, default: 'active' },
    avatar: { type: String, default: '' },
    headline: { type: String, maxlength: 160, default: '' },
    bio: { type: String, maxlength: 2000, default: '' },
    totalPoints: { type: Number, min: 0, default: 0 },
    learningStreakDays: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

export const UserModel = model('User', userSchema);

export function serializeUser(user: InstanceType<typeof UserModel>) {
  const { passwordHash, ...safeUser } = user.toObject();
  return {
    ...safeUser,
    id: user.id,
    joinedDate: user.createdAt?.toISOString() ?? '',
  };
}
