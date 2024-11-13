import { Router } from 'express';
import { BankAccountController } from '../controllers/BankAccountController';
import { authenticate } from '../middleware/authenticate';
import { rateLimiterMiddleware } from '../middleware/rateLimiter';
import { validateBankAccount } from '../validators/bankAccountValidator';

export const setupBankAccountRoutes = () => {
  const router = Router();
  const controller = new BankAccountController();

  router.post('/', authenticate, rateLimiterMiddleware, validateBankAccount, controller.createBankAccount);
  router.get('/:id', authenticate, rateLimiterMiddleware, controller.getBankAccount);
  router.put('/:id', authenticate, rateLimiterMiddleware, validateBankAccount, controller.updateBankAccount);
  router.get('/', authenticate, rateLimiterMiddleware, controller.listBankAccounts);
  router.patch('/:id/status', authenticate, rateLimiterMiddleware, controller.updateAccountStatus);

  return router;
};