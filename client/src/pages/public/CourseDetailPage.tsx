import React, { useState } from 'react';
import { Course, Lecture } from '../../types';
import { useCart } from '../../context/CartContext';
import { useEnrollment } from '../../context/EnrollmentContext';
import { useAuth } from '../../context/AuthContext';
import {
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Bookmark,
  ShoppingCart,
  Share2,
  ShieldCheck,
  ArrowLeft,
  FileText
} from 'lucide-react';

interface CourseDetailPageProps {
  course: Course;
  navigate: (path: string) => void;
  onStartLearning: (course: Course) => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  course,
  navigate,
  onStartLearning,
}) => {
  const { addToCart, isInCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const { isEnrolled, enrollInCourse } = useEnrollment();
  const { user } = useAuth();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [course.sections[0]?.id || '']: true,
  });
  const [previewLecture, setPreviewLecture] = useState<Lecture | null>(null);

  const enrolled = isEnrolled(course.id);
  const inCart = isInCart(course.id);
  const inWishlist = isInWishlist(course.id);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleEnrollNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'student') {
      alert('Please sign in with a student account to enroll in courses.');
      return;
    }

    if (course.price > 0) {
      addToCart(course);
      navigate('/student/cart');
      return;
    }

    try {
      await enrollInCourse(course);
      onStartLearning(course);
    } catch (error) {
      console.error('Unable to enroll in course:', error);
      alert(error instanceof Error ? error.message : 'Unable to enroll in this course.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-left transition-colors duration-200">
      
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate('/courses')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Courses Catalog</span>
        </button>
      </div>

      {/* Hero Header */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mt-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Quiet unboxed kicker */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{course.category}</span>
                <span aria-hidden="true">·</span>
                <span>{course.level} Level</span>
                <span aria-hidden="true">·</span>
                <span>Updated {course.lastUpdated}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {course.subtitle}
              </p>

              {/* Stats & Instructor */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
                <div className="flex items-center gap-1 text-amber-500 font-bold font-mono tabular-nums">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{course.rating.toFixed(2)}</span>
                  <span className="text-slate-400 font-normal">({course.reviewCount.toLocaleString()} reviews)</span>
                </div>

                <span className="text-slate-300 dark:text-slate-700">·</span>

                <div className="text-slate-600 dark:text-slate-300 font-mono tabular-nums">
                  <span className="font-bold text-slate-900 dark:text-white">{course.enrolledCount.toLocaleString()}</span> students enrolled
                </div>

                <span className="text-slate-300 dark:text-slate-700">·</span>

                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono tabular-nums">{course.durationHours} hours total</span>
                </div>
              </div>

              {/* Instructor snippet */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Created by</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{course.instructor.name}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">{course.instructor.title}</div>
                </div>
              </div>

            </div>

            {/* Right Card / Sticky Card */}
            <div className="lg:col-span-4 w-full">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden sticky top-24">
                
                {/* Thumbnail Preview with Play Overlay */}
                <div 
                  onClick={() => {
                    const firstLecture = course.sections[0]?.lectures[0];
                    if (firstLecture) setPreviewLecture(firstLecture);
                  }}
                  className="relative aspect-video w-full bg-slate-900 cursor-pointer group"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40">
                    <PlayCircle className="w-12 h-12 text-white group-hover:scale-110 transition-transform mb-1" />
                    <span className="text-xs font-semibold drop-shadow">Preview Sample Lesson</span>
                  </div>
                </div>

                {/* Card pricing and CTA */}
                <div className="p-6 space-y-4">
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      ₹{course.price.toLocaleString('en-IN')}
                    </span>
                    {course.originalPrice > course.price && (
                      <>
                        <span className="text-sm text-slate-400 dark:text-slate-500 line-through font-mono tabular-nums">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off
                        </span>
                      </>
                    )}
                  </div>

                  {enrolled ? (
                    <button
                      onClick={() => onStartLearning(course)}
                      className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Continue Learning</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handleEnrollNow}
                        className="w-full py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
                      >
                        Enroll Now & Access Course
                      </button>

                      <button
                        onClick={() => {
                          if (!user) {
                            navigate('/login');
                            return;
                          }
                          if (user.role !== 'student') {
                            alert('Please sign in with a student account to purchase courses.');
                            return;
                          }
                          if (!inCart) addToCart(course);
                        }}
                        className={`w-full py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                          inCart
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{inCart ? 'In Shopping Cart' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  )}

                  {/* Actions & Guarantee */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          if (inWishlist) removeFromWishlist(course.id);
                          else addToWishlist(course);
                        }}
                        className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${inWishlist ? 'text-indigo-600 fill-indigo-600' : ''}`} />
                        <span>{inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href);
                          alert('Course link copied to clipboard!');
                        }}
                        className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>
                    </div>

                    <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>Full lifetime access to {course.durationHours} hours on demand</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>Direct access to course-aware AI Academic Tutor</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>Verifiable Certificate of Specialization on completion</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Body: Outcomes, Curriculum, Instructor Bio */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-12">
            
            {/* Learning Outcomes */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                What You Will Master
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum Explorer */}
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Course Curriculum
                </h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                  {course.sections.length} sections · {course.lecturesCount} lectures · {course.durationHours}h total
                </div>
              </div>

              <div className="space-y-3">
                {course.sections.map((section) => {
                  const isExpanded = !!expandedSections[section.id];
                  return (
                    <div
                      key={section.id}
                      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
                    >
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {section.title}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                          {section.lectures.length} lectures
                        </span>
                      </button>

                      {/* Lectures List */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                          {section.lectures.map((lecture) => (
                            <div
                              key={lecture.id}
                              className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <PlayCircle className="w-4 h-4 text-slate-400 shrink-0" />
                                <span className="font-medium text-slate-900 dark:text-slate-100">{lecture.title}</span>
                              </div>

                              <div className="flex items-center gap-3 font-mono tabular-nums">
                                {lecture.isFreePreview && (
                                  <button
                                    onClick={() => setPreviewLecture(lecture)}
                                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                  >
                                    Preview
                                  </button>
                                )}
                                <span className="text-slate-400">{lecture.durationMinutes}m</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Prerequisites & Requirements
              </h2>
              <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1.5 leading-relaxed">
                {course.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Instructor Biography */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Meet Your Lead Instructor
              </h2>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{course.instructor.name}</h3>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{course.instructor.title}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {course.instructor.bio}
                  </p>
                  <div className="flex items-center gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                    <div>
                      <strong className="text-slate-900 dark:text-white">{course.instructor.rating.toFixed(2)}</strong> Instructor Rating
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white">{course.instructor.studentsCount.toLocaleString()}</strong> Students
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Free Preview Modal */}
      {previewLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 text-white rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95">
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <div className="truncate">
                <span className="text-[11px] uppercase tracking-wider text-indigo-400 font-semibold block">Sample Lesson Preview</span>
                <h4 className="text-sm font-bold text-white truncate">{previewLecture.title}</h4>
              </div>
              <button
                onClick={() => setPreviewLecture(null)}
                className="text-slate-400 hover:text-white px-2 py-1 text-sm rounded"
              >
                ✕ Close
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <video
                src={previewLecture.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 bg-slate-900/90 flex items-center justify-between text-xs">
              <span className="text-slate-400">Duration: {previewLecture.durationMinutes} minutes</span>
              <button
                onClick={() => {
                  setPreviewLecture(null);
                  handleEnrollNow();
                }}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Enroll to Unlock All Lessons
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
