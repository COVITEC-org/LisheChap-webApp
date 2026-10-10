import { getHealth } from './health.service.js';

export async function healthCheck(_req, res) {
  const health = await getHealth();
  const statusCode = health.status === 'ok' ? 200 : 503;

  res.set('Cache-Control', 'no-store');
  return res.status(statusCode).json({ success: health.status === 'ok', data: health });
}
