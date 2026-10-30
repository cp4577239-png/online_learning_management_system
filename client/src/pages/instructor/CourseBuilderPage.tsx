import React, { useState } from 'react';
import { Course, CourseCategory, CourseLevel } from '../../types';
import { createCourse } from '../../services/courseService';
import { Plus, Trash2, Video, DollarSign, Check, ArrowLeft, Layers, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CourseBuilderPageProps {
  navigate: (path: string) => void;
}

interface DraftLecture {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl: string;
  isFreePreview: boolean;
}

interface DraftSection {
  id: string;
  title: string;
  lectures: DraftLecture[];
}

export const CourseBuilderPage: React.FC<CourseBuilderPageProps> = ({ navigate }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<CourseCategory>('System Architecture');
  const [level, setLevel] = useState<CourseLevel>('Advanced');
  const [price, setPrice] = useState('3499');
  const [originalPrice, setOriginalPrice] = useState('6999');

  const [sections, setSections] = useState<DraftSection[]>([
    {
      id: 'sec_1',
      title: 'Module 1: Architecture Foundations & Core Invariants',
      lectures: [
        {
          id: 'lec_1',
          title: '01. System Boundaries & Network Latency Models',
          durationMinutes: 18,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          isFreePreview: true,
        },
      ],
    },
  ]);


  const handleAddSection = () => {
    const newSec: DraftSection = {
      id: `sec_${Date.now()}`,
      title: `Module ${sections.length + 1}: Advanced Implementation`,
      lectures: [],
    };
    setSections([...sections, newSec]);
  };

  const handleAddLecture = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const newLec: DraftLecture = {
          id: `lec_${Date.now()}`,
          title: `0${s.lectures.length + 1}. Dynamic Partitioning & Invariants`,
          durationMinutes: 20,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          isFreePreview: false,
        };
        return { ...s, lectures: [...s.lectures, newLec] };
      })
    );
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const handleDeleteLecture = (sectionId: string, lectureId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        return { ...s, lectures: s.lectures.filter((l) => l.id !== lectureId) };
      })
    );
  };

  const handlePublishCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a course title');
      return;
    }

    const courseId = `c_${Date.now()}`;
    const newCourse: Course = {
      id: courseId,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subtitle: subtitle || 'Advanced Specialized Curriculum',
      description: subtitle || 'Comprehensive engineering curriculum with deep architecture patterns.',
      category,
      level,
      instructorId: 'inst_01',
      instructor: {
        id: 'inst_01',
        name: 'Dr. Sarah Chen',
        title: 'Lead Systems Architect & Distributed Systems Chair',
        avatar: '/src/assets/images/instructor_sarah_chen_1793174975407.jpg',
        rating: 4.95,
        studentsCount: 38420,
        bio: 'Former principal infrastructure architect with 15+ years engineering high-scale distributed systems.',
      },
      thumbnail: '/src/assets/images/course_system_design_1793174973214.jpg',
      price: parseInt(price) || 2999,
      originalPrice: parseInt(originalPrice) || 5999,
      rating: 5.0,
      reviewCount: 1,
      enrolledCount: 1,
      durationHours: 12,
      lecturesCount: sections.reduce((sum, s) => sum + s.lectures.length, 0),
      lastUpdated: 'October 2026',
      status: 'under_review',
      learningOutcomes: [
        'Design fault-tolerant distributed services',
        'Implement resilient consensus and transaction boundaries',
      ],
      requirements: ['Basic data structures and concurrent programming knowledge'],
      sections: sections.map((s, sIdx) => ({
        id: s.id,
        courseId,
        title: s.title,
        order: sIdx + 1,
        lectures: s.lectures.map((l, lIdx) => ({
          id: l.id,
          sectionId: s.id,
          title: l.title,
          durationMinutes: l.durationMinutes,
          videoUrl: l.videoUrl,
          isFreePreview: l.isFreePreview,
          order: lIdx + 1,
        })),
      })),
    };

    try {
      await createCourse(newCourse);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => navigate('/instructor/courses'), 1500);
    } catch (error) {
      console.error('Unable to submit course for review:', error);
      alert(error instanceof Error ? error.message : 'Unable to save course.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 text-left">
      
      {/* Back and Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/instructor/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Instructor Studio</span>
        </button>

        <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
          Status: <strong className="text-amber-600 dark:text-amber-400">Draft In Progress</strong>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Curriculum & Course Studio Builder
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Define syllabus structure, upload video lecture materials, specify learning outcomes, and set pricing.
        </p>
      </div>

      <form onSubmit={handlePublishCourse} className="space-y-8">
        
        {/* Basic Course Metadata Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            01. Masterclass Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Course Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. High-Throughput Distributed Kafka Streaming & Microservices"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Short Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Explain the technical outcomes and target architecture..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="System Architecture">System Architecture</option>
                  <option value="Data & AI">Data & AI</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Software Engineering">Software Engineering</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Target Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Price (₹ INR)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Original Price (₹)</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Curriculum Sections Builder */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                02. Sections & Lecture Structure
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Organize modules chronologically and attach video lecture assets.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddSection}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Module</span>
            </button>
          </div>

          <div className="space-y-4">
            {sections.map((section, sIdx) => (
              <div
                key={section.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/60 dark:bg-slate-800/40 space-y-4"
              >
                {/* Section Title input */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                      Module {sIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSections((prev) =>
                          prev.map((s) => (s.id === section.id ? { ...s, title: val } : s))
                        );
                      }}
                      className="flex-1 px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSection(section.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                    title="Remove module"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Lectures inside Section */}
                <div className="space-y-2 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                  {section.lectures.map((lecture, lIdx) => (
                    <div
                      key={lecture.id}
                      className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <input
                          type="text"
                          value={lecture.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSections((prev) =>
                              prev.map((s) => {
                                if (s.id !== section.id) return s;
                                return {
                                  ...s,
                                  lectures: s.lectures.map((l) =>
                                    l.id === lecture.id ? { ...l, title: val } : l
                                  ),
                                };
                              })
                            );
                          }}
                          className="w-full px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-medium text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          <input
                            type="number"
                            value={lecture.durationMinutes}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setSections((prev) =>
                                prev.map((s) => {
                                  if (s.id !== section.id) return s;
                                  return {
                                    ...s,
                                    lectures: s.lectures.map((l) =>
                                      l.id === lecture.id ? { ...l, durationMinutes: val } : l
                                    ),
                                  };
                                })
                              );
                            }}
                            className="w-14 px-1.5 py-1 text-center bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                          />
                          <span>mins</span>
                        </div>

                        <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lecture.isFreePreview}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSections((prev) =>
                                prev.map((s) => {
                                  if (s.id !== section.id) return s;
                                  return {
                                    ...s,
                                    lectures: s.lectures.map((l) =>
                                      l.id === lecture.id ? { ...l, isFreePreview: checked } : l
                                    ),
                                  };
                                })
                              );
                            }}
                            className="rounded text-indigo-600"
                          />
                          <span>Free preview</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleDeleteLecture(section.id, lecture.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddLecture(section.id)}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 pt-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Lecture to Module</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/instructor/dashboard')}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel Draft
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Submit Curriculum for Review</span>
          </button>
        </div>

      </form>

    </div>
  );
};
