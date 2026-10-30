import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, FileText } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const auditLogs = [
    {
      id: 'log_901',
      timestamp: '2026-10-28 01:04:12 UTC',
      operator: 'marcus.vance@learnova.com',
      action: 'COURSE_APPROVED',
      resource: 'Course ID: c_sys_01',
      severity: 'normal',
      ip: '192.0.2.45',
    },
    {
      id: 'log_902',
      timestamp: '2026-10-27 18:22:05 UTC',
      operator: 'SYSTEM_AUTOMATION',
      action: 'CERTIFICATE_GENERATED',
      resource: 'Cert Code: LNV-2026-UIUX-9821A',
      severity: 'normal',
      ip: '10.0.4.12',
    },
    {
      id: 'log_903',
      timestamp: '2026-10-27 14:10:44 UTC',
      operator: 'marcus.vance@learnova.com',
      action: 'PAYOUT_REMITTED',
      resource: 'Transfer: ₹5,80,000 to Inst ID inst_01',
      severity: 'important',
      ip: '192.0.2.45',
    },
    {
      id: 'log_904',
      timestamp: '2026-10-26 09:12:30 UTC',
      operator: 'SECURITY_GATEWAY',
      action: 'TOKEN_REFRESH_ROTATION',
      resource: 'Subject: user_std_01',
      severity: 'normal',
      ip: '203.0.113.8',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          System Security & Audit Trail
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Immutable event telemetry for financial operations, certificate issuances, and administrator actions.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-sans font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Timestamp (UTC)</th>
                <th className="p-4">Operator</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Resource Target</th>
                <th className="p-4">Client IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 tabular-nums">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 text-slate-500 dark:text-slate-400">{log.timestamp}</td>
                  <td className="p-4 text-slate-900 dark:text-white font-semibold font-sans">{log.operator}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.severity === 'important'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{log.resource}</td>
                  <td className="p-4 text-slate-400 dark:text-slate-500">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
