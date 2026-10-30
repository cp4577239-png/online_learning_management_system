import { connectDatabase } from '../src/config/database.js';
import { UserModel } from '../src/models/User.js';
import mongoose from 'mongoose';

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error('Usage: npm run admin:promote -- user@example.com');
}

try {
  await connectDatabase();
  const user = await UserModel.findOneAndUpdate({ email }, { $set: { role: 'admin' } }, { new: true });
  if (!user) throw new Error(`No registered user found for ${email}`);
  console.info(`Administrator role granted to ${user.email}`);
} finally {
  await mongoose.disconnect();
}
