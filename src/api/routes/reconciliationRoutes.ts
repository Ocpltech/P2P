import { Router } from 'express';
import { ReconciliationController } from '../controllers/ReconciliationController';
import { authenticate } from '../middleware/authenticate';
import { rateLimiterMiddleware } from '../middleware/rateLimiter';

export const setupReconciliationRoutes = () => {
  const router = Router();
  const controller = new ReconciliationController();

  router.post('/reconcile', authenticate, rateLimiterMiddleware, controller.reconcileTransactions);
  router.get('/status', authenticate, rateLimiterMiddleware, controller.getReconciliationStatus);

  return router;
};