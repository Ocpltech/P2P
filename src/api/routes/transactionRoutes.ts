import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { authenticate } from '../middleware/authenticate';
import { rateLimiterMiddleware } from '../middleware/rateLimiter';
import { validateTransaction } from '../validators/transactionValidator';

export const setupTransactionRoutes = () => {
  const router = Router();
  const controller = new TransactionController();

  router.post('/', authenticate, rateLimiterMiddleware, validateTransaction, controller.createTransaction);
  router.get('/:id', authenticate, rateLimiterMiddleware, controller.getTransaction);
  router.get('/', authenticate, rateLimiterMiddleware, controller.listTransactions);

  return router;
};