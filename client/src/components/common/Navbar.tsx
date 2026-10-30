import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ShoppingCart,
  Bookmark,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  Compass,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, role, logout } = useAuth();
  const { cart, wishlist } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCurrent = (path: string) => currentPath === path;

  const handleMobileNav = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              L
            </span>
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 dark:from-white dark:via-slate-100 dark:to-indigo-200 bg-clip-text text-transparent font-extrabold">
              Learnova
            </span>
          </button>
        </div>

        {/* Zone 2: Primary Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => navigate('/courses')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              isCurrent('/courses') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => navigate('/instructors')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              isCurrent('/instructors') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Instructors
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              isCurrent('/pricing') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => navigate('/about')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              isCurrent('/about') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            About
          </button>
          <button
            onClick={() => navigate('/certificate/verify')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              currentPath.startsWith('/certificate/verify') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Verify Credential
          </button>
        </nav>

        {/* Zone 3: Actions & Utility Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Quick Search Shortcut */}
          <button
            onClick={() => navigate('/courses')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200/60 dark:border-slate-700/60"
            title="Search courses"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Search courses...</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {role === 'student' && (
                <>
                  <button
                    onClick={() => navigate('/student/wishlist')}
                    className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Wishlist"
                  >
                    <Bookmark className="w-4 h-4" />
                    {wishlist.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => navigate('/student/cart')}
                    className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Shopping Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {cart.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* Enter Workspace CTA */}
              <button
                onClick={() => {
                  if (role === 'instructor') navigate('/instructor/dashboard');
                  else if (role === 'admin') navigate('/admin/dashboard');
                  else navigate('/student/dashboard');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                {role === 'instructor' ? 'Instructor Studio' : role === 'admin' ? 'Admin Console' : 'My Learning'}
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="hidden sm:inline-block text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors px-1"
                title="Sign out"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                Explore Courses
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <button
              onClick={() => handleMobileNav('/courses')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Courses Catalog
            </button>
            <button
              onClick={() => handleMobileNav('/instructors')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Verified Instructors
            </button>
            <button
              onClick={() => handleMobileNav('/pricing')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Plans & Pricing
            </button>
            <button
              onClick={() => handleMobileNav('/about')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Pedagogy & About
            </button>
            <button
              onClick={() => handleMobileNav('/certificate/verify')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Verify Credential
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (role === 'instructor') handleMobileNav('/instructor/dashboard');
                    else if (role === 'admin') handleMobileNav('/admin/dashboard');
                    else handleMobileNav('/student/dashboard');
                  }}
                  className="w-full py-2.5 text-xs font-bold text-center text-white bg-indigo-600 rounded-lg"
                >
                  Go to {role === 'instructor' ? 'Instructor Studio' : role === 'admin' ? 'Admin Console' : 'My Learning'}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 text-center"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleMobileNav('/login')}
                  className="w-full py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleMobileNav('/register')}
                  className="w-full py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg text-center"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
