import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { login, logout, register, currentUser, updateProfile } from '../controllers/authController.js';
import { createCourse, getCourse, listCourses, updateCourseStatus } from '../controllers/courseController.js';
import { createEnrollment, getMyEnrollments, updateProgress } from '../controllers/enrollmentController.js';
import { getAdminDashboard, getInstructorDashboard, getInstructorStudents, getMyDashboard, listUsers, updateUserStatus } from '../controllers/dashboardController.js';
import {
  createDiscussion,
  createNote,
  createOrder,
  deleteNote,
  issueCertificate,
  listDiscussions,
  listMyCertificates,
  listMyNotes,
  listMyOrders,
  verifyCertificate,
} from '../controllers/learningController.js';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth.js';
import { env } from '../config/env.js';
import pointsRoutes from './pointsRoutes.js';

const router = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.nodeEnv === 'development',
});

router.use('/auth', pointsRoutes);
router.post('/auth/register', authLimiter, register);
router.post('/auth/login', authLimiter, login);
router.post('/auth/logout', logout);
router.get('/auth/me', requireAuth, currentUser);
router.patch('/auth/me', requireAuth, updateProfile);

router.get('/courses', optionalAuth, listCourses);
router.get('/courses/:slugOrId', optionalAuth, getCourse);
router.post('/courses', requireAuth, requireRole('instructor', 'admin'), createCourse);
router.patch('/courses/:courseId/status', requireAuth, requireRole('instructor', 'admin'), updateCourseStatus);

router.get('/enrollments/me', requireAuth, getMyEnrollments);
router.post('/enrollments', requireAuth, requireRole('student'), createEnrollment);
router.patch('/enrollments/:enrollmentId/progress', requireAuth, requireRole('student'), updateProgress);

router.get('/notes', requireAuth, listMyNotes);
router.post('/notes', requireAuth, requireRole('student'), createNote);
router.delete('/notes/:noteId', requireAuth, requireRole('student'), deleteNote);

router.get('/certificates/verify/:code', verifyCertificate);
router.get('/certificates/me', requireAuth, requireRole('student'), listMyCertificates);
router.post('/certificates/:courseId', requireAuth, requireRole('student'), issueCertificate);

router.get('/orders/me', requireAuth, requireRole('student'), listMyOrders);
router.post('/orders', requireAuth, requireRole('student'), createOrder);

router.get('/discussions', requireAuth, listDiscussions);
router.post('/discussions', requireAuth, createDiscussion);

router.get('/dashboard/me', requireAuth, getMyDashboard);
router.get('/dashboard/instructor', requireAuth, requireRole('instructor', 'admin'), getInstructorDashboard);
router.get('/instructor/students', requireAuth, requireRole('instructor', 'admin'), getInstructorStudents);
router.get('/dashboard/admin', requireAuth, requireRole('admin'), getAdminDashboard);
router.get('/admin/users', requireAuth, requireRole('admin'), listUsers);
router.patch('/admin/users/:userId/status', requireAuth, requireRole('admin'), updateUserStatus);

export default router;
