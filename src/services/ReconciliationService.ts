import { Transaction } from '../types';
import { TransactionModel } from '../models/Transaction';
import { BankAccountModel } from '../models/BankAccount';
import { WebhookService } from './WebhookService';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

export class ReconciliationService {
  private webhookService: WebhookService;
  private readonly reconciliationWindow = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.webhookService = new WebhookService();
  }

  async reconcileTransactions(): Promise<{
    reconciled: number;
    failed: number;
    pending: number;
  }> {
    const cutoffTime = new Date(Date.now() - this.reconciliationWindow);
    
    const [expiredTransactions, stuckTransactions] = await Promise.all([
      this.findExpiredTransactions(cutoffTime),
      this.findStuckTransactions(cutoffTime)
    ]);

    const results = {
      reconciled: 0,
      failed: 0,
      pending: expiredTransactions.length + stuckTransactions.length
    };

    // Handle expired transactions
    for (const transaction of expiredTransactions) {
      try {
        await this.markTransactionFailed(transaction, 'Transaction expired');
        results.failed++;
      } catch (error) {
        logger.error('Failed to process expired transaction', {
          transactionId: transaction.id,
          error
        });
      }
    }

    // Handle stuck transactions
    for (const transaction of stuckTransactions) {
      try {
        const isReconciled = await this.reconcileTransaction(transaction);
        if (isReconciled) {
          results.reconciled++;
        } else {
          results.failed++;
        }
      } catch (error) {
        logger.error('Failed to reconcile transaction', {
          transactionId: transaction.id,
          error
        });
      }
    }

    return results;
  }

  private async findExpiredTransactions(cutoffTime: Date): Promise<Transaction[]> {
    return TransactionModel.find({
      status: 'pending',
      expiresAt: { $lt: new Date() },
      createdAt: { $gt: cutoffTime }
    });
  }

  private async findStuckTransactions(cutoffTime: Date): Promise<Transaction[]> {
    return TransactionModel.find({
      status: 'processing',
      updatedAt: { $lt: cutoffTime }
    });
  }

  private async reconcileTransaction(transaction: Transaction): Promise<boolean> {
    const bankAccount = await BankAccountModel.findById(transaction.accountId);
    if (!bankAccount) {
      await this.markTransactionFailed(transaction, 'Bank account not found');
      return false;
    }

    // Check if the transaction amount matches the bank's records
    const isValid = await this.validateBankTransaction(transaction, bankAccount);
    if (!isValid) {
      await this.markTransactionFailed(transaction, 'Transaction validation failed');
      return false;
    }

    // Mark as completed if validation passes
    await TransactionModel.updateOne(
      { _id: transaction.id },
      {
        $set: {
          status: 'completed',
          updatedAt: new Date()
        }
      }
    );

    await this.webhookService.notifyPaymentSuccess(transaction);
    logger.info('Transaction reconciled successfully', {
      transactionId: transaction.id
    });

    return true;
  }

  private async validateBankTransaction(
    transaction: Transaction,
    bankAccount: any
  ): Promise<boolean> {
    // Implement bank-specific validation logic here
    // This could involve checking bank statements, API calls, etc.
    try {
      // Example validation (replace with actual bank API integration)
      const transactionExists = await this.checkBankTransactionExists(
        transaction,
        bankAccount
      );

      if (!transactionExists) {
        logger.warn('Transaction not found in bank records', {
          transactionId: transaction.id,
          bankAccount: bankAccount.id
        });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Bank validation failed', {
        transactionId: transaction.id,
        error
      });
      return false;
    }
  }

  private async checkBankTransactionExists(
    transaction: Transaction,
    bankAccount: any
  ): Promise<boolean> {
    // Implement actual bank API integration here
    // This is a placeholder implementation
    return true;
  }

  private async markTransactionFailed(
    transaction: Transaction,
    reason: string
  ): Promise<void> {
    await TransactionModel.updateOne(
      { _id: transaction.id },
      {
        $set: {
          status: 'failed',
          metadata: {
            ...transaction.metadata,
            failureReason: reason,
            reconciledAt: new Date()
          }
        }
      }
    );

    await this.webhookService.notifyPaymentFailure(transaction, reason);
    logger.info('Transaction marked as failed', {
      transactionId: transaction.id,
      reason
    });
  }
}