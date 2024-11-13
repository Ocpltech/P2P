import { Router } from 'express';
import { WebhookController } from '../controllers/WebhookController';
import { validateSMSWebhook } from '../validators/webhookValidator';

export const setupWebhookRoutes = () => {
  const router = Router();
  const controller = new WebhookController();

  router.post('/sms', validateSMSWebhook, controller.handleSMSWebhook);

  return router;
};