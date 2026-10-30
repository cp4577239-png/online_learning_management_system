import React, { useEffect, useRef, useState } from 'react';
import { Course, Lecture, Section } from '../../types';
import { useEnrollment } from '../../context/EnrollmentContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { VideoPlayer } from '../../components/learning/VideoPlayer';
import { AITutorDrawer } from '../../components/learning/AITutorDrawer';
import { getLectureStudyNotes, getLectureVideoUrl } from '../../data/courseLectureContent';
import { createDiscussion, listDiscussions } from '../../services/learningService';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  PlayCircle,
  FileCode2,
  StickyNote,
  MessageSquare,
  Sparkles,
  Award,
  ArrowLeft,
  ChevronRight,
  Clock,
  Download,
  Trash2,
  Plus,
  HelpCircle,
  Maximize2,
  Minimize2,
  Sun,
  Moon
} from 'lucide-react';

interface CourseLearningPlayerPageProps {
  course: Course;
  navigate: (path: string) => void;
}

export const CourseLearningPlayerPage: React.FC<CourseLearningPlayerPageProps> = ({
  course,
  navigate,
}) => {
  const { addPoints } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    getEnrollment,
    markLectureCompleted,
    notes,
    certificates,
    addNote,
    deleteNote,
    claimCertificate,
  } = useEnrollment();

  const enrollment = getEnrollment(course.id);
  const [currentLecture, setCurrentLecture] = useState<Lecture>(
    course.sections[0]?.lectures[0] || ({} as Lecture)
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'code' | 'discussions' | 'quiz'>('overview');
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [pendingTimestamp, setPendingTimestamp] = useState<number | null>(null);
  const completionInFlightRef = useRef(false);

  useEffect(() => {
    const courseLectures = course.sections.flatMap((section) => section.lectures);
    const currentCourseLecture = courseLectures.find((lecture) => lecture.id === currentLecture.id);
    if (currentCourseLecture) {
      if (currentCourseLecture !== currentLecture) setCurrentLecture(currentCourseLecture);
      return;
    }
    setCurrentLecture(courseLectures[0] || ({} as Lecture));
  }, [course.id, course.sections, currentLecture]);

interface DiscussionItem {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  reply?: string;
  instructorName?: string;
}

  // Discussion forum state
  const [discussions, setDiscussions] = useState<DiscussionItem[]>([]);
  const [newQuestionText, setNewQuestionText] = useState('');

  useEffect(() => {
    let active = true;
    setDiscussions([]);
    void listDiscussions(course.id, currentLecture.id)
      .then((records) => { if (active) setDiscussions(records); })
      .catch((error: unknown) => console.error('Unable to load course discussions:', error));
    return () => { active = false; };
  }, [course.id, currentLecture.id]);

  // Filter notes for current course & lecture
  const lectureNotes = notes.filter(
    (n) => n.courseId === course.id && n.lectureId === currentLecture.id
  );

  const completedLectureIds = enrollment?.completedLectureIds || [];
  const isCurrentCompleted = completedLectureIds.includes(currentLecture.id);
  const certificateAlreadyIssued = certificates.some((certificate) => certificate.courseId === course.id);

  const handleMarkCompleted = async () => {
    if (completionInFlightRef.current) return;
    if (isCurrentCompleted) {
      if (enrollment?.progressPercentage === 100 && !certificateAlreadyIssued) {
        completionInFlightRef.current = true;
        try {
          await claimCertificate(course.id);
        } catch (error) {
          console.error('Unable to issue the course certificate:', error);
          alert(error instanceof Error ? error.message : 'Unable to issue the course certificate.');
        } finally {
          completionInFlightRef.current = false;
        }
      }
      return;
    }

    completionInFlightRef.current = true;
    try {
      const updatedEnrollment = await markLectureCompleted(course.id, currentLecture.id);
      addPoints(50);
      if (updatedEnrollment.progressPercentage === 100) {
        await claimCertificate(course.id);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (error) {
      console.error('Unable to save course completion:', error);
      alert(error instanceof Error ? error.message : 'Unable to save course completion.');
    } finally {
      completionInFlightRef.current = false;
    }
  };

  const handleNextLecture = () => {
    let found = false;
    for (const section of course.sections) {
      for (let i = 0; i < section.lectures.length; i++) {
        if (found) {
          setCurrentLecture(section.lectures[i]);
          return;
        }
        if (section.lectures[i].id === currentLecture.id) {
          found = true;
          if (i + 1 < section.lectures.length) {
            setCurrentLecture(section.lectures[i + 1]);
            return;
          }
        }
      }
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const time = pendingTimestamp !== null ? pendingTimestamp : 0;
    try {
      await addNote(course.id, currentLecture.id, currentLecture.title, time, newNoteText);
      setNewNoteText('');
      setPendingTimestamp(null);
    } catch (error) {
      console.error('Unable to save learning note:', error);
      alert(error instanceof Error ? error.message : 'Unable to save learning note.');
    }
  };

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    try {
      const discussion = await createDiscussion({
        courseId: course.id,
        lectureId: currentLecture.id,
        content: newQuestionText,
      });
      setDiscussions((previous) => [...previous, discussion]);
      setNewQuestionText('');
    } catch (error) {
      console.error('Unable to post course discussion:', error);
      alert(error instanceof Error ? error.message : 'Unable to post your question.');
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Learning Navigation Bar */}
      <header className="h-14 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-30">
        
        <div className="flex items-center gap-3 truncate">
          <button
            onClick={() => navigate('/student/my-learning')}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Return to My Learning"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="truncate text-xs">
            <span className="text-slate-400 truncate hidden sm:inline">{course.title}</span>
            <span className="text-slate-500 mx-1.5 hidden sm:inline">/</span>
            <span className="text-white font-medium truncate">{currentLecture.title}</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
            <span>{enrollment?.progressPercentage || 0}% Complete</span>
            <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${enrollment?.progressPercentage || 0}%` }}
              />
            </div>
          </div>

          {/* Theater Mode toggle */}
          <button
            onClick={() => setTheaterMode(!theaterMode)}
            className="hidden sm:flex items-center gap-1 p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
            title={theaterMode ? 'Standard View' : 'Theater View'}
          >
            {theaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsAITutorOpen(!isAITutorOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isAITutorOpen
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-indigo-400 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Tutor</span>
          </button>

          <button
            onClick={handleMarkCompleted}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isCurrentCompleted
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isCurrentCompleted ? 'Completed' : 'Mark Complete'}</span>
          </button>

          <button
            onClick={handleNextLecture}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            title="Next Lecture"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Center Canvas: Video + Lower Tabs */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 flex flex-col">
          
          {/* Video Player */}
          <div className={`mx-auto w-full transition-all duration-300 ${theaterMode ? 'max-w-7xl' : 'max-w-5xl'}`}>
            <VideoPlayer
              videoUrl={getLectureVideoUrl(course, currentLecture)}
              lectureTitle={currentLecture.title}
              onEnded={handleMarkCompleted}
              onAddNote={() => {
                setPendingTimestamp(null);
                setActiveTab('notes');
              }}
              onAddNoteAtTimestamp={(sec) => {
                setPendingTimestamp(sec);
                setActiveTab('notes');
              }}
            />
            <p className="mt-2 text-[11px] text-slate-400">
              This lecture is marked complete when its video ends. Finish every lecture in the course to unlock your certificate.
            </p>
          </div>

          {/* Lower Tabbed Container */}
          <div className={`mx-auto w-full flex-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col text-left ${theaterMode ? 'max-w-7xl' : 'max-w-5xl'}`}>
            
            {/* Tabs Header */}
            <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-800 text-xs overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Overview & Summary
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-2 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'notes'
                    ? 'border-indigo-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <StickyNote className="w-3.5 h-3.5" />
                <span>Notes ({lectureNotes.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-2 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'code'
                    ? 'border-indigo-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Lab & Starter Code</span>
              </button>
              <button
                onClick={() => setActiveTab('discussions')}
                className={`px-3 py-2 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'discussions'
                    ? 'border-indigo-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Lecture Q&A ({discussions.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3 py-2 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'quiz'
                    ? 'border-indigo-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Quiz Checkpoint</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-5 flex-1 overflow-y-auto text-xs leading-relaxed">
              
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-4 max-w-3xl">
                  <h3 className="text-base font-bold text-white">{currentLecture.title}</h3>
                  <p className="text-slate-300">
                    {currentLecture.summary ||
                      'In this lecture, we analyze core architectural primitives, examine trade-offs under high network saturation, and benchmark system behavior against baseline requirements.'}
                  </p>

                  {currentLecture.resources && currentLecture.resources.length > 0 && (
                    <div className="pt-4 border-t border-slate-800">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Downloadable Lecture Assets
                      </h4>
                      <div className="space-y-2">
                        {currentLecture.resources.map((res) => (
                          <div
                            key={res.id}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 max-w-md"
                          >
                            <span className="font-mono text-slate-200 truncate">{res.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-slate-400 font-mono tabular-nums">{res.fileSize}</span>
                              <a
                                href={res.url}
                                download
                                className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-white"
                                title="Download"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Notes */}
              {activeTab === 'notes' && (
                <div className="space-y-4 max-w-3xl">
                  <section className="rounded-lg border border-indigo-900/70 bg-indigo-950/30 p-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">Lecture study notes</h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Key ideas for {currentLecture.title}
                      </p>
                    </div>
                    <ul className="space-y-2 list-disc pl-5 text-xs leading-relaxed text-slate-200">
                      {getLectureStudyNotes(currentLecture).map((studyNote) => (
                        <li key={studyNote}>{studyNote}</li>
                      ))}
                    </ul>
                  </section>

                  <form onSubmit={handleCreateNote} className="space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>
                        Note pinned to:{' '}
                        <strong className="text-white font-mono">
                          {pendingTimestamp !== null ? formatSeconds(pendingTimestamp) : 'General'}
                        </strong>
                      </span>
                      {pendingTimestamp !== null && (
                        <button
                          type="button"
                          onClick={() => setPendingTimestamp(null)}
                          className="text-indigo-400 hover:underline"
                        >
                          Clear timestamp
                        </button>
                      )}
                    </div>
                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Write your observation or code reminder..."
                      rows={3}
                      className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newNoteText.trim()}
                        className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors text-xs"
                      >
                        Save Note
                      </button>
                    </div>
                  </form>

                  <div className="pt-4 border-t border-slate-800 space-y-2.5">
                    {lectureNotes.length === 0 ? (
                      <div className="text-slate-500 text-center py-6">
                        No notes taken yet. Use the "Note" button on the video player to pin key takeaways!
                      </div>
                    ) : (
                      lectureNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono text-[10px] tabular-nums font-semibold">
                              {formatSeconds(note.timestampSeconds)}
                            </span>
                            <p className="text-slate-200">{note.text}</p>
                            <span className="text-[10px] text-slate-500 block">{note.createdAt}</span>
                          </div>
                          <button
                            onClick={() => {
                              void deleteNote(note.id).catch((error: unknown) => {
                                console.error('Unable to delete learning note:', error);
                                alert(error instanceof Error ? error.message : 'Unable to delete learning note.');
                              });
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1"
                            title="Delete note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Lab Code */}
              {activeTab === 'code' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">Starter Code & Benchmark Lab</h4>
                      <p className="text-slate-400 text-[11px]">
                        Review and execute the real-world implementation discussed in this lecture.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(currentLecture.starterCode || '');
                        alert('Starter code copied to clipboard!');
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs"
                    >
                      Copy Snippet
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto leading-relaxed">
                    {currentLecture.starterCode ||
                      `// Architecture Benchmark Stub\nexport async function handleRequest(req, res) {\n  const tokenValid = await verifyToken(req.headers['authorization']);\n  if (!tokenValid) return res.status(401).json({ error: 'Unauthorized' });\n  return res.json({ status: 'ok', latencyMs: 1.2 });\n}`}
                  </pre>
                </div>
              )}

              {/* Tab 4: Discussions */}
              {activeTab === 'discussions' && (
                <div className="space-y-4 max-w-3xl">
                  <form onSubmit={handlePostQuestion} className="space-y-2">
                    <textarea
                      rows={2}
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="Ask a technical question about this lecture..."
                      className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newQuestionText.trim()}
                        className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors text-xs"
                      >
                        Post Question
                      </button>
                    </div>
                  </form>

                  <div className="space-y-3 pt-2">
                    {discussions.map((d) => (
                      <div key={d.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
                        <div className="flex items-center gap-2.5">
                          <img src={d.avatar} alt={d.author} className="w-6 h-6 rounded-full object-cover" />
                          <div className="text-xs">
                            <span className="font-bold text-white">{d.author}</span>
                            <span className="text-slate-400 font-mono ml-2 text-[10px]">{d.time}</span>
                          </div>
                        </div>
                        <p className="text-slate-300 text-xs">{d.content}</p>

                        {d.reply && (
                          <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-xs space-y-1">
                            <div className="font-semibold text-indigo-300 text-[11px] flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                              <span>{d.instructorName}</span>
                            </div>
                            <p className="text-slate-200">{d.reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Quiz */}
              {activeTab === 'quiz' && (
                <div className="max-w-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    {course.quiz?.title || 'Lecture Comprehension Check'}
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Test your understanding of the architectural invariants and formulas introduced in this section.
                  </p>
                  <button
                    onClick={() => navigate('/student/quizzes')}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                  >
                    <span>Launch Interactive Quiz Runner</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>

          </div>

        </main>

        {/* Right Sidebar: Course Curriculum Tree */}
        <aside className="w-80 bg-slate-900 border-l border-slate-800 hidden lg:flex flex-col h-full text-left shrink-0">
          
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Curriculum Content
            </h3>
            <span className="text-[11px] font-mono text-slate-400 tabular-nums">
              {completedLectureIds.length} / {course.lecturesCount} done
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800 text-xs">
            {course.sections.map((section) => (
              <div key={section.id} className="py-2">
                <div className="px-4 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.lectures.map((lecture) => {
                    const isCurrent = currentLecture.id === lecture.id;
                    const isDone = completedLectureIds.includes(lecture.id);

                    return (
                      <button
                        key={lecture.id}
                        onClick={() => setCurrentLecture(lecture)}
                        className={`w-full px-4 py-2.5 flex items-start gap-2.5 text-left transition-colors ${
                          isCurrent
                            ? 'bg-indigo-600/20 text-white font-semibold border-l-2 border-indigo-500'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <PlayCircle className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </div>
                        <div className="truncate flex-1">
                          <div className="truncate">{lecture.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono tabular-nums">
                            {lecture.durationMinutes} mins
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Certificate Claim if 100% */}
          {enrollment?.progressPercentage === 100 && (
            <div className="p-4 bg-emerald-950/60 border-t border-emerald-800/80">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-1">
                <Award className="w-4 h-4" />
                <span>Specialization Completed!</span>
              </div>
              <button
                onClick={() => navigate('/student/certificates')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                View & Download Certificate
              </button>
            </div>
          )}

        </aside>

        {/* AI Tutor Slide-in Drawer */}
        <AITutorDrawer
          course={course}
          currentLecture={currentLecture}
          isOpen={isAITutorOpen}
          onClose={() => setIsAITutorOpen(false)}
        />

      </div>

    </div>
  );
};
