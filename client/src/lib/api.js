const BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, errors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const init = body
    ? { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    : { method };

  const response = await fetch(`${BASE_URL}${path}`, init).catch(() => {
    throw new ApiError('Network error. Check your connection and try again.', 0);
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.ok) {
    throw new ApiError(
      data.error ?? (data.errors ? 'Please fix the highlighted fields.' : 'Request failed.'),
      response.status,
      data.errors ?? null,
    );
  }
  return data;
}

export const api = {
  sendContact: (payload) => request('/api/contact', { method: 'POST', body: payload }),
  getScores: (game) => request(`/api/scores/${game}`),
  submitScore: (payload) => request('/api/scores', { method: 'POST', body: payload }),
};
