import client from 'prom-client';
import { Request, Response } from 'express';

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'payment-gateway'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

export const transactionCounter = new client.Counter({
  name: 'payment_transactions_total',
  help: 'Total number of payment transactions',
  labelNames: ['status']
});

export const transactionAmountGauge = new client.Gauge({
  name: 'payment_transaction_amount',
  help: 'Current transaction amount in processing'
});

export const bankAccountGauge = new client.Gauge({
  name: 'active_bank_accounts',
  help: 'Number of active bank accounts'
});

// Register custom metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(transactionCounter);
register.registerMetric(transactionAmountGauge);
register.registerMetric(bankAccountGauge);

// Metrics endpoint
export const metricsHandler = async (_req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};