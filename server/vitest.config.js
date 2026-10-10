import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/lishechap_test?schema=public',
      CLIENT_URL: 'http://localhost:5173',
      SERVER_URL: 'http://localhost:4000',
      RATE_LIMIT_MAX: '1000',
    },
  },
});
