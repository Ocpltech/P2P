import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';
import { authenticate } from '../middleware/authenticate';
import { rateLimiterMiddleware } from '../middleware/rateLimiter';
import { validateClient } from '../validators/clientValidator';

export const setupClientRoutes = () => {
  const router = Router();
  const controller = new ClientController();

  router.post('/', authenticate, rateLimiterMiddleware, validateClient, controller.createClient);
  router.get('/:id', authenticate, rateLimiterMiddleware, controller.getClient);
  router.put('/:id', authenticate, rateLimiterMiddleware, validateClient, controller.updateClient);
  router.get('/', authenticate, rateLimiterMiddleware, controller.listClients);
  router.patch('/:id/status', authenticate, rateLimiterMiddleware, controller.updateClientStatus);

  return router;
};