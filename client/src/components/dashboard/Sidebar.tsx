import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  FileQuestion,
  Receipt,
  MessageSquare,
  Settings,
  PlusCircle,
  Users,
  DollarSign,
  ShieldCheck,
  Activity,
  FileText,
  ExternalLink,
  BookOpen,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, navigate }) => {
  const { role, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isCurrent = (path: string) => currentPath === path;

  const studentLinks = [
    { label: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Learning', path: '/student/my-learning', icon: GraduationCap },
    { label: 'Quizzes', path: '/student/quizzes', icon: FileQuestion },
    { label: 'Certificates', path: '/student/certificates', icon: Award },
    { label: 'Notes & Resources', path: '/student/notes', icon: FileText },
    { label: 'Orders & Receipts', path: '/student/orders', icon: Receipt },
    { label: 'Discussions', path: '/student/messages', icon: MessageSquare },
    { label: 'Account Settings', path: '/student/settings', icon: Settings },
  ];

  const instructorLinks = [
    { label: 'Performance', path: '/instructor/dashboard', icon: LayoutDashboard },
    { label: 'Manage Courses', path: '/instructor/courses', icon: BookOpen },
    { label: 'Course Builder', path: '/instructor/courses/new', icon: PlusCircle },
    { label: 'Enrolled Students', path: '/instructor/students', icon: Users },
    { label: 'Earnings & Payouts', path: '/instructor/earnings', icon: DollarSign },
    { label: 'Student Messages', path: '/instructor/messages', icon: MessageSquare },
    { label: 'Account Settings', path: '/instructor/settings', icon: Settings },
  ];

  const adminLinks = [
    { label: 'Admin Command', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Course Governance', path: '/admin/courses', icon: ShieldCheck },
    { label: 'Financial Analytics', path: '/admin/analytics', icon: Activity },
    { label: 'Audit Trail', path: '/admin/audit-logs', icon: FileText },
    { label: 'Account Settings', path: '/admin/settings', icon: Settings },
  ];

  const links = role === 'instructor' ? instructorLinks : role === 'admin' ? adminLinks : studentLinks;
  const roleTitle = role === 'instructor' ? 'Instructor Studio' : role === 'admin' ? 'Admin Console' : 'Student Portal';

  return (
    <aside className="w-64 bg-slate-900 dark:bg-slate-950 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 transition-colors duration-200">
      
      {/* Brand header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 text-left text-white font-bold tracking-tight text-lg focus:outline-none"
        >
          <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-sm shadow">
            L
          </span>
          <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent font-extrabold">
            Learnova
          </span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Toggle dark/light mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Scope info */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 dark:bg-slate-950/80">
        <div className="text-[11px] uppercase tracking-wider text-indigo-400 font-semibold mb-1">
          {roleTitle}
        </div>
        <div className="flex items-center gap-2.5 text-sm text-white font-medium truncate">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={user?.name || 'User'}
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full object-cover border border-slate-700"
          />
          <span className="truncate">{user?.name || 'User'}</span>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((item) => {
          const Icon = item.icon;
          const active = isCurrent(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                active
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom utility */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => navigate('/courses')}
          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
        >
          <span>Catalog Browser</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

    </aside>
  );
};
