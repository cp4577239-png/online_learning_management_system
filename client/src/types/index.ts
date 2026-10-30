/**
 * Learnova LMS - Core Domain Types
 */

export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: 'active' | 'suspended';
  avatar: string;
  headline?: string;
  bio?: string;
  joinedDate: string;
  badges?: string[];
  learningStreakDays?: number;
  totalPoints?: number;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type CourseCategory = 
  | 'Software Engineering' 
  | 'System Architecture' 
  | 'Data & AI' 
  | 'Cloud & DevOps' 
  | 'UI/UX Design' 
  | 'Cybersecurity';

export interface LectureResource {
  id: string;
  name: string;
  url: string;
  fileSize: string;
  type: 'pdf' | 'zip' | 'code' | 'link';
}

export interface Lecture {
  id: string;
  sectionId: string;
  title: string;
  durationMinutes: number;
  videoUrl: string; // standard html5 video / mp4 / embed
  isFreePreview: boolean;
  order: number;
  summary?: string;
  resources?: LectureResource[];
  starterCode?: string;
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lectures: Lecture[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScorePercentage: number;
  questions: Question[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  attemptedAt: string;
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  likes: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  price: number;
  originalPrice: number;
  thumbnail: string;
  instructorId: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    rating: number;
    studentsCount: number;
    bio: string;
  };
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  durationHours: number;
  lecturesCount: number;
  lastUpdated: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  status: 'published' | 'draft' | 'under_review';
  learningOutcomes: string[];
  requirements: string[];
  sections: Section[];
  quiz?: Quiz;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  enrolledAt: string;
  lastAccessedAt: string;
  completedLectureIds: string[];
  currentLectureId: string;
  progressPercentage: number;
  completedAt?: string;
  certificateId?: string;
}

export interface Certificate {
  id: string;
  code: string;
  userId: string;
  userName: string;
  userAvatar: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  gradePercentage: number;
  verificationUrl: string;
  credentialHash: string;
}

export interface CartItem {
  course: Course;
  addedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: {
    courseId: string;
    title: string;
    price: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  couponApplied?: string | null;
  paymentMethod: 'razorpay' | 'card' | 'upi' | 'wallet';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
}

export interface TimestampedNote {
  id: string;
  courseId: string;
  lectureId: string;
  lectureTitle: string;
  timestampSeconds: number;
  text: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'course' | 'quiz' | 'payment' | 'system' | 'message';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface DiscussionMessage {
  id: string;
  courseId: string;
  lectureId?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  content: string;
  timestamp: string;
  upvotes: number;
  hasInstructorReply?: boolean;
}
