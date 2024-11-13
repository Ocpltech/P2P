import dotenv from 'dotenv';
import { z } from 'zod';
import logger from '../utils/logger';

dotenv.config();

const envSchema = z
  .object({
    PORT: z.string().default('3000'),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    JWT_SECRET: z
      .string()
      .default('your-secure-32-character-jwt-secret-key-here'),
    RATE_LIMIT_MAX: z.string().default('100'),
    RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
    MAX_PAYLOAD_SIZE: z.string().default('10mb'),
    ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  })
  .transform((env) => ({
    port: parseInt(env.PORT, 10),
    environment: env.NODE_ENV,
    jwtSecret: env.JWT_SECRET,
    rateLimits: {
      windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
      max: parseInt(env.RATE_LIMIT_MAX, 10),
    },
    maxPayloadSize: env.MAX_PAYLOAD_SIZE,
    allowedOrigins: env.ALLOWED_ORIGINS.split(','),
  }));

// Parse environment variables
let env;
try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    logger.error('Invalid environment variables:', error.format());
    process.exit(1);
  }
  throw error;
}

// Define and export config object
export const config = {
  ...env,
  isDevelopment: env.environment === 'development',
  isProduction: env.environment === 'production',
  isTest: env.environment === 'test',
};

// Export the Config type for type-checking
export type Config = typeof config;
export default config;
