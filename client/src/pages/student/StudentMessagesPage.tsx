import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Send, UserCheck, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'student' | 'instructor';
  name: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export const StudentMessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'instructor',
      name: 'Dr. Sarah Chen',
      avatar: '/src/assets/images/instructor_sarah_chen_1793174975407.jpg',
      text: 'Hi Alex, saw your submission on the distributed token-bucket rate limiter. Your probabilistic refresh logic is very clean! Did you test it against rapid concurrency spikes?',
      timestamp: 'Yesterday at 3:45 PM',
    },
    {
      id: 'msg_2',
      sender: 'student',
      name: 'Alex Rivera',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      text: 'Thanks Dr. Chen! Yes, I tested with autocannon simulating 10,000 req/sec across 4 worker threads. Adding atomic Redis Lua scripts prevented the race conditions we saw in the first benchmark.',
      timestamp: 'Yesterday at 4:10 PM',
    },
  ]);

  const [newMsg, setNewMsg] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'student',
      name: user?.name || 'Alex Rivera',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      text: newMsg,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, msg]);
    setNewMsg('');

    // Instructor simulation response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_inst_${Date.now()}`,
          sender: 'instructor',
          name: 'Dr. Sarah Chen',
          avatar: '/src/assets/images/instructor_sarah_chen_1793174975407.jpg',
          text: 'Terrific execution! In our next live architecture session on Thursday, we will discuss how to cluster those Redis instances with Sentinel failover.',
          timestamp: 'Just now',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-left flex flex-col h-[calc(100vh-5rem)]">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Instructor Direct Discussions
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Direct messaging channel with course instructors and teaching assistants.
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col shadow-sm">
        
        {/* Chat header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/instructor_sarah_chen_1793174975407.jpg"
              alt="Dr. Sarah Chen"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Dr. Sarah Chen</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Lead Faculty Chair · Online</div>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Distributed Systems Specialization</span>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'student' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <img
                src={m.avatar}
                alt={m.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 mt-1"
              />
              <div
                className={`max-w-[70%] p-3.5 rounded-xl text-xs leading-relaxed ${
                  m.sender === 'student'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="font-semibold text-[11px] mb-1 opacity-90">{m.name}</div>
                <div>{m.text}</div>
                <div className={`text-[10px] mt-1.5 text-right ${
                  m.sender === 'student' ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type your question or architecture feedback to Dr. Chen..."
            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!newMsg.trim()}
            className="px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
