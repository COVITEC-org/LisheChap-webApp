import { z } from 'zod';

const MIN_PRODUCTION_SECRET_LENGTH = 32;

const optionalString = z
  .string()
  .optional()
  .transform((value) => (value && value.trim() !== '' ? value.trim() : undefined));

const booleanString = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true');

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(4000),
    HOST: z.string().default('0.0.0.0'),
    CLIENT_URL: z.string().default('http://localhost:5173'),
    SERVER_URL: z.string().url().default('http://localhost:4000'),
    TRUST_PROXY: z.coerce.number().int().min(0).default(0),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
    SERVE_CLIENT_BUILD: booleanString,
    DATABASE_URL: z
      .string({ required_error: 'DATABASE_URL is required' })
      .min(1, 'DATABASE_URL is required'),
    JWT_SECRET: optionalString,
    SESSION_SECRET: optionalString,
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
    REDIS_URL: optionalString,
  })
  .superRefine((env, ctx) => {
    const origins = env.CLIENT_URL.split(',').map((origin) => origin.trim());
    for (const origin of origins) {
      if (!z.string().url().safeParse(origin).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['CLIENT_URL'],
          message: `Invalid origin URL: ${origin}`,
        });
      }
    }

    if (env.NODE_ENV !== 'production') return;

    for (const key of ['JWT_SECRET', 'SESSION_SECRET']) {
      if (!env[key] || env[key].length < MIN_PRODUCTION_SECRET_LENGTH) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: `${key} must be at least ${MIN_PRODUCTION_SECRET_LENGTH} characters in production`,
        });
      }
    }
  });

/**
 * Validates environment variables and returns a frozen, typed config object.
 * Throws a readable error listing every invalid variable (values are never printed).
 */
export function loadEnv(source = process.env) {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${problems}`);
  }

  const env = result.data;

  return Object.freeze({
    nodeEnv: env.NODE_ENV,
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
    port: env.PORT,
    host: env.HOST,
    clientOrigins: Object.freeze(env.CLIENT_URL.split(',').map((origin) => origin.trim())),
    serverUrl: env.SERVER_URL,
    trustProxy: env.TRUST_PROXY,
    logLevel: env.LOG_LEVEL,
    serveClientBuild: env.SERVE_CLIENT_BUILD,
    databaseUrl: env.DATABASE_URL,
    jwtSecret: env.JWT_SECRET,
    sessionSecret: env.SESSION_SECRET,
    rateLimit: Object.freeze({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
    }),
    redisUrl: env.REDIS_URL,
  });
}
