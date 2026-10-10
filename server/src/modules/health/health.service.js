import { prisma } from '../../lib/prisma.js';

const DATABASE_CHECK_TIMEOUT_MS = 2000;

function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database health check timed out')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function checkDatabase() {
  const startedAt = Date.now();
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, DATABASE_CHECK_TIMEOUT_MS);
    return { status: 'up', latencyMs: Date.now() - startedAt };
  } catch {
    // The failure reason is intentionally not exposed; it can contain connection details.
    return { status: 'down' };
  }
}

export async function getHealth() {
  const database = await checkDatabase();

  return {
    status: database.status === 'up' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    services: {
      api: { status: 'up' },
      database,
    },
  };
}
