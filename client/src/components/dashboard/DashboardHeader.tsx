import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Flame, Award, Sun, Moon } from 'lucide-react';

interface DashboardHeaderProps {
  breadcrumbs: string[];
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  breadcrumbs,
  primaryAction,
  secondaryAction,
}) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors duration-200">
      
      {/* Breadcrumb Trail */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-slate-300 dark:text-slate-600">/</span>}
            <span className={idx === breadcrumbs.length - 1 ? 'text-slate-900 dark:text-white font-semibold truncate' : 'truncate'}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        
        {/* Streak indicator if student */}
        {user?.learningStreakDays !== undefined && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-mono tabular-nums font-semibold border border-amber-200/60 dark:border-amber-800/60" title="Daily Learning Streak">
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{user.learningStreakDays}d streak</span>
          </div>
        )}

        {/* Learning Points */}
        {user?.totalPoints !== undefined && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-xs font-mono tabular-nums font-semibold border border-indigo-200/60 dark:border-indigo-800/60" title="Accumulated Points">
            <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{user.totalPoints.toLocaleString()} pts</span>
          </div>
        )}

        {/* Theme button */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Optional Secondary Action */}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {secondaryAction.label}
          </button>
        )}

        {/* Primary Action */}
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            {primaryAction.label}
          </button>
        )}

        {/* User avatar indicator */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={user?.name || 'User'}
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

    </header>
  );
};
