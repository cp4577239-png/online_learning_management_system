import type { Request, Response } from 'express';
import { app } from '../src/app.js';
import { connectDatabase } from '../src/config/database.js';

export default async function handler(request: Request, response: Response): Promise<void> {
  await connectDatabase();
  app(request, response);
}
