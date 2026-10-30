import React from 'react';
import { useEnrollment } from '../../context/EnrollmentContext';
import { StickyNote, Trash2, Clock, BookOpen } from 'lucide-react';

export const StudentNotesPage: React.FC = () => {
  const { notes, deleteNote } = useEnrollment();

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Captured Notes & Bookmarks
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Review timestamped takeaways captured during lecture video playback across all enrolled programs.
        </p>
      </div>

      <div className="space-y-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{note.lectureTitle}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-mono tabular-nums bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded text-[11px] font-bold">
                    <Clock className="w-3 h-3" />
                    <span>{formatSeconds(note.timestampSeconds)}</span>
                  </span>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 p-1 transition-colors"
                  title="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed pt-1">
                {note.text}
              </p>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-50 dark:border-slate-800/80">
                Captured {note.createdAt}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-500 dark:text-slate-400 shadow-sm">
            <StickyNote className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p>No notes saved yet. Click the "Note at mm:ss" button while watching any lecture video!</p>
          </div>
        )}
      </div>
    </div>
  );
};
