import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { addMyPoints } from '../controllers/pointsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
const pointsLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });

router.patch('/me/points', pointsLimiter, requireAuth, requireRole('student'), addMyPoints);

export default router;
