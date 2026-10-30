import React, { useState, useEffect } from 'react';
import { Quiz } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useEnrollment } from '../../context/EnrollmentContext';
import { getCourseQuiz } from '../../data/courseQuizDefaults';
import confetti from 'canvas-confetti';
import {
  FileQuestion,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const StudentQuizzesPage: React.FC = () => {
  const { addPoints } = useAuth();
  const { enrollments } = useEnrollment();
  const availableQuizzes = enrollments.map((enrollment) => ({
    courseTitle: enrollment.course.title,
    quiz: getCourseQuiz(enrollment.course),
  }));

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(600);
  const [score, setScore] = useState<{ correct: number; total: number; percentage: number; passed: boolean } | null>(null);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeQuiz && !quizSubmitted && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeQuiz, quizSubmitted, timeRemainingSeconds]);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setTimeRemainingSeconds(quiz.timeLimitMinutes * 60);
    setScore(null);
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    setQuizSubmitted(true);

    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const total = activeQuiz.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= activeQuiz.passingScorePercentage;

    setScore({
      correct: correctCount,
      total,
      percentage,
      passed,
    });

    if (passed) {
      addPoints(100);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Quizzes & Course Checkpoints
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Take the practice checkpoints for your enrolled courses and review explanations for each answer.
        </p>
      </div>

      {!activeQuiz ? (
        /* Quiz Catalog / Available Assessments */
        <div className="space-y-4">
          {availableQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {availableQuizzes.map(({ courseTitle, quiz }, index) => (
                <div
                  key={quiz.id}
                  className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                >
                  <div className={`absolute inset-y-0 left-0 w-1 ${index % 2 ? 'bg-violet-500' : 'bg-indigo-500'}`} />
                  <div className="space-y-2 max-w-2xl pl-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                      <FileQuestion className="w-3 h-3" />
                      COURSE CHECKPOINT
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{courseTitle}</p>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{quiz.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{quiz.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums pt-1">
                      <span>{quiz.questions.length} questions</span>
                      <span aria-hidden="true">·</span>
                      <span>{quiz.timeLimitMinutes} minutes</span>
                      <span aria-hidden="true">·</span>
                      <span>{quiz.passingScorePercentage}% to pass</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors whitespace-nowrap shadow-sm"
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-sm text-slate-500">
              Enroll in a course to unlock its practice checkpoint here.
            </div>
          )}
        </div>
      ) : (
        /* Active Quiz Runner */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          
          {/* Runner Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="truncate">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                Assessment in Progress
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {activeQuiz.title}
              </h2>
            </div>

            {/* Countdown Clock */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-bold tabular-nums ${
              timeRemainingSeconds < 120
                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeRemainingSeconds)}</span>
            </div>
          </div>

          {/* Results Summary if submitted */}
          {quizSubmitted && score && (
            <div className={`p-6 border-b ${
              score.passed
                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40'
                : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {score.passed ? (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {score.passed ? 'Assessment Passed!' : 'Assessment Not Passed'}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-mono tabular-nums">
                      Score: <strong className="text-slate-900 dark:text-white">{score.percentage}%</strong> ({score.correct} / {score.total} correct). Passing requirement: {activeQuiz.passingScorePercentage}%.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartQuiz(activeQuiz)}
                    className="px-3.5 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Return to Catalog
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Question View */}
          <div className="p-6 space-y-6">
            
            {/* Question navigator bubbles */}
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
              {activeQuiz.questions.map((_, idx) => {
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isCurrent = currentQuestionIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isAnswered
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Question text & options */}
            {activeQuiz.questions[currentQuestionIndex] && (
              <div className="space-y-4">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {activeQuiz.questions[currentQuestionIndex].question}
                </h3>

                <div className="space-y-2 pt-2">
                  {activeQuiz.questions[currentQuestionIndex].options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                    const isCorrect = activeQuiz.questions[currentQuestionIndex].correctOptionIndex === optIdx;
                    
                    let optionStyle = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500';
                    if (isSelected) {
                      optionStyle = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-900 dark:text-indigo-200 font-medium ring-1 ring-indigo-600';
                    }
                    
                    if (quizSubmitted) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-medium';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                        className={`w-full p-3.5 text-left text-xs rounded-xl border transition-all flex items-start gap-3 ${optionStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-slate-400 dark:border-slate-500 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1 leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation if submitted */}
                {quizSubmitted && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white block">Explanation:</span>
                    <p>{activeQuiz.questions[currentQuestionIndex].explanation}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Next Question
                  </button>
                ) : (
                  !quizSubmitted && (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      Submit Assessment
                    </button>
                  )
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
