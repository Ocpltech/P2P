import { CronJob } from 'cron';
import { TransactionModel } from '../models/Transaction';
import { WebhookService } from '../services/WebhookService';
import { logger } from '../utils/logger';

const webhookService = new WebhookService();

const processExpiredTransactions = async () => {
  try {
    const expiredTransactions = await TransactionModel.find({
      status: 'pending',
      expiresAt: { $lt: new Date() }
    });

    for (const transaction of expiredTransactions) {
      await TransactionModel.updateOne(
        { _id: transaction.id },
        { 
          $set: { 
            status: 'failed',
            metadata: {
              ...transaction.metadata,
              failureReason: 'Transaction expired'
            }
          }
        }
      );

      await webhookService.notifyPaymentFailure(
        transaction,
        'Transaction expired'
      );

      logger.info('Marked transaction as expired', {
        transactionId: transaction.id
      });
    }
  } catch (error) {
    logger.error('Error processing expired transactions:', error);
  }
};

// Run every 5 minutes
export const startExpiryJob = () => {
  const job = new CronJob('*/5 * * * *', processExpiredTransactions);
  job.start();
  logger.info('Transaction expiry job scheduled');
};