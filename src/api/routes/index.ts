import { Express } from 'express';
import { setupTransactionRoutes } from './transactionRoutes';
import { setupClientRoutes } from './clientRoutes';
import { setupBankAccountRoutes } from './bankAccountRoutes';
import { setupWebhookRoutes } from './webhookRoutes';
import { setupAnalyticsRoutes } from './analyticsRoutes';
import { setupReconciliationRoutes } from './reconciliationRoutes';

export const setupRoutes = (app: Express) => {
  app.use('/api/v1/transactions', setupTransactionRoutes());
  app.use('/api/v1/clients', setupClientRoutes());
  app.use('/api/v1/bank-accounts', setupBankAccountRoutes());
  app.use('/api/v1/analytics', setupAnalyticsRoutes());
  app.use('/api/v1/reconciliation', setupReconciliationRoutes());
  app.use('/webhook', setupWebhookRoutes());
};