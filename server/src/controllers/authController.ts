import { z } from 'zod';
import { UserModel, serializeUser } from '../models/User.js';
import { HttpError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { clearSessionCookie, hashPassword, setSessionCookie, verifyPassword } from '../utils/auth.js';

const registrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
  role: z.enum(['student', 'instructor']).default('student'),
});
const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});
const profileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  headline: z.string().trim().max(160).optional().default(''),
  bio: z.string().trim().max(2000).optional().default(''),
  avatar: z.string().max(700_000).optional().refine(
    (value) => value === undefined
      || value === ''
      || /^https?:\/\/\S+$/i.test(value)
      || /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value),
    'Avatar must be an HTTP(S) URL or a supported image data URL',
  ),
});

export const register = asyncHandler(async (req, res) => {
  const input = registrationSchema.parse(req.body);
  const email = input.email.toLowerCase();
  if (await UserModel.exists({ email })) throw new HttpError(409, 'An account with this email already exists');

  const user = await UserModel.create({
    name: input.name,
    email,
    passwordHash: await hashPassword(input.password),
    role: input.role,
  });
  setSessionCookie(res, user.id);
  res.status(201).json({ user: serializeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const user = await UserModel.findOne({ email: input.email.toLowerCase() }).select('+passwordHash');
  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new HttpError(401, 'Email or password is incorrect');
  }
  if (user.status === 'suspended') throw new HttpError(403, 'This account has been suspended');
  setSessionCookie(res, user.id);
  res.json({ user: serializeUser(user) });
});

export const currentUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user?.id);
  if (!user) throw new HttpError(404, 'User account not found');
  res.json({ user: serializeUser(user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const input = profileSchema.parse(req.body);
  const user = await UserModel.findByIdAndUpdate(
    req.user?.id,
    { $set: input },
    { new: true, runValidators: true },
  );
  if (!user) throw new HttpError(404, 'User account not found');
  res.json({ user: serializeUser(user) });
});

export const logout = asyncHandler(async (_req, res) => {
  clearSessionCookie(res);
  res.status(204).end();
});
