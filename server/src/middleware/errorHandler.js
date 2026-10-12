import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';
import { buildErrorBody } from '../utils/apiResponse.js';

// Translate known body-parser failures into safe client errors.
const BODY_PARSER_ERRORS = {
  'entity.parse.failed': { statusCode: 400, code: 'INVALID_JSON', message: 'Request body is not valid JSON' },
  'entity.too.large': { statusCode: 413, code: 'PAYLOAD_TOO_LARGE', message: 'Request body is too large' },
  'encoding.unsupported': { statusCode: 415, code: 'UNSUPPORTED_ENCODING', message: 'Unsupported request encoding' },
};

function normalizeError(err) {
  if (err instanceof AppError) return err;

  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
    return new AppError('Validation failed', { statusCode: 422, code: 'VALIDATION_ERROR', details });
  }

  const parserError = err && BODY_PARSER_ERRORS[err.type];
  if (parserError) {
    return new AppError(parserError.message, parserError);
  }

  return null;
}

/**
 * Central error handler. Stack traces and internal error messages are logged
 * server-side only and never returned to the client, in any environment.
 * Express identifies error handlers by their four-argument signature.
 */
export function errorHandler(err, req, res, _next) {
  const appError = normalizeError(err);

  if (appError) {
    if (appError.statusCode >= 500) req.log?.error({ err }, appError.message);
    return res
      .status(appError.statusCode)
      .json(buildErrorBody(appError.code, appError.message, appError.details));
  }

  req.log?.error({ err }, 'Unhandled error');
  return res
    .status(500)
    .json(buildErrorBody('INTERNAL_ERROR', 'An unexpected error occurred. Please try again later.'));
}
