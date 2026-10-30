import React from 'react';
import { Course } from '../../types';
import { Star, Clock, BookOpen, Bookmark, ShoppingCart, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  const { isInCart, addToCart, isInWishlist, addToWishlist, removeFromWishlist } = useCart();
  const inCart = isInCart(course.id);
  const inWishlist = isInWishlist(course.id);

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/80 hover:shadow-lg dark:hover:shadow-indigo-950/30 transition-all duration-200 overflow-hidden text-left">
      {/* Thumbnail with measured overlay & zero-broken-image fallback */}
      <div 
        onClick={() => onSelect(course)}
        className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
      >
        <img
          src={course.thumbnail}
          alt={course.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Subtle quick bookmark button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (inWishlist) removeFromWishlist(course.id);
            else addToWishlist(course);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-colors ${
            inWishlist
              ? 'bg-indigo-600 text-white'
              : 'bg-black/50 text-white/90 hover:bg-black/70'
          }`}
          title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>

        {course.isBestseller && (
          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow">
            Bestseller
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-5">
        
        {/* Quiet unboxed text kicker with typographic separator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{course.category}</span>
          <span aria-hidden="true">·</span>
          <span>{course.level}</span>
        </div>

        {/* Primary Title */}
        <h3 
          onClick={() => onSelect(course)}
          className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-1.5 cursor-pointer leading-snug"
        >
          {course.title}
        </h3>

        {/* Subtitle excerpt */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {course.subtitle}
        </p>

        {/* Instructor line */}
        <div className="flex items-center gap-2 mb-3 mt-auto">
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            referrerPolicy="no-referrer"
            className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">
            {course.instructor.name}
          </span>
        </div>

        {/* Course stats: duration & lectures count */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 font-mono tabular-nums">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-slate-900 dark:text-slate-100">{course.rating.toFixed(2)}</span>
            <span className="text-slate-400">({course.reviewCount.toLocaleString()})</span>
          </div>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.durationHours}h</span>
          </div>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.lecturesCount} lectures</span>
          </div>
        </div>

        {/* Price & Primary CTA */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              ₹{course.price.toLocaleString('en-IN')}
            </span>
            {course.originalPrice > course.price && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-mono tabular-nums">
                ₹{course.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (!inCart) addToCart(course);
              }}
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                inCart
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={inCart ? 'Already in cart' : 'Add to cart'}
            >
              {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onSelect(course)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              View Syllabus
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
