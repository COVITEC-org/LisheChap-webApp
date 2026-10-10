/**
 * Consistent API response envelope.
 *
 * Success: { success: true, data, meta? }
 * Failure: { success: false, error: { code, message, details? } }
 */
export function sendSuccess(res, data, { statusCode = 200, meta } = {}) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

export function buildErrorBody(code, message, details) {
  const error = { code, message };
  if (details !== undefined) error.details = details;
  return { success: false, error };
}
