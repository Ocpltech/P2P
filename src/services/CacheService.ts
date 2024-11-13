import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';

export class CacheService {
  private redis: Redis;
  private readonly defaultTTL = 3600; // 1 hour
  private isConnected = false;

  constructor() {
    this.redis = new Redis(config.redisUrl, {
      retryStrategy: (times) => {
        if (times > 3) {
          logger.error('Redis max retries reached');
          return null;
        }
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      connectTimeout: 10000,
      disconnectTimeout: 2000,
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      }
    });

    this.redis.on('error', (error) => {
      this.isConnected = false;
      logger.error('Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      this.isConnected = true;
      logger.info('Connected to Redis');
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) {
      logger.warn('Redis not connected, skipping cache get');
      return null;
    }

    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl = this.defaultTTL): Promise<void> {
    if (!this.isConnected) {
      logger.warn('Redis not connected, skipping cache set');
      return;
    }

    try {
      await this.redis.set(
        key,
        JSON.stringify(value),
        'EX',
        ttl
      );
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected) {
      logger.warn('Redis not connected, skipping cache delete');
      return;
    }

    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  }

  async clearPattern(pattern: string): Promise<void> {
    if (!this.isConnected) {
      logger.warn('Redis not connected, skipping cache clear pattern');
      return;
    }

    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      logger.error('Cache clear pattern error:', error);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return false;
    }
  }
}