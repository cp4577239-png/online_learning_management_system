import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldCheck, GraduationCap, Briefcase, UserX, Compass, X } from 'lucide-react';

interface RoleSwitcherProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentPath, navigate }) => {
  const { role, switchRole, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleRoleSelect = (targetRole: UserRole | 'guest') => {
    switchRole(targetRole);
    if (targetRole === 'student') {
      if (!currentPath.startsWith('/student') && !currentPath.startsWith('/courses')) {
        navigate('/student/dashboard');
      }
    } else if (targetRole === 'instructor') {
      navigate('/instructor/dashboard');
    } else if (targetRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-xl hover:bg-slate-800 transition-all border border-slate-700 focus:outline-none"
        title="Open Role Switcher"
      >
        <Compass className="w-4 h-4 text-cyan-400" />
        <span>Role: <strong className="capitalize text-indigo-400">{role}</strong></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-900/95 backdrop-blur-md text-slate-100 rounded-xl shadow-2xl border border-slate-800 p-3 max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold tracking-wide text-slate-200">Role & Flow Switcher</span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          title="Minimize"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="text-[11px] text-slate-400 mb-2 leading-relaxed">
        Test all three roles and flows with preloaded credentials and real state:
      </div>

      <div className="grid grid-cols-4 gap-1.5 mb-2">
        <button
          onClick={() => handleRoleSelect('student')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-all ${
            role === 'student'
              ? 'bg-indigo-600 text-white shadow-sm font-semibold'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Student</span>
        </button>

        <button
          onClick={() => handleRoleSelect('instructor')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-all ${
            role === 'instructor'
              ? 'bg-indigo-600 text-white shadow-sm font-semibold'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Instructor</span>
        </button>

        <button
          onClick={() => handleRoleSelect('admin')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-all ${
            role === 'admin'
              ? 'bg-indigo-600 text-white shadow-sm font-semibold'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin</span>
        </button>

        <button
          onClick={() => handleRoleSelect('guest')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-all ${
            role === 'guest'
              ? 'bg-indigo-600 text-white shadow-sm font-semibold'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <UserX className="w-4 h-4" />
          <span>Visitor</span>
        </button>
      </div>

      {user && (
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="truncate">
            Logged in as <span className="text-white font-medium">{user.name}</span>
          </div>
          <span className="font-mono text-cyan-400 tabular-nums">
            {user.totalPoints} pts
          </span>
        </div>
      )}
    </div>
  );
};
