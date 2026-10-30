import React, { useEffect, useState } from 'react';
import { Certificate } from '../../types';
import { ApiError } from '../../lib/api';
import { ShieldCheck, Search, CheckCircle, AlertTriangle, ArrowLeft, Award, ExternalLink } from 'lucide-react';
import { verifyCertificate } from '../../services/learningService';

interface CertificateVerifyPageProps {
  initialCode?: string;
  navigate: (path: string) => void;
}

export const CertificateVerifyPage: React.FC<CertificateVerifyPageProps> = ({
  initialCode = '',
  navigate,
}) => {
  const [searchCode, setSearchCode] = useState(initialCode);
  const [certificate, setCertificate] = useState<Certificate>();
  const [verificationError, setVerificationError] = useState('');

  useEffect(() => {
    let active = true;
    setSearchCode(initialCode);
    setCertificate(undefined);
    setVerificationError('');
    void verifyCertificate(initialCode)
      .then((result) => { if (active) setCertificate(result); })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 404) return;
        console.error('Unable to verify certificate:', error);
        setVerificationError('Certificate verification is temporarily unavailable.');
      });
    return () => { active = false; };
  }, [initialCode]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    setCertificate(undefined);
    setVerificationError('');
    try {
      setCertificate(await verifyCertificate(searchCode.trim()));
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return;
      console.error('Unable to verify certificate:', error);
      setVerificationError('Certificate verification is temporarily unavailable.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 text-left transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Learnova Credential Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Verify the authenticity and academic standing of any Learnova Specialization or Certificate of Mastery.
          </p>
        </div>

        {/* Verification Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Enter Certificate ID (e.g. LNV-2026-UIUX-9821A)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-mono uppercase bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white placeholder:normal-case placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            Verify Credential
          </button>
        </form>

        {/* Result Block */}
        {certificate ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-md p-6 sm:p-8 space-y-6">
            
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                    Verified Authentic Document
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Official Certificate of Specialization
                  </h2>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-100 sm:dark:border-slate-800 sm:pl-6">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Certificate ID</span>
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{certificate.code}</span>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Conferred To</span>
                <span className="text-base font-bold text-slate-900 dark:text-white block">{certificate.userName}</span>
                <span className="text-slate-500 dark:text-slate-400">Student ID: {certificate.userId}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Academic Program</span>
                <span className="text-base font-bold text-slate-900 dark:text-white block">{certificate.courseTitle}</span>
                <span className="text-slate-500 dark:text-slate-400">Course Code: {certificate.courseId}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Lead Faculty Chair</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">{certificate.instructorName}</span>
                <span className="text-slate-500 dark:text-slate-400">Learnova Department of Systems & Architecture</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Conferral Details</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">Issued on {certificate.issueDate}</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">Cumulative Grade: {certificate.gradePercentage}%</span>
              </div>
            </div>

            {/* Cryptographic Proof Strip */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs space-y-2">
              <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Cryptographic Proof Invariants</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">STATUS: VALID</span>
              </div>
              <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 break-all">
                Hash: {certificate.credentialHash}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                This credential was issued upon successful evaluation of laboratory exercises, automated code tests, and comprehensive timed assessments.
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No matching credential found</h3>
            <p>{verificationError || 'Please verify the certificate code entered.'}</p>
          </div>
        )}

      </div>
    </div>
  );
};
