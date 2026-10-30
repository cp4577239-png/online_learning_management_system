import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Request validation failed',
      details: error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })),
    });
    return;
  }
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: 'Invalid request data' });
    return;
  }
  if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
    res.status(409).json({ error: 'A record with these details already exists' });
    return;
  }
  console.error('Unhandled request error:', error);
  res.status(500).json({ error: 'An unexpected server error occurred' });
};
