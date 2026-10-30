import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface PricingPageProps {
  navigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ navigate }) => {
  const [cadence, setCadence] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      id: 'free',
      name: 'Independent Explorer',
      target: 'For early-stage developers exploring core foundations',
      priceMonthly: 0,
      priceAnnual: 0,
      features: [
        'Free preview lectures on all masterclasses',
        'Open-source starter code repositories',
        'Public discussion boards & community forums',
        'Standard video playback (up to 720p)',
      ],
      limits: 'No verified certificates · Standard community support',
      cta: 'Explore Free Catalog',
      popular: false,
    },
    {
      id: 'pro',
      name: 'Professional Specialization',
      target: 'For active engineers targeting staff & architect promotions',
      priceMonthly: 1999,
      priceAnnual: 1499,
      features: [
        'Full unlimited access to all 48+ masterclasses',
        'Interactive AI Academic Tutor with unlimited context queries',
        'Timed architectural quizzes with automated grading',
        'Cryptographically signed Verified Certificates of Specialization',
        'Downloadable production blueprints & Docker/Terraform labs',
      ],
      limits: 'Up to 3 concurrent learning sessions · Priority instructor Q&A',
      cta: 'Start Professional Pass',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Engineering Team',
      target: 'For scaling engineering organizations and university labs',
      priceMonthly: 4999,
      priceAnnual: 3999,
      features: [
        'Everything in Professional Specialization',
        'Dedicated team progress telemetry & completion analytics',
        'Centralized billing, GST invoicing & SAML SSO integration',
        'Quarterly live virtual office hours with Dr. Sarah Chen',
        'Custom organizational learning roadmaps & grading rubrics',
      ],
      limits: 'Starts at 5 seats · Dedicated customer success architect',
      cta: 'Contact Enterprise Admissions',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 text-left transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
            Transparent Investment in Mastery
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Plans Engineered for Every Career Milestone
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Choose individual course enrollment or all-access membership with AI tutoring and verifiable accreditation.
          </p>

          {/* Billing Cadence Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-medium ${cadence === 'monthly' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}>
              Monthly billing
            </span>
            <button
              onClick={() => setCadence(cadence === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 bg-slate-300 dark:bg-slate-700 rounded-full p-0.5 transition-colors focus:outline-none relative"
            >
              <div
                className={`w-5 h-5 rounded-full bg-indigo-600 transition-transform ${
                  cadence === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-medium ${cadence === 'annual' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}>
              Annual billing <strong className="text-emerald-600 dark:text-emerald-400">(Save 25%)</strong>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => {
            const activePrice = cadence === 'annual' ? p.priceAnnual : p.priceMonthly;

            return (
              <div
                key={p.id}
                className={`rounded-2xl bg-white dark:bg-slate-900 p-8 border flex flex-col justify-between transition-all relative ${
                  p.popular
                    ? 'border-indigo-600 shadow-xl ring-2 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white rounded-full text-[11px] font-bold uppercase tracking-wider shadow">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{p.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">{p.target}</p>

                  <div className="mt-6 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                        ₹{activePrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {p.priceMonthly === 0 ? '' : '/month'}
                      </span>
                    </div>
                    {cadence === 'annual' && p.priceMonthly > 0 && (
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">
                        Billed annually (₹{(activePrice * 12).toLocaleString('en-IN')} / year)
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 text-xs">
                    <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider block">
                      Included Capabilities
                    </span>
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 mt-8 space-y-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {p.limits}
                  </div>
                  <button
                    onClick={() => {
                      if (p.id === 'enterprise') navigate('/contact');
                      else navigate('/courses');
                    }}
                    className={`w-full py-2.5 text-xs font-bold rounded-lg transition-colors shadow-sm ${
                      p.popular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {p.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Security Callout */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-10 h-10 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Enterprise Invoicing & Corporate Reimbursement Support
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                92% of our learners expense their Learnova enrollment through their organization's annual professional learning and development stipend.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="px-5 py-2.5 text-xs font-semibold bg-slate-900 dark:bg-indigo-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors whitespace-nowrap"
          >
            Request Employer Receipt Template
          </button>
        </div>

      </div>
    </div>
  );
};
