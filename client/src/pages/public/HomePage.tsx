import React, { useEffect, useState } from 'react';
import { Course } from '../../types';
import {
  SAMPLE_REVIEWS,
  POPULAR_LEARNING_PATHS,
  COURSE_CATEGORIES_METRICS,
  FAQ_ITEMS
} from '../../data/mockData';
import { describeApiError } from '../../lib/api';
import { listCourses } from '../../services/courseService';
import { CourseCard } from '../../components/course/CourseCard';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Award,
  Video,
  FileCode2,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Cpu,
  Cloud,
  Layout,
  Code,
  Shield,
  Clock,
  Compass
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
  onSelectCourse: (course: Course) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onSelectCourse }) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('All');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsCoursesLoading(true);
    setCoursesError(null);

    listCourses({ category: selectedCatFilter })
      .then((courses) => {
        if (active) setFeaturedCourses(courses.slice(0, 4));
      })
      .catch((error: unknown) => {
        if (active) {
          setFeaturedCourses([]);
          setCoursesError(describeApiError(error));
        }
      })
      .finally(() => {
        if (active) setIsCoursesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCatFilter]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const search = heroSearch.trim();
    navigate(search ? `/courses?search=${encodeURIComponent(search)}` : '/courses');
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />;
      case 'Cloud': return <Cloud className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      case 'Layout': return <Layout className="w-5 h-5 text-pink-600 dark:text-pink-400" />;
      case 'Shield': return <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      default: return <Code className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-16 lg:pt-14 lg:pb-24">
        
        {/* Subtle background ambient blur */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span>Next-Generation Technical Education</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-balance">
                Master Scalable Engineering, Systems & Modern Design.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Learnova provides rigorous, project-driven computer science and architecture masterclasses taught by lead architects at top engineering organizations.
              </p>

              {/* Interactive Search Bar in Hero */}
              <form onSubmit={handleHeroSearch} className="max-w-xl flex items-center gap-2 pt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search by topic (e.g. Kafka, Raft, PyTorch, Figma Variables)..."
                    className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Quick Topic Keywords */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium">Trending:</span>
                {['System Design', 'PyTorch LLMs', 'Kubernetes GitOps', 'Design Systems', 'Zero-Trust'].map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => navigate('/courses')}
                    className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {kw}
                  </button>
                ))}
              </div>

              {/* Reassurances */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Accredited Credentials</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Real-Time AI Tutor</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Production Codebases</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-100 dark:bg-slate-800 aspect-16/10 group">
                <img
                  src="/src/assets/images/hero_learnova_platform_1793174972216.jpg"
                  alt="Learnova collaborative learning studio"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white text-left space-y-1">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-300">
                      Live Studio Cohort
                    </span>
                    <h4 className="text-sm font-bold">Distributed Architectures & Deep Systems</h4>
                    <p className="text-xs text-slate-300">
                      Guided by veteran architects from Meta, Datadog & Google.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Proof Strip */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                45,000+
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Engineers & Designers Enrolled
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                99.4%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Verified Curriculum Rating
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                180+
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enterprise Sponsoring Companies
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                100%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Cryptographic Verifiable Proof
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Category Showcase Cards */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              Disciplines & Domains
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Explore Specialized Domains
            </h2>
          </div>
          <button
            onClick={() => navigate('/courses')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <span>All categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {COURSE_CATEGORIES_METRICS.map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate('/courses')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                {getCategoryIcon(cat.icon)}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{cat.name}</h3>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 tabular-nums">
                  {cat.count} programs · {cat.students}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Masterclasses */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              Curated Curriculum
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Featured Specializations
            </h2>
          </div>

          {/* Quick Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {['All', 'System Architecture', 'Data & AI', 'UI/UX Design', 'Cloud & DevOps'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCatFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCatFilter === cat
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSelect={onSelectCourse}
            />
          ))}
          {!isCoursesLoading && coursesError && (
            <p className="col-span-full text-xs text-rose-600 dark:text-rose-400">{coursesError}</p>
          )}
          {!isCoursesLoading && !coursesError && featuredCourses.length === 0 && (
            <p className="col-span-full text-xs text-slate-500 dark:text-slate-400">No courses are available yet.</p>
          )}
        </div>
      </section>

      {/* Popular Learning Paths / Roadmaps Section */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              Structured Trajectories
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Popular Career Learning Paths
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              Step-by-step multi-course sequences designed to take you from practitioner to staff architect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {POPULAR_LEARNING_PATHS.map((path) => (
              <div
                key={path.id}
                className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mb-3">
                    <span>{path.coursesCount} specializations</span>
                    <span>{path.totalHours} hours total</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {path.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {path.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {path.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {path.studentsCount.toLocaleString()} enrolled
                  </span>
                  <button
                    onClick={() => navigate('/courses')}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Pedagogical Pillars */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left w-full">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            Engineered for Deep Mastery
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            The Learnova Learning Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              01. Precision Video Classroom
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Adaptive speed controls, instant timestamped notes synchronized with playback seconds, and downloadable architectural blueprints.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              02. Real-Time AI Tutor
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Course-aware assistant ready to summarize lectures, break down mathematical formulas, or generate custom mock quiz challenges on demand.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-400 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              03. Verifiable Credentials
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Publicly verifiable certificate codes and cryptographic hashes that employers can independently inspect through our validation registry.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              Proven Outcomes
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Trusted by Senior Architects & Leads
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-6 italic">
                  "{review.comment}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{review.userName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{review.userRole}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Clear Answers
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Everything you need to know about accreditation, corporate stipends, and pedagogy.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white pr-4">
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Accelerate Your Engineering Career Today
          </h2>
          <p className="text-sm text-indigo-200 max-w-xl mx-auto leading-relaxed">
            Join thousands of developers, team leads, and product designers leveling up with our production-grade curriculum.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-3 text-xs font-bold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors shadow-lg"
            >
              Get Started with Learnova
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="px-6 py-3 text-xs font-bold text-white bg-indigo-700/80 hover:bg-indigo-700 rounded-lg transition-colors border border-indigo-500/30"
            >
              View Membership Plans
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
