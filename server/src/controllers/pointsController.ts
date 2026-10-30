import { z } from 'zod';
import { UserModel, serializeUser } from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { HttpError } from '../middleware/errorHandler.js';

const pointsSchema = z.object({
  points: z.number().int().positive().max(100),
});

export const addMyPoints = asyncHandler(async (req, res) => {
  const { points } = pointsSchema.parse(req.body);
  const user = await UserModel.findByIdAndUpdate(
    req.user?.id,
    { $inc: { totalPoints: points } },
    { new: true, runValidators: true },
  );
  if (!user) throw new HttpError(404, 'User account not found');
  res.json({ user: serializeUser(user) });
});
