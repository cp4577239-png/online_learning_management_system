import mongoose from 'mongoose';
import { env } from './env.js';

declare global {
  var learnovaMongoConnection: Promise<typeof mongoose> | undefined;
}

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;

  if (!globalThis.learnovaMongoConnection) {
    globalThis.learnovaMongoConnection = mongoose.connect(env.mongoUri, {
      minPoolSize: 0, // Avoid idle pool connections in scaled-down serverless instances.
      maxPoolSize: 5, // Keep per-instance connections bounded for the low-concurrency workload.
      maxIdleTimeMS: 30000, // Release unused connections between serverless bursts.
      serverSelectionTimeoutMS: 10000, // Preserve the existing fail-fast connection behavior.
    }).then((connection) => {
      globalThis.learnovaMongoConnection = undefined;
      console.info('MongoDB connected');
      return connection;
    }).catch((error: unknown) => {
      globalThis.learnovaMongoConnection = undefined;
      console.error('MongoDB connection failed:', error);
      throw error;
    });
  }

  await globalThis.learnovaMongoConnection;
}
