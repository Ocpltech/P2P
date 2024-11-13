import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../../services/AnalyticsService';
import { AppError } from '../../middleware/errorHandler';

export class AnalyticsController {
  private service: AnalyticsService;

  constructor() {
    this.service = new AnalyticsService();
  }

  getTransactionsSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const clientId = req.client.id;

      const summary = await this.service.getTransactionsSummary(
        clientId,
        startDate as string,
        endDate as string
      );

      res.json(summary);
    } catch (error) {
      next(error);
    }
  };

  getTransactionVolume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { period = 'daily' } = req.query;
      const clientId = req.client.id;

      const volume = await this.service.getTransactionVolume(
        clientId,
        period as string
      );

      res.json(volume);
    } catch (error) {
      next(error);
    }
  };

  getSuccessRate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const clientId = req.client.id;

      const successRate = await this.service.getSuccessRate(
        clientId,
        startDate as string,
        endDate as string
      );

      res.json(successRate);
    } catch (error) {
      next(error);
    }
  };

  getBankPerformance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { period = 'daily' } = req.query;
      const clientId = req.client.id;

      const performance = await this.service.getBankPerformance(
        clientId,
        period as string
      );

      res.json(performance);
    } catch (error) {
      next(error);
    }
  };
}