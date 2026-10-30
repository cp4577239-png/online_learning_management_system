import { api } from '../lib/api';
import { Course, CourseCategory, CourseLevel, Lecture, Section } from '../types';

interface CoursePayload extends Omit<Course, 'id' | 'category' | 'instructorId' | 'sections'> {
  id?: string;
  _id?: string;
  category: string;
  instructorId: string | { toString(): string };
  sections: Array<Omit<Section, 'courseId' | 'lectures'> & {
    courseId?: string;
    lectures: Lecture[];
  }>;
}

interface CourseListResponse {
  courses: CoursePayload[];
}

interface CourseResponse {
  course: CoursePayload;
}

function mapCourse(course: CoursePayload): Course {
  const id = course.id || course._id;
  if (!id) throw new Error('The course response is missing its id.');

  return {
    ...course,
    id,
    category: course.category as CourseCategory,
    level: course.level as CourseLevel,
    instructorId: course.instructorId.toString(),
    sections: course.sections.map((section) => ({
      ...section,
      courseId: section.courseId || id,
      lectures: section.lectures.map((lecture) => ({
        ...lecture,
        sectionId: lecture.sectionId || section.id,
      })),
    })),
  };
}

export interface CourseFilters {
  category?: string;
  level?: CourseLevel | 'All';
  search?: string;
  mine?: boolean;
}

export interface InstructorDashboardData {
  stats: { courses: number; students: number; grossRevenue: number };
  courses: Course[];
  transactions: Array<{
    id: string;
    orderNumber: string;
    date: string;
    description: string;
    amount: number;
    status: string;
  }>;
}

export interface InstructorStudent {
  id: string;
  name: string;
  email: string;
  courseTitle: string;
  enrolledAt: string;
  lastAccessedAt: string;
  progress: number;
}

interface InstructorDashboardResponse {
  stats: InstructorDashboardData['stats'];
  courses: CoursePayload[];
  transactions: InstructorDashboardData['transactions'];
}

interface InstructorStudentsResponse {
  students: InstructorStudent[];
}

export async function listCourses(filters: CourseFilters = {}): Promise<Course[]> {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'All') params.set('category', filters.category);
  if (filters.level && filters.level !== 'All') params.set('level', filters.level);
  if (filters.search?.trim()) params.set('search', filters.search.trim());
  if (filters.mine) params.set('mine', 'true');

  const query = params.toString();
  const response = await api.get<CourseListResponse>(`/courses${query ? `?${query}` : ''}`);
  return response.courses.map(mapCourse);
}

export async function getCourse(slugOrId: string): Promise<Course> {
  const response = await api.get<CourseResponse>(`/courses/${encodeURIComponent(slugOrId)}`);
  return mapCourse(response.course);
}

export async function createCourse(course: Course): Promise<Course> {
  const response = await api.post<CourseResponse>('/courses', course);
  return mapCourse(response.course);
}

export async function getInstructorDashboard(): Promise<InstructorDashboardData> {
  const response = await api.get<InstructorDashboardResponse>('/dashboard/instructor');
  return {
    stats: response.stats,
    courses: response.courses.map(mapCourse),
    transactions: response.transactions,
  };
}

export async function listInstructorStudents(): Promise<InstructorStudent[]> {
  const response = await api.get<InstructorStudentsResponse>('/instructor/students');
  return response.students;
}
