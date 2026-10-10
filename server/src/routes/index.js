import { Router } from 'express';
import { healthRouter } from '../modules/health/health.routes.js';

// Mounts every feature module under /api. New modules register their router here.
export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
