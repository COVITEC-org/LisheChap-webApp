import pino from 'pino';
import { config } from '../config/index.js';

// Paths that must never reach log output (credentials, tokens, payment secrets).
const REDACTED_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
  '*.password',
  '*.newPassword',
  '*.currentPassword',
  '*.pin',
  '*.token',
  '*.accessToken',
  '*.refreshToken',
  '*.secret',
];

function buildTransport() {
  if (config.isProduction || config.isTest) return undefined;
  return {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:HH:MM:ss', ignore: 'pid,hostname' },
  };
}

export const logger = pino({
  level: config.isTest ? 'silent' : config.logLevel,
  redact: { paths: REDACTED_PATHS, censor: '[REDACTED]' },
  base: { service: 'lishechap-api' },
  transport: buildTransport(),
});
