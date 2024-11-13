import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { authenticate } from '../middleware/authenticate';
import { rateLimiterMiddleware } from '../middleware/rateLimiter';

export const setupAnalyticsRoutes = () => {
  const router = Router();
  const controller = new AnalyticsController();

  router.get('/transactions/summary', authenticate, rateLimiterMiddleware, controller.getTransactionsSummary);
  router.get('/transactions/volume', authenticate, rateLimiterMiddleware, controller.getTransactionVolume);
  router.get('/success-rate', authenticate, rateLimiterMiddleware, controller.getSuccessRate);
  router.get('/bank-performance', authenticate, rateLimiterMiddleware, controller.getBankPerformance);

  return router;
};