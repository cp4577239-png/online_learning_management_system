import { api } from '../lib/api';
import { Certificate, Enrollment, Order, TimestampedNote } from '../types';

export interface LearningDiscussion {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  reply?: string;
  instructorName?: string;
}

interface EnrollmentListResponse {
  enrollments: Enrollment[];
}

interface EnrollmentResponse {
  enrollment: Enrollment;
}

interface CertificateListResponse {
  certificates: Certificate[];
}

interface CertificateResponse {
  certificate: Certificate;
}

interface NoteListResponse {
  notes: TimestampedNote[];
}

interface OrderListResponse {
  orders: Order[];
}

interface OrderResponse {
  order: Order;
}

interface DiscussionListResponse {
  discussions: LearningDiscussion[];
}

interface DiscussionResponse {
  discussion: LearningDiscussion;
}

export async function listMyEnrollments(): Promise<Enrollment[]> {
  const response = await api.get<EnrollmentListResponse>('/enrollments/me');
  return response.enrollments;
}

export async function createEnrollment(courseId: string): Promise<Enrollment> {
  const response = await api.post<EnrollmentResponse>('/enrollments', { courseId });
  return response.enrollment;
}

export async function updateEnrollmentProgress(
  enrollmentId: string,
  lectureId: string,
  completed: boolean,
): Promise<Enrollment> {
  const response = await api.patch<EnrollmentResponse>(`/enrollments/${encodeURIComponent(enrollmentId)}/progress`, {
    lectureId,
    completed,
  });
  return response.enrollment;
}

export async function listMyNotes(courseId?: string): Promise<TimestampedNote[]> {
  const query = courseId ? `?courseId=${encodeURIComponent(courseId)}` : '';
  const response = await api.get<NoteListResponse>(`/notes${query}`);
  return response.notes;
}

export async function createNote(note: Omit<TimestampedNote, 'id' | 'createdAt'> & { createdAt?: string }): Promise<TimestampedNote> {
  const response = await api.post<{ note: TimestampedNote }>('/notes', note);
  return response.note;
}

export async function deleteNote(noteId: string): Promise<void> {
  await api.delete<void>(`/notes/${encodeURIComponent(noteId)}`);
}

export async function listMyCertificates(): Promise<Certificate[]> {
  const response = await api.get<CertificateListResponse>('/certificates/me');
  return response.certificates;
}

export async function issueCertificate(courseId: string): Promise<Certificate> {
  const response = await api.post<CertificateResponse>(`/certificates/${encodeURIComponent(courseId)}`);
  return response.certificate;
}

export async function verifyCertificate(code: string): Promise<Certificate> {
  const response = await api.get<CertificateResponse>(`/certificates/verify/${encodeURIComponent(code)}`);
  return response.certificate;
}

export async function listMyOrders(): Promise<Order[]> {
  const response = await api.get<OrderListResponse>('/orders/me');
  return response.orders;
}

export async function createOrder(input: {
  items: Array<{ courseId: string }>;
  couponApplied?: string;
  paymentMethod: Order['paymentMethod'];
}): Promise<Order> {
  const response = await api.post<OrderResponse>('/orders', input);
  return response.order;
}

export async function listDiscussions(courseId: string, lectureId: string): Promise<LearningDiscussion[]> {
  const params = new URLSearchParams({ courseId, lectureId });
  const response = await api.get<DiscussionListResponse>(`/discussions?${params.toString()}`);
  return response.discussions;
}

export async function createDiscussion(input: {
  courseId: string;
  lectureId: string;
  content: string;
}): Promise<LearningDiscussion> {
  const response = await api.post<DiscussionResponse>('/discussions', input);
  return response.discussion;
}
