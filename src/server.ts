import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectWithRetry from './database/connection';
import config from './config';
import { errorHandler } from './middleware/errorHandler';
import { setupRoutes } from './api/routes';
import { serve, setup } from './docs/swagger';
import { metricsHandler } from './metrics';
import { startExpiryJob } from './jobs/transactionExpiry';
import { rateLimiterMiddleware } from './middleware/rateLimiter';
import { sanitizeMiddleware } from './middleware/sanitize';
import { setupHealthRoutes } from './api/routes/healthRoutes';

export const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  })
);
app.use(express.json({ limit: config.maxPayloadSize }));
app.use(express.urlencoded({ extended: true, limit: config.maxPayloadSize }));

// Input sanitization
app.use(sanitizeMiddleware);

// Rate limiting
app.use(rateLimiterMiddleware);

// Health check routes (no auth required)
app.use('/api/v1', setupHealthRoutes());

// API Documentation
app.use('/api-docs', serve, setup);

// Metrics endpoint
app.get('/metrics', metricsHandler);

// API routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    await connectWithRetry();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      startExpiryJob();
    });
  };

  startServer().catch(console.error);
}
