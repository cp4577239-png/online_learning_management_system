export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    let message = `Request failed (${response.status})`;
    if (text) {
      try {
        const body = JSON.parse(text) as { error?: unknown };
        message = typeof body.error === 'string' ? body.error : text;
      } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
        message = text;
      }
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, {
    method: 'POST',
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, {
    method: 'PATCH',
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export function describeApiError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred while loading data.';
}
