import React, { useEffect, useState } from 'react';
import { useEnrollment } from '../../context/EnrollmentContext';
import { Certificate } from '../../types';
import { Award, ExternalLink, Printer, CheckCircle, ShieldCheck, LockKeyhole, LoaderCircle } from 'lucide-react';

interface StudentCertificatesPageProps {
  navigate: (path: string) => void;
}

export const StudentCertificatesPage: React.FC<StudentCertificatesPageProps> = ({ navigate }) => {
  const { certificates, enrollments, claimCertificate } = useEnrollment();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(certificates[0] || null);
  const [claimingCourseId, setClaimingCourseId] = useState<string | null>(null);
  const [claimError, setClaimError] = useState('');

  useEffect(() => {
    setSelectedCert((current) =>
      certificates.find((certificate) => certificate.id === current?.id) || certificates[0] || null
    );
  }, [certificates]);

  const handlePrint = () => {
    window.print();
  };

  const handleClaimCertificate = async (courseId: string) => {
    setClaimingCourseId(courseId);
    setClaimError('');
    try {
      await claimCertificate(courseId);
    } catch (error) {
      setClaimError(error instanceof Error ? error.message : 'Unable to issue this certificate. Please try again.');
    } finally {
      setClaimingCourseId(null);
    }
  };

  const certificateCourseIds = new Set(certificates.map((certificate) => certificate.courseId));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left print:p-0 print:max-w-none">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Verified Certificates & Credentials
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Cryptographically signed digital certificates for completed specializations and assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block">
        
        {/* Certificate List */}
        <div className="lg:col-span-5 space-y-3 print:hidden">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Earned Specializations ({certificates.length})
          </div>

          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedCert?.id === cert.id
                  ? 'bg-white dark:bg-slate-900 border-indigo-600 shadow-sm ring-1 ring-indigo-600'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {cert.courseTitle}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
                  {cert.gradePercentage}% Grade
                </span>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mb-3">
                ID: {cert.code}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Issued {cert.issueDate}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                  <span>View Details</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}

          {certificates.length === 0 && (
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg">
              <div className="absolute -right-5 -top-5 w-28 h-28 rounded-full bg-white/10" />
              <div className="relative flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">Your certificate journey starts here</h2>
                  <p className="text-[11px] text-indigo-100 mt-1">Finish a course to unlock an official, verifiable credential.</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Course Progress
            </div>
            {enrollments.map((enrollment) => {
              const isComplete = enrollment.progressPercentage === 100;
              const hasCertificate = certificateCourseIds.has(enrollment.courseId);
              return (
                <div key={enrollment.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">{enrollment.course.title}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {hasCertificate ? 'Certificate issued' : isComplete ? 'Ready to claim' : `${enrollment.progressPercentage}% complete`}
                      </p>
                    </div>
                    {hasCertificate ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : isComplete ? (
                      <button
                        disabled={claimingCourseId !== null}
                        onClick={() => void handleClaimCertificate(enrollment.courseId)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 shrink-0"
                      >
                        {claimingCourseId === enrollment.courseId ? <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
                        {claimingCourseId === enrollment.courseId ? 'Issuing…' : 'Claim'}
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/student/my-learning')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-400 shrink-0"
                      >
                        <LockKeyhole className="w-3 h-3" />
                        Continue
                      </button>
                    )}
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${hasCertificate ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${enrollment.progressPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {!enrollments.length && (
              <button
                onClick={() => navigate('/courses')}
                className="w-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-5 text-left text-xs text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors"
              >
                Enroll in a course to start working toward your first certificate <span className="font-bold text-indigo-600 dark:text-indigo-400">→</span>
              </button>
            )}
            {claimError && <p role="alert" className="text-xs text-rose-600 dark:text-rose-400">{claimError}</p>}
          </div>
        </div>

        {/* Certificate Diploma Visual Preview */}
        {selectedCert && (
          <div className="lg:col-span-7 space-y-4 print:block">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between print:hidden">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Official course completion credential
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/certificate/verify/${selectedCert.code}`)}
                  className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Public Registry Link</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>

            {/* Diploma Canvas */}
            <div className="relative isolate overflow-hidden aspect-[1.414/1] min-h-[580px] bg-[#fffdf7] text-slate-900 border border-amber-700/50 p-3 sm:p-5 shadow-xl print:aspect-auto print:min-h-0 print:w-full print:border-0 print:p-0 print:shadow-none print:break-inside-avoid">
              <style>{`
                @page { size: landscape; margin: 12mm; }
                @media print {
                  body { background: #fff !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                }
              `}</style>
              <div className="absolute inset-3 sm:inset-5 border border-amber-700/50 pointer-events-none" />
              <div className="absolute inset-4 sm:inset-7 border border-amber-700/20 pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-[24px] border-indigo-900/[0.03] pointer-events-none" />
              <div className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full border-[28px] border-amber-700/[0.04] pointer-events-none" />
              <div className="relative h-full flex flex-col items-center text-center px-5 py-5 sm:px-12 sm:py-8">
                <div className="w-full flex items-center justify-between text-[8px] sm:text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  <span>Learnova · Academic Records</span>
                  <span className="font-mono tracking-normal">{selectedCert.code}</span>
                </div>

                <div className="mt-4 sm:mt-6 flex items-center gap-3">
                  <span className="h-px w-8 sm:w-16 bg-amber-600/70" />
                  <span className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-amber-600/60 bg-gradient-to-br from-indigo-950 to-indigo-800 text-amber-200 flex items-center justify-center shadow-md ring-4 ring-amber-600/10">
                    <Award className="w-6 h-6 sm:w-8 sm:h-8" />
                  </span>
                  <span className="h-px w-8 sm:w-16 bg-amber-600/70" />
                </div>

                <p className="mt-3 text-[8px] sm:text-[10px] font-bold tracking-[0.32em] text-amber-800 uppercase">
                  Certificate of Completion
                </p>
                <h2 className="mt-1 text-2xl sm:text-4xl font-serif font-semibold tracking-wide text-indigo-950">
                  Certificate
                </h2>
                <p className="mt-1 text-[10px] sm:text-xs text-slate-500 italic">
                  This certificate is proudly presented to
                </p>

                <div className="mt-3 sm:mt-4 w-full max-w-2xl border-b border-amber-700/50 pb-2">
                  <p className="text-xl sm:text-3xl font-serif font-semibold text-slate-900">{selectedCert.userName}</p>
                </div>

                <p className="mt-3 max-w-2xl text-[9px] sm:text-xs leading-relaxed text-slate-600">
                  for successfully completing the course and meeting its learning requirements
                </p>
                <p className="mt-2 max-w-3xl text-sm sm:text-xl font-bold leading-snug text-indigo-950">
                  {selectedCert.courseTitle}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-700/30 bg-amber-50 px-3 py-1 text-[9px] sm:text-[11px] font-semibold text-amber-900">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                  Final grade: {selectedCert.gradePercentage}%
                </div>

                <div className="mt-auto w-full max-w-2xl grid grid-cols-[1fr_auto_1fr] items-end gap-3 sm:gap-8 pt-5">
                  <div className="text-center">
                    <p className="font-serif italic text-xs sm:text-sm text-slate-800 border-b border-slate-400 pb-1">{selectedCert.instructorName}</p>
                    <p className="mt-1 text-[7px] sm:text-[9px] uppercase tracking-[0.16em] text-slate-500">Course Instructor</p>
                  </div>
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-amber-700/60 outline outline-1 outline-offset-2 outline-amber-700/30 flex flex-col items-center justify-center text-amber-800">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-[5px] sm:text-[6px] font-bold tracking-wider">VERIFIED</span>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-[9px] sm:text-xs text-slate-800 border-b border-slate-400 pb-1">{selectedCert.issueDate}</p>
                    <p className="mt-1 text-[7px] sm:text-[9px] uppercase tracking-[0.16em] text-slate-500">Date of issue</p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-5 w-full border-t border-amber-700/20 pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[7px] sm:text-[9px] font-mono text-slate-500">
                  <span className="truncate">Credential ID: {selectedCert.code}</span>
                  <span className="truncate">SHA-256: {selectedCert.credentialHash.slice(0, 20)}…</span>
                  <span className="inline-flex items-center justify-center gap-1 font-sans font-semibold text-emerald-800">
                    <CheckCircle className="w-3 h-3" />
                    Independently verifiable
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
