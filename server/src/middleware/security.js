import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { config } from '../config/index.js';
import { AppError } from '../utils/AppError.js';
import { buildErrorBody } from '../utils/apiResponse.js';

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      // Images may come from HTTPS sources (restaurant photography, map tiles).
      'img-src': ["'self'", 'data:', 'blob:', 'https:'],
      'connect-src': ["'self'", ...config.clientOrigins],
    },
  },
  crossOriginResourcePolicy: { policy: 'same-site' },
});

export const corsMiddleware = cors({
  origin(origin, callback) {
    // Requests without an Origin header (same-origin, curl, health probes) are allowed.
    if (!origin || config.clientOrigins.includes(origin)) return callback(null, true);
    return callback(new AppError('Origin not allowed', { statusCode: 403, code: 'CORS_NOT_ALLOWED' }));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  maxAge: 600,
});

export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  limit: config.rateLimit.max,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) =>
    res
      .status(429)
      .json(buildErrorBody('RATE_LIMITED', 'Too many requests. Please slow down and try again shortly.')),
});

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function containsForbiddenKey(value, depth = 0) {
  if (depth > 20 || value === null || typeof value !== 'object') return false;
  for (const key of Object.keys(value)) {
    if (FORBIDDEN_KEYS.has(key) || containsForbiddenKey(value[key], depth + 1)) return true;
  }
  return false;
}

/**
 * Rejects request bodies that try to smuggle prototype-pollution keys.
 * Schema validation (zod) is still applied per route; this is a cheap global guard.
 */
export function rejectPrototypePollution(req, _res, next) {
  if (containsForbiddenKey(req.body)) {
    return next(AppError.badRequest('Request contains forbidden property names'));
  }
  return next();
}
