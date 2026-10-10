import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { AppError } from '../src/utils/AppError.js';

function mockResponse() {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
}

function run(err) {
  const req = { log: { error: vi.fn() } };
  const res = mockResponse();
  errorHandler(err, req, res, () => {});
  return { req, res, body: res.json.mock.calls[0][0], status: res.status.mock.calls[0][0] };
}

describe('errorHandler', () => {
  it('returns operational errors with their status and code', () => {
    const { status, body } = run(AppError.forbidden());

    expect(status).toBe(403);
    expect(body).toEqual({
      success: false,
      error: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action' },
    });
  });

  it('hides internal error messages and stack traces', () => {
    const internal = new Error('relation "users" does not exist at /srv/app/src/db.js:12');
    const { status, body, req } = run(internal);

    expect(status).toBe(500);
    expect(body.error.code).toBe('INTERNAL_ERROR');
    expect(JSON.stringify(body)).not.toContain('relation');
    expect(JSON.stringify(body)).not.toContain('db.js');
    expect(body.error).not.toHaveProperty('stack');
    expect(req.log.error).toHaveBeenCalled();
  });

  it('maps validation errors to 422 with field paths', () => {
    const result = z.object({ phone: z.string().min(10) }).safeParse({ phone: '123' });
    const { status, body } = run(result.error);

    expect(status).toBe(422);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.details[0].path).toBe('phone');
  });
});
