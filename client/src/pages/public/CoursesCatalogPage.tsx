import React, { useState, useMemo, useEffect } from 'react';
import { Course, CourseCategory, CourseLevel } from '../../types';
import { describeApiError } from '../../lib/api';
import { listCourses } from '../../services/courseService';
import { CourseCard } from '../../components/course/CourseCard';
import { Search, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight, Loader2, BookOpen } from 'lucide-react';

interface CoursesCatalogPageProps {
  onSelectCourse: (course: Course) => void;
}

const CATEGORIES: (CourseCategory | 'All')[] = [
  'All',
  'System Architecture',
  'Data & AI',
  'UI/UX Design',
  'Cloud & DevOps',
  'Cybersecurity',
  'Software Engineering',
];

const LEVELS: (CourseLevel | 'All')[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const CoursesCatalogPage: React.FC<CoursesCatalogPageProps> = ({ onSelectCourse }) => {
  const [searchQuery, setSearchQuery] = useState(() => {
    const query = window.location.hash.split('?')[1] || '';
    return new URLSearchParams(query).get('search') || '';
  });
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'All'>('All');
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | 'All'>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'popular' | 'price-asc' | 'price-desc'>('featured');
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const itemsPerPage = 8;

  const handleRefreshCourses = () => {
    setIsLoading(true);
    setRefreshKey((key) => key + 1);
  };

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setCoursesError(null);

    listCourses({
      category: selectedCategory,
      level: selectedLevel,
      search: searchQuery,
    })
      .then((results) => {
        if (active) setCourses(results);
      })
      .catch((error: unknown) => {
        if (active) {
          setCourses([]);
          setCoursesError(describeApiError(error));
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCategory, selectedLevel, searchQuery, refreshKey]);

  const filteredCourses = useMemo(() => {
    return [...courses].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.enrolledCount - a.enrolledCount;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [courses, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / itemsPerPage));
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Masterclass Curriculum Catalog
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Production-focused computer science, distributed architectures, machine learning, and systems design.
            </p>
          </div>

          <button
            onClick={handleRefreshCourses}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start sm:self-auto flex items-center gap-1.5"
            title="Preview skeleton loading animation"
          >
            <Loader2 className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Test Loading State</span>
          </button>
        </div>

        {/* Search & Sort Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4 justify-between shadow-sm">
          
          {/* Search Field */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by topic, instructor, or architecture..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
            <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Enrolled</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level Filter Buttons */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs shrink-0">
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevel(lvl);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter in Tabular Figures */}
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
          Showing <span className="font-bold text-slate-900 dark:text-white">{filteredCourses.length}</span> programs matching selected criteria
        </div>

        {/* Skeleton Loading State or Course Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="aspect-video bg-slate-200 dark:bg-slate-800" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : coursesError ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto my-12">
            <p className="text-xs text-rose-600 dark:text-rose-400">{coursesError}</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onSelect={onSelectCourse}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-colors ${
                      currentPage === idx + 1
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : courses.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto my-12">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No published courses yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The catalog loaded successfully, but there are no published courses in the database. Ask an instructor to publish a course or load the starter catalog from the server.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto my-12">
            <SlidersHorizontal className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No courses match your filter</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Try adjusting your search terms or resetting the category and level filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
