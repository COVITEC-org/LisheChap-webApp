const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  constructor(message, { status, code, details, payload } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.payload = payload;
  }
}

async function parseBody(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Thin fetch wrapper used by every service module.
 * - Sends cookies (auth is cookie based, see ARCHITECTURE.md).
 * - Serializes JSON bodies.
 * - Normalizes failures into ApiError using the server's error envelope.
 * Network failures are raised as ApiError with code NETWORK_ERROR.
 */
export async function apiRequest(path, { method = 'GET', body, headers, signal } = {}) {
  const hasBody = body !== undefined;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: hasBody ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Network request failed', { status: 0, code: 'NETWORK_ERROR' });
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    const apiError = payload?.error;
    throw new ApiError(apiError?.message || `Request failed with status ${response.status}`, {
      status: response.status,
      code: apiError?.code || 'HTTP_ERROR',
      details: apiError?.details,
      payload,
    });
  }

  return payload;
}

export const api = {
  get: (path, options) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options) => apiRequest(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => apiRequest(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => apiRequest(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => apiRequest(path, { ...options, method: 'DELETE' }),
};
