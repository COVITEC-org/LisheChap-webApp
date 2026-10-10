import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/lib/prisma.js', () => ({
  prisma: { $queryRaw: vi.fn(), $disconnect: vi.fn() },
}));

const { prisma } = await import('../src/lib/prisma.js');
const { createApp } = await import('../src/app.js');

const app = createApp();

beforeEach(() => {
  vi.mocked(prisma.$queryRaw).mockReset();
});

describe('GET /api/health', () => {
  it('returns 200 and ok when the database is reachable', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '?column?': 1 }]);

    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.services.api.status).toBe('up');
    expect(res.body.data.services.database.status).toBe('up');
    expect(res.headers['cache-control']).toBe('no-store');
  });

  it('returns 503 and degraded without leaking details when the database is down', async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValue(
      new Error('connect ECONNREFUSED postgresql://user:secret@db:5432'),
    );

    const res = await request(app).get('/api/health');

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.data.status).toBe('degraded');
    expect(res.body.data.services.database).toEqual({ status: 'down' });
    expect(JSON.stringify(res.body)).not.toContain('secret');
  });
});

describe('error handling', () => {
  it('returns a consistent 404 envelope for unknown API routes', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Route not found: GET /api/does-not-exist' },
    });
  });

  it('rejects malformed JSON with 400', async () => {
    const res = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('{"broken":');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_JSON');
    expect(res.body.error).not.toHaveProperty('stack');
  });

  it('rejects oversized bodies with 413', async () => {
    const res = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ data: 'a'.repeat(150 * 1024) }));

    expect(res.status).toBe(413);
    expect(res.body.error.code).toBe('PAYLOAD_TOO_LARGE');
  });
});

describe('security middleware', () => {
  it('sets secure headers and hides the framework', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([]);

    const res = await request(app).get('/api/health');

    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['x-frame-options']).toBeDefined();
  });

  it('assigns a request id and echoes a valid incoming one', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([]);

    const generated = await request(app).get('/api/health');
    expect(generated.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);

    const echoed = await request(app).get('/api/health').set('X-Request-Id', 'client-req-12345');
    expect(echoed.headers['x-request-id']).toBe('client-req-12345');

    const rejected = await request(app).get('/api/health').set('X-Request-Id', '<script>alert(1)</script>');
    expect(rejected.headers['x-request-id']).not.toContain('<script>');
  });

  it('allows the configured client origin with credentials', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([]);

    const res = await request(app).get('/api/health').set('Origin', 'http://localhost:5173');

    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('blocks unknown origins', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'https://evil.example.com');

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('CORS_NOT_ALLOWED');
  });

  it('rejects prototype pollution payloads', async () => {
    const res = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('{"__proto__":{"role":"SUPER_ADMIN"}}');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('exposes rate limit headers on API routes', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([]);

    const res = await request(app).get('/api/health');

    expect(res.headers['ratelimit-policy']).toBeDefined();
  });
});
