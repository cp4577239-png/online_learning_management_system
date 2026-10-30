import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/database.js';
import { CourseModel } from '../src/models/Course.js';
import { UserModel } from '../src/models/User.js';

interface SeedCourse {
  slug: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    rating: number;
    studentsCount: number;
    bio: string;
  };
  sections: Array<{ courseId: string; [key: string]: unknown }>;
  quiz?: { courseId: string; [key: string]: unknown };
  [key: string]: unknown;
}

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error('Usage: npm run seed:courses -- instructor@example.com');
}

try {
  await connectDatabase();

  const instructor = await UserModel.findOne({ email });
  if (!instructor || instructor.role !== 'instructor') {
    throw new Error('Register an instructor account first and provide its email address.');
  }

  const moduleUrl = pathToFileURL(resolve(process.cwd(), '../client/src/data/mockData.ts')).href;
  const { SAMPLE_COURSES } = await import(moduleUrl) as { SAMPLE_COURSES: SeedCourse[] };
  let inserted = 0;

  for (const sample of SAMPLE_COURSES) {
    if (await CourseModel.exists({ slug: sample.slug })) continue;

    const course = new CourseModel({
      ...sample,
      _id: undefined,
      id: undefined,
      instructorId: instructor._id,
      instructor: {
        ...sample.instructor,
        id: instructor.id,
        name: instructor.name,
        avatar: instructor.avatar || sample.instructor.avatar,
        title: instructor.headline || sample.instructor.title,
        bio: instructor.bio || sample.instructor.bio,
      },
      sections: sample.sections.map((section) => ({ ...section, courseId: '' })),
      status: 'published',
    });

    for (const section of course.sections) section.courseId = course.id;
    if (course.quiz) course.quiz.courseId = course.id;
    await course.save();
    inserted += 1;
  }

  console.info(`Seeded ${inserted} sample course(s) for ${instructor.email}.`);
} finally {
  await mongoose.disconnect();
}
