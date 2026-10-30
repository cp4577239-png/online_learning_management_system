import React from 'react';
import { Award, BookOpen, ShieldCheck, Terminal, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 text-left transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Intro */}
        <div className="space-y-4">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
            Pedagogy & Standards
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Building the Standard for High-Rigor Engineering Education
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Learnova was founded by distributed systems architects and senior researchers who recognized that mainstream online learning platforms fail to prepare engineers for the realities of modern planet-scale infrastructure.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Production Invariants Over Toys</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We never teach "To-Do apps". Every program is structured around real enterprise constraints: split-brain partitions, Byzantine faults, cache stampedes, sub-50ms p99 latency SLAs, and zero-downtime migrations.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Verifiable Academic Integrity</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Learnova credentials cannot be claimed by skipping video lessons. Every certificate requires passing randomized, timed assessments and completing hands-on code labs.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Practitioner Faculty</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              All faculty members actively maintain production codebases or conduct peer-reviewed research in distributed systems, machine learning, and systems security.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Global Engineering Cohort</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Our 45,000+ alumni span top technology organizations including Meta, Google, Stripe, Razorpay, Datadog, and innovative deep-tech startups across 80+ countries.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
