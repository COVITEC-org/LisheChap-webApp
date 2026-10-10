import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFound.js';
import { requestLogger } from './middleware/requestLogger.js';
import {
  apiRateLimiter,
  corsMiddleware,
  rejectPrototypePollution,
  securityHeaders,
} from './middleware/security.js';
import { apiRouter } from './routes/index.js';
import { logger } from './utils/logger.js';

const BODY_SIZE_LIMIT = '100kb';
const CLIENT_BUILD_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');

function mountClientBuild(app) {
  if (!existsSync(CLIENT_BUILD_DIR)) {
    logger.warn({ dir: CLIENT_BUILD_DIR }, 'SERVE_CLIENT_BUILD is true but no client build was found');
    return;
  }

  app.use(express.static(CLIENT_BUILD_DIR, { index: false, maxAge: '1h' }));
  // Single-page app fallback for client-side routes (anything that is not /api).
  app.get(/^\/(?!api(?:\/|$)).*/, (_req, res) => {
    res.sendFile(path.join(CLIENT_BUILD_DIR, 'index.html'));
  });
}

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy);

  app.use(requestLogger);
  app.use(securityHeaders);
  app.use(corsMiddleware);
  app.use(compression());
  app.use(express.json({ limit: BODY_SIZE_LIMIT }));
  app.use(express.urlencoded({ extended: false, limit: BODY_SIZE_LIMIT }));
  app.use(cookieParser());
  app.use(rejectPrototypePollution);

  app.use('/api', apiRateLimiter, apiRouter);

  if (config.serveClientBuild) mountClientBuild(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
