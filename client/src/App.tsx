import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { EnrollmentProvider } from './context/EnrollmentContext';
import { Course } from './types';
import { describeApiError } from './lib/api';
import { getCourse } from './services/courseService';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { Sidebar } from './components/dashboard/Sidebar';
import { DashboardHeader } from './components/dashboard/DashboardHeader';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { CoursesCatalogPage } from './pages/public/CoursesCatalogPage';
import { CourseDetailPage } from './pages/public/CourseDetailPage';
import { InstructorsPage } from './pages/public/InstructorsPage';
import { PricingPage } from './pages/public/PricingPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { CertificateVerifyPage } from './pages/public/CertificateVerifyPage';

// Student Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { MyLearningPage } from './pages/student/MyLearningPage';
import { CourseLearningPlayerPage } from './pages/student/CourseLearningPlayerPage';
import { StudentCartPage } from './pages/student/StudentCartPage';
import { StudentOrdersPage } from './pages/student/StudentOrdersPage';
import { StudentNotesPage } from './pages/student/StudentNotesPage';
import { StudentQuizzesPage } from './pages/student/StudentQuizzesPage';
import { StudentCertificatesPage } from './pages/student/StudentCertificatesPage';
import { StudentMessagesPage } from './pages/student/StudentMessagesPage';
import { StudentSettingsPage } from './pages/student/StudentSettingsPage';

// Instructor Pages
import { InstructorDashboardPage } from './pages/instructor/InstructorDashboardPage';
import { InstructorCoursesPage } from './pages/instructor/InstructorCoursesPage';
import { CourseBuilderPage } from './pages/instructor/CourseBuilderPage';
import { InstructorStudentsPage } from './pages/instructor/InstructorStudentsPage';
import { InstructorEarningsPage } from './pages/instructor/InstructorEarningsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

