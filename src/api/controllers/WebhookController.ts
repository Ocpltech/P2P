import { Request, Response, NextFunction } from 'express';
import { SMSProcessor } from '../../services/SMSProcessor';
import { logger } from '../../utils/logger';

export class WebhookController {
  private smsProcessor: SMSProcessor;

  constructor() {
    this.smsProcessor = new SMSProcessor();
  }

  handleSMSWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message, sender, receivedAt } = req.body;

      const result = await this.smsProcessor.processSMS({
        message,
        sender,
        receivedAt
      });

      if (result) {
        logger.info('SMS processed successfully', {
          transactionId: result.id,
          status: result.status
        });
      }

      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}