import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import mongoose from 'mongoose';

await connectDatabase();
const server = app.listen(env.port, () => {
  console.info(`API listening on port ${env.port}`);
});

const shutdown = async (signal: string): Promise<void> => {
  console.info(`${signal} received; shutting down`);
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
