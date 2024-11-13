import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { config } from '../config';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';

// Use in-memory rate limiter instead of Redis
const rateLimiter = new RateLimiterMemory({
  points: config.rateLimits.max,
  duration: config.rateLimits.windowMs / 1000,
  blockDuration: 900
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = `${req.ip}-${req.headers['x-api-key'] || 'anonymous'}`;
    await rateLimiter.consume(key);
    next();
  } catch (error) {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      apiKey: req.headers['x-api-key']
    });

    if (error.remainingPoints !== undefined) {
      res.set('Retry-After', String(error.msBeforeNext / 1000));
      res.set('X-RateLimit-Limit', String(config.rateLimits.max));
      res.set('X-RateLimit-Remaining', String(error.remainingPoints));
      res.set('X-RateLimit-Reset', String(new Date(Date.now() + error.msBeforeNext)));
    }

    next(new AppError(429, 'Too Many Requests'));
  }
};