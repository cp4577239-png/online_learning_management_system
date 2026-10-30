import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Course } from '../../types';
import { describeApiError } from '../../lib/api';
import { getInstructorDashboard, InstructorDashboardData } from '../../services/courseService';
import {
  Users,
  DollarSign,
  Star,
  BookOpen,
  PlusCircle,
} from 'lucide-react';

interface InstructorDashboardPageProps {
  navigate: (path: string) => void;
}

export const InstructorDashboardPage: React.FC<InstructorDashboardPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<InstructorDashboardData>({
    stats: { courses: 0, students: 0, grossRevenue: 0 },
    courses: [],
    transactions: [],
  });
  const [dashboardError, setDashboardError] = useState('');
  const myCourses: Course[] = dashboard.courses;

  useEffect(() => {
    let active = true;
    void getInstructorDashboard()
      .then((result) => { if (active) setDashboard(result); })
      .catch((error: unknown) => {
        if (active) setDashboardError(describeApiError(error));
      });
    return () => { active = false; };
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Instructor Performance Dashboard
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Welcome, {user?.name || 'Instructor'}. Your course performance is based on actual MongoDB enrollments and orders.
          </p>
        </div>
        <button
          onClick={() => navigate('/instructor/courses/new')}
          className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch New Course</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            {dashboard.stats.students.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <span>Across your courses</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Gross Royalties Earned</span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            ₹{dashboard.stats.grossRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Gross completed course orders
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Instructor Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            {myCourses.length
              ? (myCourses.reduce((sum, course) => sum + course.rating, 0) / myCourses.length).toFixed(2)
              : '—'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Average across your courses
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Curriculum</span>
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            {dashboard.stats.courses}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            All statuses
          </div>
        </div>

      </div>

      {/* Course performance summary */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold">MongoDB course performance</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enrollment counts and gross sales refresh from your saved courses and completed orders.
        </p>
        {dashboardError && <p className="text-xs text-rose-600">{dashboardError}</p>}
      </div>

      {/* Courses Managed Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold">Your Masterclasses</h2>
          <button
            onClick={() => navigate('/instructor/courses')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Manage Curriculum
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {myCourses.map((course) => (
            <div
              key={course.id}
              className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  referrerPolicy="no-referrer"
                  className="w-24 aspect-video rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                />
                <div>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block">
                    {course.category}
                  </span>
                  <h3 className="text-sm font-bold">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-1">
                    <span>{course.enrolledCount.toLocaleString()} students</span>
                    <span aria-hidden="true">·</span>
                    <span>₹{course.price.toLocaleString('en-IN')} price</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">{course.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => navigate('/instructor/courses/new')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Edit Curriculum
                </button>
                <button
                  onClick={() => navigate('/instructor/students')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg transition-colors"
                >
                  View Students
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
