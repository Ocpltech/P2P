import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CacheService } from '../../services/CacheService';

export class HealthController {
  private cacheService: CacheService;

  constructor() {
    this.cacheService = new CacheService();
  }

  check = async (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  };

  detailed = async (_req: Request, res: Response) => {
    const mongoStatus = mongoose.connection.readyState === 1;
    const redisStatus = await this.cacheService.healthCheck();

    res.json({
      status: mongoStatus && redisStatus ? 'ok' : 'degraded',
      services: {
        mongodb: mongoStatus ? 'healthy' : 'unhealthy',
        redis: redisStatus ? 'healthy' : 'unhealthy'
      },
      timestamp: new Date().toISOString()
    });
  };
}