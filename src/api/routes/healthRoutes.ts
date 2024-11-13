import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';

export const setupHealthRoutes = () => {
  const router = Router();
  const controller = new HealthController();

  router.get('/health', controller.check);
  router.get('/health/detailed', controller.detailed);

  return router;
};