function AppContent() {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseDetailLoading, setCourseDetailLoading] = useState(false);
  const [courseDetailError, setCourseDetailError] = useState<string | null>(null);

  // Handle URL hash/history changes
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentPath(hash);
    };

    if (window.location.hash) {
      setCurrentPath(window.location.hash.replace('#', ''));
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const isCourseDetail = currentPath.startsWith('/courses/');
    const isLearningRoute = currentPath.startsWith('/student/course/');
    if (!isCourseDetail && !isLearningRoute) return;
    const identifier = isCourseDetail
      ? decodeURIComponent(currentPath.slice('/courses/'.length))
      : currentPath.split('/')[3];
    if (!identifier) return;

    let active = true;
    setSelectedCourse((course) => course?.slug === identifier || course?.id === identifier ? course : null);
    setCourseDetailLoading(true);
    setCourseDetailError(null);

    getCourse(identifier)
      .then((course) => {
        if (active) setSelectedCourse(course);
      })
      .catch((error: unknown) => {
        if (active) {
          setSelectedCourse(null);
          setCourseDetailError(describeApiError(error));
        }
      })
      .finally(() => {
        if (active) setCourseDetailLoading(false);
      });

    return () => {
      active = false;
    };
  }, [currentPath]);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    navigate(`/courses/${course.slug}`);
  };

  const handleStartLearning = (course: Course) => {
    setSelectedCourse(course);
    navigate(`/student/course/${course.id}/learn`);
  };

  // Determine view mode
  const isLearningPlayer = currentPath.startsWith('/student/course/') && currentPath.endsWith('/learn');
  const isDashboardView =
    currentPath.startsWith('/student/') ||
    currentPath.startsWith('/instructor/') ||
    currentPath.startsWith('/admin/');

  // Determine breadcrumbs for DashboardHeader
  const getBreadcrumbs = () => {
    if (currentPath.startsWith('/student')) {
      const sub = currentPath.split('/')[2] || 'dashboard';
      const map: Record<string, string> = {
        dashboard: 'Overview',
        'my-learning': 'My Learning',
        quizzes: 'Assessments',
        certificates: 'Certificates',
        notes: 'Notes & Resources',
        orders: 'Orders & Receipts',
        cart: 'Shopping Cart',
        wishlist: 'Wishlist',
        messages: 'Instructor Q&A',
        settings: 'Account Settings',
      };
      return ['Student Portal', map[sub] || 'Workspace'];
    }
    if (currentPath.startsWith('/instructor')) {
      const sub = currentPath.split('/')[2] || 'dashboard';
      const map: Record<string, string> = {
        dashboard: 'Analytics',
        courses: 'Manage Courses',
        students: 'Student Roster',
        earnings: 'Earnings & Payouts',
        messages: 'Student Messages',
        settings: 'Account Settings',
      };
      return ['Instructor Studio', map[sub] || 'Curriculum Builder'];
    }
    if (currentPath.startsWith('/admin')) {
      const sub = currentPath.split('/')[2] || 'dashboard';
      const map: Record<string, string> = {
        dashboard: 'Command Center',
        users: 'User Directory',
        courses: 'Course Governance',
        analytics: 'Financial Telemetry',
        'audit-logs': 'Security Audit Trail',
        settings: 'Account Settings',
      };
      return ['Admin Console', map[sub] || 'Settings'];
    }
    return ['Learnova'];
  };

  // If in immersive Learning Player mode, show full-screen classroom
  if (isLearningPlayer) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {selectedCourse ? (
          <CourseLearningPlayerPage course={selectedCourse} navigate={navigate} />
        ) : (
          <div className="p-6 text-center text-xs text-slate-400">
            {courseDetailError || (courseDetailLoading ? 'Loading course...' : 'Course not found.')}
          </div>
        )}
        <RoleSwitcher currentPath={currentPath} navigate={navigate} />
      </div>
    );
  }

  // If in Dashboard View, render Sidebar + DashboardHeader
  if (isDashboardView) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-200">
        <Sidebar currentPath={currentPath} navigate={navigate} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader
            breadcrumbs={getBreadcrumbs()}
            primaryAction={
              currentPath.startsWith('/instructor')
                ? { label: 'New Course', onClick: () => navigate('/instructor/courses/new') }
                : currentPath.startsWith('/student')
                ? { label: 'Catalog', onClick: () => navigate('/courses') }
                : undefined
            }
          />

          <main className="flex-1 overflow-y-auto">
            {/* Student routes */}
            {currentPath === '/student/dashboard' && (
              <StudentDashboardPage navigate={navigate} onStartLearning={handleStartLearning} />
            )}
            {currentPath === '/student/my-learning' && (
              <MyLearningPage navigate={navigate} onStartLearning={handleStartLearning} />
            )}
            {currentPath === '/student/quizzes' && <StudentQuizzesPage />}
            {currentPath === '/student/certificates' && <StudentCertificatesPage navigate={navigate} />}
            {currentPath === '/student/cart' && <StudentCartPage navigate={navigate} />}
            {currentPath === '/student/wishlist' && (
              <CoursesCatalogPage onSelectCourse={handleSelectCourse} />
            )}
            {currentPath === '/student/orders' && <StudentOrdersPage />}
            {currentPath === '/student/notes' && <StudentNotesPage />}
            {currentPath === '/student/messages' && <StudentMessagesPage />}
            {currentPath === '/student/settings' && <StudentSettingsPage navigate={navigate} />}

            {/* Instructor routes */}
            {currentPath === '/instructor/dashboard' && <InstructorDashboardPage navigate={navigate} />}
            {currentPath === '/instructor/courses' && <InstructorCoursesPage navigate={navigate} />}
            {currentPath.startsWith('/instructor/courses/new') && <CourseBuilderPage navigate={navigate} />}
            {currentPath === '/instructor/students' && <InstructorStudentsPage />}
            {currentPath === '/instructor/earnings' && <InstructorEarningsPage />}
            {currentPath === '/instructor/messages' && <StudentMessagesPage />}
            {currentPath === '/instructor/settings' && <StudentSettingsPage navigate={navigate} />}

            {/* Admin routes */}
            {currentPath === '/admin/dashboard' && <AdminDashboardPage navigate={navigate} />}
            {currentPath === '/admin/users' && <AdminUsersPage />}
            {currentPath === '/admin/courses' && <AdminDashboardPage navigate={navigate} />}
            {currentPath === '/admin/analytics' && <InstructorEarningsPage />}
            {currentPath === '/admin/audit-logs' && <AdminAuditLogsPage />}
            {currentPath === '/admin/settings' && <StudentSettingsPage navigate={navigate} />}
          </main>
        </div>

        <RoleSwitcher currentPath={currentPath} navigate={navigate} />
      </div>
    );
  }

  // Public Layout (Navbar + Page + Footer)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar currentPath={currentPath} navigate={navigate} />

      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage navigate={navigate} onSelectCourse={handleSelectCourse} />
        )}
        {(currentPath === '/courses' || currentPath.startsWith('/courses?')) && (
          <CoursesCatalogPage onSelectCourse={handleSelectCourse} />
        )}
        {currentPath.startsWith('/courses/') && (
          selectedCourse?.slug === decodeURIComponent(currentPath.slice('/courses/'.length)) ? (
            <CourseDetailPage
              course={selectedCourse}
              navigate={navigate}
              onStartLearning={handleStartLearning}
            />
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
              {courseDetailError || (courseDetailLoading ? 'Loading course...' : 'Course not found.')}
            </div>
          )
        )}
        {currentPath === '/instructors' && <InstructorsPage navigate={navigate} />}
        {currentPath === '/pricing' && <PricingPage navigate={navigate} />}
        {currentPath === '/about' && <AboutPage />}
        {currentPath === '/contact' && <ContactPage />}
        {currentPath === '/login' && <LoginPage navigate={navigate} />}
        {currentPath === '/register' && <RegisterPage navigate={navigate} />}
        {currentPath.startsWith('/certificate/verify') && (
          <CertificateVerifyPage
            initialCode={currentPath.split('/')[3] || ''}
            navigate={navigate}
          />
        )}
      </main>

      <Footer navigate={navigate} />
      <RoleSwitcher currentPath={currentPath} navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <EnrollmentProvider>
            <AppContent />
          </EnrollmentProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
