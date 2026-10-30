import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { Response } from 'express';
import { env } from '../config/env.js';

export const sessionCookieName = 'learnova_session';

export function setSessionCookie(res: Response, userId: string): void {
  const token = jwt.sign({}, env.jwtSecret, { subject: userId, expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] });
  res.cookie(sessionCookieName, token, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api',
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(sessionCookieName, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    path: '/api',
  });
}

export const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, 12);
export const verifyPassword = (password: string, hash: string): Promise<boolean> => bcrypt.compare(password, hash);
