/**
 * Operational error that is safe to show to API clients.
 * Anything that is not an AppError is treated as an unexpected failure and
 * reported to the client as a generic 500 without internal details.
 */
export class AppError extends Error {
  constructor(message, { statusCode = 400, code = 'BAD_REQUEST', details } = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
  }

  static badRequest(message, details) {
    return new AppError(message, { statusCode: 400, code: 'BAD_REQUEST', details });
  }

  static unauthorized(message = 'Authentication required') {
    return new AppError(message, { statusCode: 401, code: 'UNAUTHORIZED' });
  }

  static forbidden(message = 'You do not have permission to perform this action') {
    return new AppError(message, { statusCode: 403, code: 'FORBIDDEN' });
  }

  static notFound(message = 'Resource not found') {
    return new AppError(message, { statusCode: 404, code: 'NOT_FOUND' });
  }

  static conflict(message, details) {
    return new AppError(message, { statusCode: 409, code: 'CONFLICT', details });
  }
}
