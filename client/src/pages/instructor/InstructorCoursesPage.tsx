import React, { useEffect, useState } from 'react';
import { Course } from '../../types';
import { listCourses } from '../../services/courseService';
import { describeApiError } from '../../lib/api';
import { PlusCircle, Star, Users, Clock, Edit3, Eye, MoreVertical } from 'lucide-react';

interface InstructorCoursesPageProps {
  navigate: (path: string) => void;
}

export const InstructorCoursesPage: React.FC<InstructorCoursesPageProps> = ({ navigate }) => {
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    void listCourses({ mine: true })
      .then((courses) => { if (active) setMyCourses(courses); })
      .catch((cause: unknown) => {
        if (active) setError(describeApiError(cause));
      });
    return () => { active = false; };
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Curriculum Management
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Maintain, edit, and publish your course offerings, lectures, and resources.
          </p>
        </div>
        <button
          onClick={() => navigate('/instructor/courses/new')}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Masterclass</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Course Title & Category</th>
                <th className="p-4">Level</th>
                <th className="p-4 text-right">Enrolled</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {myCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        referrerPolicy="no-referrer"
                        className="w-16 aspect-video rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{c.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{c.category} · {c.durationHours}h</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{c.level}</td>
                  <td className="p-4 text-right font-mono tabular-nums text-slate-900 dark:text-white font-bold">
                    {c.enrolledCount.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono tabular-nums text-slate-900 dark:text-white font-bold">
                    ₹{c.price.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold text-[10px] border border-emerald-200 dark:border-emerald-800">
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate('/instructor/courses/new')}
                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        title="Edit course"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate('/courses')}
                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        title="View public page"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {error && (
                <tr><td colSpan={6} className="p-6 text-center text-rose-600">{error}</td></tr>
              )}
              {!error && myCourses.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-slate-500">No courses found. Create your first course to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
