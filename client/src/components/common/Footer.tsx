import React, { useState } from 'react';
import { Send, CheckCircle, ShieldCheck } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* Upper Grid: Brand + Links + Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 text-left">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                L
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Learnova</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Next-generation Learning Management System for rigorous computer science, distributed system architecture, neural networks, and modern UI/UX engineering.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SOC-2 Type II Certified · Cryptographic Verification</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3.5">Curriculum</h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => navigate('/courses')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  System Architecture
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/courses')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Applied Machine Learning
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/courses')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Production UI/UX Systems
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/courses')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Cloud Native DevOps
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/courses')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Cybersecurity Defense
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3.5">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => navigate('/pricing')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Enterprise Plans & Tiers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/instructors')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Verified Faculty
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/certificate/verify')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Credential Verification
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Pedagogy & Standards
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Admissions Inquiry
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3.5">Architecture Dispatch</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
              Bi-weekly engineering deep dives into consensus algorithms, transformers, and system reliability.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Subscribed! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="engineer@company.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    title="Subscribe"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 block">No spam. Unsubscribe anytime.</span>
              </form>
            )}
          </div>

        </div>

        {/* Lower Legal Bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Learnova Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">Security Audits</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
