import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UserModel, type UserRole } from '../models/User.js';
import { asyncHandler } from './asyncHandler.js';
import { HttpError } from './errorHandler.js';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: UserRole };
    }
  }
}

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.learnova_session;
  if (typeof token !== 'string') {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const claims = jwt.verify(token, env.jwtSecret);
    if (typeof claims === 'string' || typeof claims.sub !== 'string') {
      res.status(401).json({ error: 'Invalid authentication token' });
      return;
    }
    const user = await UserModel.findById(claims.sub).select('_id role status');
    if (!user) {
      res.status(401).json({ error: 'Authentication account no longer exists' });
      return;
    }
    if (user.status === 'suspended') {
      res.status(403).json({ error: 'This account has been suspended' });
      return;
    }
    req.user = { id: user.id, role: user.role as UserRole };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Invalid or expired authentication token' });
      return;
    }
    next(error);
  }
});

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.learnova_session;
  if (typeof token !== 'string') {
    next();
    return;
  }

  try {
    const claims = jwt.verify(token, env.jwtSecret);
    if (typeof claims === 'string' || typeof claims.sub !== 'string') {
      throw new HttpError(401, 'Invalid authentication token');
    }
    const user = await UserModel.findById(claims.sub).select('_id role status');
    if (!user) throw new HttpError(401, 'Authentication account no longer exists');
    if (user.status === 'suspended') throw new HttpError(403, 'This account has been suspended');
    req.user = { id: user.id, role: user.role as UserRole };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      throw new HttpError(401, 'Invalid or expired authentication token');
    }
    throw error;
  }
});

export const requireRole = (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'You do not have permission to access this resource' });
      return;
    }
    next();
  };
