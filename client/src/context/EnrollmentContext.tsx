import React, { createContext, useContext, useEffect, useState } from 'react';
import { Enrollment, TimestampedNote, Certificate, Course } from '../types';
import { useAuth } from './AuthContext';
import {
  createEnrollment as createEnrollmentRequest,
  createNote as createNoteRequest,
  deleteNote as deleteNoteRequest,
  issueCertificate,
  listMyCertificates,
  listMyEnrollments,
  listMyNotes,
  updateEnrollmentProgress,
} from '../services/learningService';

interface EnrollmentContextType {
  enrollments: Enrollment[];
  notes: TimestampedNote[];
  certificates: Certificate[];
  isEnrolled: (courseId: string) => boolean;
  enrollInCourse: (course: Course) => Promise<Enrollment>;
  getEnrollment: (courseId: string) => Enrollment | undefined;
  markLectureCompleted: (courseId: string, lectureId: string) => Promise<Enrollment>;
  setCurrentLecture: (courseId: string, lectureId: string) => void;
  addNote: (courseId: string, lectureId: string, lectureTitle: string, timestampSeconds: number, text: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  claimCertificate: (courseId: string) => Promise<Certificate>;
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

export const EnrollmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [notes, setNotes] = useState<TimestampedNote[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    let active = true;
    setEnrollments([]);
    setNotes([]);
    setCertificates([]);
    if (!user) return () => { active = false; };

    void listMyEnrollments()
      .then((records) => { if (active) setEnrollments(records); })
      .catch((error: unknown) => console.error('Unable to load enrollments:', error));
    void listMyNotes()
      .then((records) => { if (active) setNotes(records); })
      .catch((error: unknown) => console.error('Unable to load learning notes:', error));
    void listMyCertificates()
      .then((records) => { if (active) setCertificates(records); })
      .catch((error: unknown) => console.error('Unable to load certificates:', error));

    return () => { active = false; };
  }, [user?.id]);

  const isEnrolled = (courseId: string) => enrollments.some((enrollment) => enrollment.courseId === courseId);
  const getEnrollment = (courseId: string) => enrollments.find((enrollment) => enrollment.courseId === courseId);

  const enrollInCourse = async (course: Course): Promise<Enrollment> => {
    if (!user) throw new Error('You must be logged in to enroll in a course.');
    const existing = getEnrollment(course.id);
    if (existing) return existing;

    const enrollment = await createEnrollmentRequest(course.id);
    setEnrollments((previous) => [enrollment, ...previous.filter((item) => item.id !== enrollment.id)]);
    return enrollment;
  };

  const markLectureCompleted = async (courseId: string, lectureId: string): Promise<Enrollment> => {
    const enrollment = getEnrollment(courseId);
    if (!enrollment) throw new Error('You are not enrolled in this course.');
    const updated = await updateEnrollmentProgress(enrollment.id, lectureId, true);
    setEnrollments((previous) => previous.map((item) => item.id === updated.id ? updated : item));
    return updated;
  };

  const setCurrentLecture = (courseId: string, lectureId: string): void => {
    const enrollment = getEnrollment(courseId);
    if (!enrollment) return;

    void updateEnrollmentProgress(enrollment.id, lectureId, false)
      .then((updated) => {
        setEnrollments((previous) => previous.map((item) => item.id === updated.id ? updated : item));
      })
      .catch((error: unknown) => console.error('Unable to save course progress:', error));
  };

  const addNote = async (
    courseId: string,
    lectureId: string,
    lectureTitle: string,
    timestampSeconds: number,
    text: string,
  ): Promise<void> => {
    const note = await createNoteRequest({ courseId, lectureId, lectureTitle, timestampSeconds, text });
    setNotes((previous) => [note, ...previous]);
  };

  const deleteNote = async (id: string): Promise<void> => {
    await deleteNoteRequest(id);
    setNotes((previous) => previous.filter((note) => note.id !== id));
  };

  const claimCertificate = async (courseId: string): Promise<Certificate> => {
    if (!user) throw new Error('You must be logged in to claim a certificate.');
    const existing = certificates.find((certificate) => certificate.courseId === courseId);
    if (existing) return existing;

    const certificate = await issueCertificate(courseId);
    setCertificates((previous) => [certificate, ...previous.filter((item) => item.id !== certificate.id)]);
    return certificate;
  };

  return (
    <EnrollmentContext.Provider
      value={{
        enrollments,
        notes,
        certificates,
        isEnrolled,
        enrollInCourse,
        getEnrollment,
        markLectureCompleted,
        setCurrentLecture,
        addNote,
        deleteNote,
        claimCertificate,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};

export const useEnrollment = () => {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollment must be used within an EnrollmentProvider');
  }
  return context;
};
