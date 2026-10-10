import { describe, expect, it } from 'vitest';
import { loadEnv } from '../src/config/env.js';

const BASE_ENV = {
  NODE_ENV: 'development',
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
};

describe('loadEnv', () => {
  it('applies safe defaults for development', () => {
    const config = loadEnv(BASE_ENV);

    expect(config.port).toBe(4000);
    expect(config.clientOrigins).toEqual(['http://localhost:5173']);
    expect(config.isProduction).toBe(false);
    expect(config.serveClientBuild).toBe(false);
    expect(config.redisUrl).toBeUndefined();
  });

  it('requires DATABASE_URL', () => {
    expect(() => loadEnv({ NODE_ENV: 'development' })).toThrow(/DATABASE_URL/);
  });

  it('parses a comma-separated list of client origins', () => {
    const config = loadEnv({ ...BASE_ENV, CLIENT_URL: 'http://localhost:5173, https://lishechap.co.tz' });
    expect(config.clientOrigins).toEqual(['http://localhost:5173', 'https://lishechap.co.tz']);
  });

  it('rejects invalid client origins', () => {
    expect(() => loadEnv({ ...BASE_ENV, CLIENT_URL: 'not-a-url' })).toThrow(/CLIENT_URL/);
  });

  it('requires strong secrets in production', () => {
    expect(() => loadEnv({ ...BASE_ENV, NODE_ENV: 'production', JWT_SECRET: 'short' })).toThrow(
      /JWT_SECRET[\s\S]*SESSION_SECRET/,
    );
  });

  it('accepts production config with strong secrets', () => {
    const secret = 'x'.repeat(48);
    const config = loadEnv({ ...BASE_ENV, NODE_ENV: 'production', JWT_SECRET: secret, SESSION_SECRET: secret });
    expect(config.isProduction).toBe(true);
  });

  it('never includes secret values in validation errors', () => {
    const leakedValue = 'super-secret-database-password';
    expect(() =>
      loadEnv({ ...BASE_ENV, DATABASE_URL: `postgresql://u:${leakedValue}@h/db`, PORT: 'abc' }),
    ).toThrow(expect.objectContaining({ message: expect.not.stringContaining(leakedValue) }));
  });
});
