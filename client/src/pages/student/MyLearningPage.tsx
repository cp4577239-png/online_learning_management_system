import React, { useState } from 'react';
import { useEnrollment } from '../../context/EnrollmentContext';
import { Course } from '../../types';
import { PlayCircle, Award, CheckCircle, Search, SlidersHorizontal, BookOpen } from 'lucide-react';
import { getCourseLectureCount } from '../../data/courseLectureContent';

interface MyLearningPageProps {
  navigate: (path: string) => void;
  onStartLearning: (course: Course) => void;
}

export const MyLearningPage: React.FC<MyLearningPageProps> = ({
  navigate,
  onStartLearning,
}) => {
  const { enrollments } = useEnrollment();
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const filtered = enrollments.filter((e) => {
    const matchesSearch = e.course.title.toLowerCase().includes(search.toLowerCase());
    if (filter === 'in_progress') return matchesSearch && e.progressPercentage < 100;
    if (filter === 'completed') return matchesSearch && e.progressPercentage === 100;
    return matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Learning Catalog
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Access all active, ongoing, and completed masterclasses and specializations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Segmented Filter */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Programs ({enrollments.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filter === 'in_progress'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enrolled courses..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((enr) => (
          <div
            key={enr.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm group"
          >
            <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800">
              <img
                src={enr.course.thumbnail}
                alt={enr.course.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {enr.progressPercentage === 100 && (
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Finished</span>
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block mb-1">
                  {enr.course.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {enr.course.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  Instructor: {enr.course.instructor.name}
                </p>
              </div>

              {/* Progress */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-600 dark:text-slate-400">
                  <span>{enr.completedLectureIds.length} / {getCourseLectureCount(enr.course)} lectures</span>
                  <span className="font-bold text-slate-900 dark:text-white">{enr.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      enr.progressPercentage === 100 ? 'bg-emerald-600' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${enr.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onStartLearning(enr.course)}
                  className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{enr.progressPercentage === 100 ? 'Rewatch Course' : 'Continue'}</span>
                </button>

                {enr.progressPercentage === 100 && (
                  <button
                    onClick={() => navigate('/student/certificates')}
                    className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                    title="View Certificate"
                  >
                    <Award className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No courses match this filter</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse the catalog to discover cutting-edge architecture and design programs.
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              Explore Catalog
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
