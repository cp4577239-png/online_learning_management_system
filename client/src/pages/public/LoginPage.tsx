import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Lock, Mail, ArrowRight, ShieldCheck, GraduationCap, Briefcase } from 'lucide-react';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  const handleQuickFill = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, selectedRole, password);

      if (selectedRole === 'instructor') navigate('/instructor/dashboard');
      else if (selectedRole === 'admin') navigate('/admin/dashboard');
      else navigate('/student/dashboard');
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-left transition-colors duration-200">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
              L
            </span>
            <span>Learnova</span>
          </button>
          <h2 className="text-2xl font-bold">
            Sign in to your learning account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in with the email and password registered on this platform.
          </p>
        </div>

        {/* Account role selector */}
        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Account Role
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('student')}
              className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'student'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-bold ring-1 ring-indigo-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('instructor')}
              className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'instructor'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-bold ring-1 ring-indigo-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Instructor</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'admin'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-bold ring-1 ring-indigo-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Sign in to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Create student account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
