import { PrismaClient } from '@prisma/client';
import { config } from '../config/index.js';

// Single shared client per process. Prisma manages its own connection pool.
export const prisma = new PrismaClient({
  log: config.isProduction ? ['error'] : ['warn', 'error'],
});
