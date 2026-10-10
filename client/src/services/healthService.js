import { ApiError, api } from '../lib/apiClient.js';

/**
 * Returns the server health report. A 503 still carries a report
 * (API up, database down), so it is returned instead of thrown.
 */
export async function fetchHealth({ signal } = {}) {
  try {
    const { data } = await api.get('/health', { signal });
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 503 && error.payload?.data) {
      return error.payload.data;
    }
    throw error;
  }
}
