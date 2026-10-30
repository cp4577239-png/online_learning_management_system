import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEnrollment } from '../../context/EnrollmentContext';
import { Course } from '../../types';
import { listCourses } from '../../services/courseService';
import { getCourseLectureCount } from '../../data/courseLectureContent';
import {
  GraduationCap,
  Clock,
  Flame,
  Award,
  PlayCircle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Calendar,
  FileQuestion
} from 'lucide-react';

interface StudentDashboardPageProps {
  navigate: (path: string) => void;
  onStartLearning: (course: Course) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  navigate,
  onStartLearning,
}) => {
  const { user } = useAuth();
  const { enrollments, certificates, notes } = useEnrollment();
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

  const totalCompleted = enrollments.filter((e) => e.progressPercentage === 100).length;
  const inProgressCourses = enrollments.filter((e) => e.progressPercentage < 100);
  const activeCourse = inProgressCourses[0] || enrollments[0];
  const earnedMilestones = [
    { title: 'First Steps', description: 'Enrolled in your first course', earned: enrollments.length > 0 },
    { title: 'Course Finisher', description: 'Complete an enrolled course', earned: totalCompleted > 0 },
    { title: '7-Day Streak', description: 'Learn for seven days in a row', earned: (user?.learningStreakDays ?? 0) >= 7 },
  ];
  const knownBadgeNames = new Set(user?.badges ?? []);
  const recentActivities = [
    ...enrollments.map((enrollment) => ({
      id: `enrollment-${enrollment.id}`,
      text: enrollment.progressPercentage === 100
        ? `Completed ${enrollment.course.title}`
        : `Continued learning in ${enrollment.course.title}`,
      timestamp: enrollment.lastAccessedAt,
      icon: enrollment.progressPercentage === 100 ? 'complete' : 'course',
    })),
    ...notes.map((note) => ({
      id: `note-${note.id}`,
      text: `Added a note to ${note.lectureTitle}`,
      timestamp: note.createdAt,
      icon: 'note',
    })),
    ...certificates.map((certificate) => ({
      id: `certificate-${certificate.id}`,
      text: `Earned a certificate in ${certificate.courseTitle}`,
      timestamp: certificate.issueDate,
      icon: 'certificate',
    })),
  ]
    .sort((left, right) => {
      const leftTime = Date.parse(left.timestamp);
      const rightTime = Date.parse(right.timestamp);
      return (Number.isNaN(rightTime) ? 0 : rightTime) - (Number.isNaN(leftTime) ? 0 : leftTime);
    })
    .slice(0, 4)
    .map((activity) => {
      const date = new Date(activity.timestamp);
      return {
        ...activity,
        time: Number.isNaN(date.getTime())
          ? 'Recent'
          : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      };
    });

  const recommendations = useMemo(() => {
    const enrolledIds = new Set(enrollments.map((enrollment) => enrollment.courseId));
    return availableCourses.filter((course) => !enrolledIds.has(course.id)).slice(0, 2);
  }, [availableCourses, enrollments]);

  useEffect(() => {
    let active = true;
    void listCourses()
      .then((courses) => { if (active) setAvailableCourses(courses); })
      .catch((error: unknown) => console.error('Unable to load course recommendations:', error));
    return () => { active = false; };
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {user?.name || 'Engineer'}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            You have a <strong className="text-amber-600 dark:text-amber-400 font-mono tabular-nums">{user?.learningStreakDays ?? 0}-day streak</strong>. Keep progressing through your active specializations.
          </p>
        </div>
        <button
          onClick={() => navigate('/courses')}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          Explore More Programs
        </button>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Enrolled Courses</span>
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            {enrollments.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalCompleted} finished
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            {user?.learningStreakDays ?? 0} days
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
            {user?.learningStreakDays ? 'Keep your momentum going' : 'Start your first streak'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Points</span>
            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            {(user?.totalPoints ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Earn points by completing quizzes
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Certificates</span>
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            {certificates.length}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Verified credentials
          </div>
        </div>

      </div>

      {/* Continue Learning Spotlight Card */}
      {activeCourse && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
            <img
              src={activeCourse.course.thumbnail}
              alt={activeCourse.course.title}
              referrerPolicy="no-referrer"
              className="w-full sm:w-48 aspect-video rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
            />
            <div className="space-y-2 text-left w-full">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                Continue Where You Left Off
              </span>
              <h3 className="text-base font-bold leading-tight">
                {activeCourse.course.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                <span>Progress: {activeCourse.progressPercentage}%</span>
                <span aria-hidden="true">·</span>
                <span>Instructor: {activeCourse.course.instructor.name}</span>
              </div>
              <div className="w-full sm:w-64 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${activeCourse.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartLearning(activeCourse.course)}
            className="w-full md:w-auto px-5 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Resume Lecture</span>
          </button>
        </div>
      )}

      {/* Split Section: Enrolled Courses & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Active Courses (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Enrolled Masterclasses</h2>
            <button
              onClick={() => navigate('/student/my-learning')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View all enrolled</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enrollments.map((enr) => (
              <div
                key={enr.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
              >
                <div className="flex items-start gap-3.5 mb-4">
                  <img
                    src={enr.course.thumbnail}
                    alt={enr.course.title}
                    referrerPolicy="no-referrer"
                    className="w-20 aspect-video rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  />
                  <div className="truncate">
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 block">
                      {enr.course.category}
                    </span>
                    <h4 className="text-xs font-bold truncate">
                      {enr.course.title}
                    </h4>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5">
                      {enr.completedLectureIds.length} / {getCourseLectureCount(enr.course)} done
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    <span>Progress</span>
                    <span className="font-bold text-slate-900 dark:text-white">{enr.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        enr.progressPercentage === 100 ? 'bg-emerald-600' : 'bg-indigo-600 dark:bg-indigo-500'
                      }`}
                      style={{ width: `${enr.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  {enr.progressPercentage === 100 ? (
                    <button
                      onClick={() => navigate('/student/certificates')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View Credential</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onStartLearning(enr.course)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Continue Lecture</span>
                    </button>
                  )}

                  <button
                    onClick={() => navigate('/student/quizzes')}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <FileQuestion className="w-3.5 h-3.5" />
                    <span>Quiz</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Next Specializations */}
          <div className="pt-4">
            <h3 className="text-base font-bold mb-3">Recommended for Your Architecture Track</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => navigate(`/courses/${rec.slug}`)}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer flex items-center gap-4"
                >
                  <img
                    src={rec.thumbnail}
                    alt={rec.title}
                    referrerPolicy="no-referrer"
                    className="w-20 aspect-video rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  />
                  <div className="truncate">
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold block">{rec.category}</span>
                    <h4 className="text-xs font-bold truncate">{rec.title}</h4>
                    <span className="text-xs font-mono tabular-nums font-bold text-slate-700 dark:text-slate-300">
                      ₹{rec.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Deadlines, Gamification Badges, Activities (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Upcoming Deadlines & Live Sessions */}
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Upcoming Deadlines
              </h3>
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="space-y-3">
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                No due dates are scheduled. Here are suggested next steps for your courses:
              </p>
              {inProgressCourses.slice(0, 3).map((enrollment) => {
                const nextLecture = enrollment.course.sections
                  .flatMap((section) => section.lectures)
                  .find((lecture) => !enrollment.completedLectureIds.includes(lecture.id));
                return (
                  <button
                    key={enrollment.id}
                    onClick={() => onStartLearning(enrollment.course)}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                  >
                    <span className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-sm">
                      {nextLecture ? <BookOpen className="w-4 h-4" /> : <FileQuestion className="w-4 h-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] uppercase tracking-wide text-indigo-600 dark:text-indigo-400 font-bold">Suggested goal · no due date</span>
                      <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {nextLecture ? nextLecture.title : `Continue ${enrollment.course.title}`}
                      </span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0" />
                  </button>
                );
              })}
              {!inProgressCourses.length && enrollments.length > 0 && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 p-4">
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">All enrolled courses are complete!</p>
                  <button onClick={() => navigate('/student/certificates')} className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-2 hover:underline">
                    View your certificates
                  </button>
                </div>
              )}
              {!enrollments.length && (
                <button onClick={() => navigate('/courses')} className="w-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-left text-xs text-slate-600 dark:text-slate-300 hover:border-indigo-400 transition-colors">
                  Enroll in a course to create your first learning goal <span className="text-indigo-600 dark:text-indigo-400 font-bold">→</span>
                </button>
              )}
            </div>
          </div>

          {/* Gamification Badges */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Earned Badges
              </h3>
              <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="space-y-3">
              {user?.badges?.map((badge) => (
                <div key={badge} className="flex items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 px-3 py-2.5">
                  <span className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-amber-500 shadow-sm"><Award className="w-4 h-4" /></span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{badge}</span>
                  <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />
                </div>
              ))}
              {earnedMilestones.filter((badge) => badge.earned && !knownBadgeNames.has(badge.title)).map((badge) => (
                <div key={badge.title} className="flex items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 px-3 py-2.5">
                  <span className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-amber-500 shadow-sm"><Award className="w-4 h-4" /></span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">{badge.title}</span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400">{badge.description}</span>
                  </span>
                  <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
                </div>
              ))}
              {earnedMilestones.some((badge) => !badge.earned) && (
                <div className="pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Next milestones</p>
                  {earnedMilestones.filter((badge) => !badge.earned).slice(0, 2).map((badge) => (
                    <div key={badge.title} className="flex items-center gap-2 py-1.5 text-slate-500 dark:text-slate-400">
                      <span className="w-6 h-6 rounded-md border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center"><Award className="w-3 h-3" /></span>
                      <span className="text-[11px]">{badge.title} <span className="text-slate-400">· {badge.description}</span></span>
                    </div>
                  ))}
                </div>
              )}
              {!user?.badges?.length && !earnedMilestones.some((badge) => badge.earned) && (
                <p className="text-xs text-slate-500 dark:text-slate-400">Enroll in a course to earn your first learning milestone.</p>
              )}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Recent Activity
              </h3>
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activity.icon === 'certificate'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                      : activity.icon === 'note'
                      ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400'
                      : activity.icon === 'complete'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                      : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {activity.icon === 'certificate' ? <Award className="w-4 h-4" /> : activity.icon === 'note' ? <BookOpen className="w-4 h-4" /> : activity.icon === 'complete' ? <CheckCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{activity.text}</span>
                    <span className="block text-[10px] text-slate-400 mt-1">{activity.time}</span>
                  </span>
                </div>
              ))}
              {!recentActivities.length && (
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 text-center">
                  <Clock className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Your story starts here</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Course progress, notes, and certificates will appear as you learn.</p>
                  <button onClick={() => navigate('/courses')} className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-2 hover:underline">Browse courses</button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
