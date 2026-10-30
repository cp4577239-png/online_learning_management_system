import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';
import { describeApiError } from '../../lib/api';
import { getInstructorDashboard, InstructorDashboardData } from '../../services/courseService';

export const InstructorEarningsPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<InstructorDashboardData>({
    stats: { courses: 0, students: 0, grossRevenue: 0 },
    courses: [],
    transactions: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    void getInstructorDashboard()
      .then((result) => { if (active) setDashboard(result); })
      .catch((cause: unknown) => {
        if (active) setError(describeApiError(cause));
      });
    return () => { active = false; };
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Earnings & Revenue
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Revenue is calculated from completed MongoDB orders for your courses.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>Payments are currently simulated. Real payment capture and instructor payouts are not configured.</span>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Gross Completed Orders</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-2">
            ₹{dashboard.stats.grossRevenue.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Course Enrollments</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-2">
            {dashboard.stats.students.toLocaleString()}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Courses</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-2">
            {dashboard.stats.courses}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Completed Order History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Order & Course</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Course Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
              {dashboard.transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="p-4">
                    <div className="font-sans font-medium text-slate-900 dark:text-white">{transaction.description}</div>
                    <div className="text-[11px] text-slate-500">{transaction.orderNumber}</div>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> COMPLETED
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="inline-flex items-center gap-1"><DollarSign className="w-3 h-3" />{transaction.amount.toLocaleString('en-IN')}</span>
                  </td>
                </tr>
              ))}
              {!error && dashboard.transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No completed orders for your courses yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
