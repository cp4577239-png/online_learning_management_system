import React, { useState } from 'react';
import { Mail, MessageSquare, CheckCircle, Send, Building } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('enterprise');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 text-left transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="max-w-2xl">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
            Admissions & Inquiries
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Connect with Academic Admissions
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            Have questions regarding organizational cohort pricing, faculty accreditation, or course syllabi? Our advisory team replies within 1 business day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Direct Inquiries</h3>
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>admissions@learnova.edu</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Learnova Academic Operations, Bengaluru & San Francisco</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
              <strong className="block">Corporate Sponsorships</strong>
              <p className="text-[11px] leading-relaxed">
                We accept corporate wire transfers and provide official GST-compliant tax invoices for learning stipends.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              {submitted ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Inquiry Received</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Thank you, {name}. A member of our academic curriculum board will reach out to <strong className="font-mono text-slate-800 dark:text-slate-200">{email}</strong> shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Chen"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maya@enterprise.com"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="enterprise">Enterprise Team Cohort (5+ Engineers)</option>
                      <option value="curriculum">Curriculum & Syllabus Specifics</option>
                      <option value="faculty">Faculty Accreditation Inquiry</option>
                      <option value="billing">Corporate Billing & Invoicing</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your team size, learning objectives, or question..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Submit Inquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
