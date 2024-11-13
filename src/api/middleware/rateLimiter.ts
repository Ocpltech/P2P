import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import { config } from '../../config';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';

const redisClient = new Redis(config.redisUrl);

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 100, // Number of points
  duration: 60, // Per 60 seconds
  blockDuration: 60 * 15 // Block for 15 minutes
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = req.ip;
    await rateLimiter.consume(key);
    next();
  } catch (error) {
    logger.warn('Rate limit exceeded', { ip: req.ip });
    next(new AppError(429, 'Too Many Requests'));
  }
};