import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { describeApiError } from '../../lib/api';
import { InstructorStudent, listInstructorStudents } from '../../services/courseService';

export const InstructorStudentsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<InstructorStudent[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    void listInstructorStudents()
      .then((records) => { if (active) setStudents(records); })
      .catch((cause: unknown) => {
        if (active) setError(describeApiError(cause));
      });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) =>
      student.name.toLowerCase().includes(query)
      || student.email.toLowerCase().includes(query)
      || student.courseTitle.toLowerCase().includes(query)
    );
  }, [search, students]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Enrolled Student Roster
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Monitor learner progress and enrollment across your courses.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student or course..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums whitespace-nowrap">
            Showing {filtered.length} of {students.length} enrollments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Student & Course</th>
                <th className="p-4">Enrolled Date</th>
                <th className="p-4">Progress</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{student.email}</div>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1">{student.courseTitle}</div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-mono tabular-nums">
                    {new Date(student.enrolledAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-mono tabular-nums text-slate-800 dark:text-slate-200">
                      <div className="w-20 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${student.progress === 100 ? 'bg-emerald-600' : 'bg-indigo-600'}`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span>{student.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">
                    {new Date(student.lastAccessedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      student.progress === 100
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {student.progress === 100 ? 'Completed' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
              {error && <tr><td colSpan={5} className="p-6 text-center text-rose-600">{error}</td></tr>}
              {!error && filtered.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-slate-500">No enrolled students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
