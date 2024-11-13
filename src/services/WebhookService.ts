import axios from 'axios';
import { Transaction } from '../types';
import { ClientModel } from '../models/Client';
import { logger } from '../utils/logger';

export class WebhookService {
  private readonly maxRetries = 3;
  private readonly retryDelay = 5000; // 5 seconds

  async notifyPaymentSuccess(transaction: Transaction): Promise<void> {
    await this.sendWebhook(transaction, 'payment.success');
  }

  async notifyPaymentFailure(transaction: Transaction, reason: string): Promise<void> {
    await this.sendWebhook(transaction, 'payment.failed', { failureReason: reason });
  }

  private async sendWebhook(
    transaction: Transaction,
    event: string,
    additionalData: Record<string, any> = {}
  ): Promise<void> {
    const client = await ClientModel.findById(transaction.clientId);
    if (!client?.webhookUrl) {
      return;
    }

    const payload = {
      event,
      data: {
        transactionId: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
        timestamp: new Date(),
        metadata: transaction.metadata,
        ...additionalData
      }
    };

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await axios.post(client.webhookUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            'X-Signature': this.generateSignature(payload, client.secretKey)
          },
          timeout: 10000
        });

        if (response.status === 200) {
          logger.info('Webhook notification sent successfully', {
            transactionId: transaction.id,
            event,
            attempt
          });
          return;
        }
      } catch (error) {
        logger.error('Webhook notification failed', {
          transactionId: transaction.id,
          event,
          attempt,
          error: error.message
        });

        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }
  }

  private generateSignature(payload: any, secretKey: string): string {
    const crypto = require('crypto');
    const data = JSON.stringify(payload);
    return crypto
      .createHmac('sha256', secretKey)
      .update(data)
      .digest('hex');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}