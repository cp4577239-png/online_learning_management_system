import React, { useState } from 'react';
import { ShieldCheck, Users, DollarSign, BookOpen, AlertCircle, Check, X, Server, Activity, MessageSquare } from 'lucide-react';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const [pendingSubmissions, setPendingSubmissions] = useState([
    {
      id: 'sub_01',
      title: 'High-Concurrency Golang Microservices & gRPC',
      instructor: 'Dr. Aris Thorne',
      submittedDate: '2 hours ago',
      category: 'System Architecture',
      price: 3499,
      status: 'pending',
    },
    {
      id: 'sub_02',
      title: 'Quantum Computing Algorithms & Qiskit Fundamentals',
      instructor: 'Elena Rostova',
      submittedDate: 'Yesterday',
      category: 'Data & AI',
      price: 4199,
      status: 'pending',
    },
  ]);

  const [revisionModalItem, setRevisionModalItem] = useState<{ id: string; title: string } | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');

  const handleApprove = (id: string) => {
    setPendingSubmissions((prev) => prev.filter((p) => p.id !== id));
    alert('Curriculum approved and published to the live public catalog!');
  };

  const handleConfirmRevision = () => {
    if (!revisionModalItem) return;
    setPendingSubmissions((prev) => prev.filter((p) => p.id !== revisionModalItem.id));
    alert(`Revision request with audit feedback sent to instructor for "${revisionModalItem.title}".`);
    setRevisionModalItem(null);
    setRevisionNotes('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Learnova Platform Governance & Command
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Governance console for academic audits, course approvals, user roles, and financial telemetry.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Learners</span>
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            45,820
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            +310 new today
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Verified Instructors</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            142
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            12 accreditation pending
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Platform GMV</span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            ₹3,42,80,000
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            +22.4% MoM growth
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Moderation Queue</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            {pendingSubmissions.length}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            Requires staff review
          </div>
        </div>
      </div>

      {/* Infrastructure Telemetry Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Edge Video Cluster</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">99.98% Healthy</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">14ms p99</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">AI Tutor LLM Engine</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">Operational</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">1.2s avg latency</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Credential Registry</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">Consensus Invariant</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Zero Drifts</span>
        </div>
      </div>

      {/* Moderation Queue Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">
              Curriculum Moderation Queue
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluate course submissions against syllabus depth and WCAG accessibility standards.
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {pendingSubmissions.length} pending
          </span>
        </div>

        {pendingSubmissions.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {pendingSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-xs"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block">
                    {sub.category}
                  </span>
                  <h3 className="text-sm font-bold">{sub.title}</h3>
                  <div className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                    Submitted by <strong className="text-slate-800 dark:text-slate-200">{sub.instructor}</strong> · {sub.submittedDate} · ₹{sub.price} target price
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setRevisionModalItem({ id: sub.id, title: sub.title });
                      setRevisionNotes('Please provide real benchmark results for Lecture 3 and confirm 1080p video bitrate meets specification.');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Request Revision</span>
                  </button>
                  <button
                    onClick={() => handleApprove(sub.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Publish</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            All course submissions have been audited and resolved.
          </div>
        )}
      </div>

      {/* Revision Modal */}
      {revisionModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Request Curriculum Revision: {revisionModalItem.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide actionable guidance for the instructor regarding syllabus depth or video clarity:
            </p>
            <textarea
              rows={4}
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRevisionModalItem(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevision}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded hover:bg-rose-700"
              >
                Dispatch Audit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
