import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, BookOpen, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Course, Lecture } from '../../types';

interface AITutorDrawerProps {
  course: Course;
  currentLecture: Lecture;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({
  course,
  currentLecture,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello! I'm your AI Academic Companion for "${course.title}". You're currently studying "${currentLecture.title}". Ask me to explain a concept, quiz your knowledge, or generate a real-world code example.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Context-aware academic assistant logic
    setTimeout(() => {
      let response = '';
      const lower = userMsg.text.toLowerCase();

      if (lower.includes('summar') || lower.includes('key point')) {
        response = `Here is a structured executive summary of "${currentLecture.title}":\n\n1. Core Invariant: Trade-offs are not optional; distributed systems always negotiate between consistency, latency, and fault isolation.\n2. Invalidation & Mutation: Applying idempotent transactions via unique UUID request identifiers guarantees that network retries never duplicate side-effects.\n3. Best Practice: Implement health check probing and circuit-breaker backoffs to prevent cascading queue starvation.`;
      } else if (lower.includes('quiz') || lower.includes('test me')) {
        response = `Here is a quick concept checkpoint for you:\n\nQuestion: Why is 2-Phase Commit (2PC) considered an anti-pattern across loosely-coupled microservices running on public cloud providers?\n\nA) It consumes too much CPU bandwidth.\nB) It holds distributed database locks across network boundaries, causing blocking latency and single points of failure.\nC) It violates RESTful API naming conventions.\n\nTake your guess, and I'll review your answer!`;
      } else if (lower.includes('b') || lower.includes('lock')) {
        response = `Spot on! Option B is correct. 2PC creates a blocking dependency where any coordinator failure or network delay leaves all participating databases holding row locks indefinitely. That is why Sagas with asynchronous compensating transactions are preferred in production.`;
      } else {
        response = `Regarding "${userMsg.text}" within the context of ${currentLecture.title}:\n\nWhen designing this layer, senior architects emphasize deterministic execution and fault boundaries. In high-concurrency environments, always ensure data mutations are idempotent and that timeout thresholds are strictly calibrated below upstream client SLA ceilings.\n\nWould you like a sample TypeScript code pattern for this, or a deeper dive into failover edge cases?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: response,
          timestamp: 'Just now',
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <aside className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl z-30">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Learnova AI Tutor</h3>
            <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
              Context: {currentLecture.title}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
          title="Close AI Tutor"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 bg-indigo-50/60 border-b border-indigo-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-indigo-800 font-semibold shrink-0">Prompts:</span>
        <button
          onClick={() => handleQuickPrompt('Summarize key points for this lecture')}
          className="px-2 py-0.5 rounded bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-200 whitespace-nowrap shrink-0 transition-colors"
        >
          Summarize Lecture
        </button>
        <button
          onClick={() => handleQuickPrompt('Quiz me on this topic')}
          className="px-2 py-0.5 rounded bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-200 whitespace-nowrap shrink-0 transition-colors"
        >
          Generate Quiz
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-800 border border-slate-200/80'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 py-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
            <span>Analyzing lecture curriculum...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about this lecture or code..."
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

    </aside>
  );
};
