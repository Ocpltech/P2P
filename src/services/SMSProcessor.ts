import { Transaction } from '../types';
import { TransactionModel } from '../models/Transaction';
import { BankAccountService } from './BankAccountService';
import { WebhookService } from './WebhookService';
import { logger } from '../utils/logger';

export class SMSProcessor {
  private bankPatterns = {
    // SBI Patterns
    SBI: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /received.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?(?:a\/c|acct).*?([X\d]+)/i,
      /UPI-CR.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i
    ],
    // HDFC Patterns
    HDFC: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*transferred.*?(?:a\/c|acct).*?([X\d]+)/i,
      /received.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*via\s+UPI/i,
      /UPI-CREDIT.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i,
      /Money Received.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i
    ],
    // ICICI Patterns
    ICICI: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*received.*?UPI/i,
      /UPI.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*credited/i,
      /UPI-CR.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i,
      /Money Received-UPI.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i
    ],
    // Axis Bank Patterns
    AXIS: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*received.*?UPI/i,
      /UPI.*?credit.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i,
      /UPI-CR.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i,
      /IMPS Credit.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i
    ],
    // Yes Bank Patterns
    YES: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*received.*?UPI/i,
      /UPI.*?transfer.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i,
      /UPI-CR.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i
    ],
    // Kotak Bank Patterns
    KOTAK: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*received.*?UPI/i,
      /UPI.*?credit.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i,
      /UPI-CR.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i,
      /Money Received via UPI.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i
    ],
    // PNB Patterns
    PNB: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*received.*?UPI/i,
      /UPI.*?credit.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i,
      /UPI-CR.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i
    ],
    // Bank of Baroda Patterns
    BOB: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*received.*?UPI/i,
      /UPI.*?credit.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i,
      /UPI-CR.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i
    ]
  };

  private bankSenders = {
    SBI: ['SBI', 'SBIUPI', 'SBIPAY', 'SBIINB'],
    HDFC: ['HDFC', 'HDFCBK', 'HDFCUPI', 'HDFCINB'],
    ICICI: ['ICICI', 'ICICIB', 'ICICIUPI', 'ICICINB'],
    AXIS: ['AXIS', 'AXISBK', 'AXISUPI', 'AXISINB'],
    YES: ['YES', 'YESBK', 'YESUPI', 'YESINB'],
    KOTAK: ['KOTAK', 'KOTAKB', 'KOTAKUPI', 'KOTAKINB'],
    PNB: ['PNB', 'PNBSMS', 'PNBUPI', 'PNBINB'],
    BOB: ['BOB', 'BOBSMS', 'BOBUPI', 'BOBINB']
  };

  private bankAccountService: BankAccountService;
  private webhookService: WebhookService;

  constructor() {
    this.bankAccountService = new BankAccountService();
    this.webhookService = new WebhookService();
  }

  async processSMS(sms: {
    message: string;
    sender: string;
    receivedAt: string;
  }): Promise<Transaction | null> {
    const bank = this.identifyBank(sms.sender);
    if (!bank) {
      logger.info('Unrecognized bank sender', { sender: sms.sender });
      return null;
    }

    const parsedData = this.parseSMS(sms.message, bank);
    if (!parsedData) {
      logger.info('SMS format not recognized', { bank, sender: sms.sender });
      return null;
    }

    const transaction = await this.findMatchingTransaction(parsedData.amount);
    if (!transaction) {
      logger.info('No matching transaction found', { amount: parsedData.amount });
      return null;
    }

    await this.updateTransaction(transaction, sms);
    await this.bankAccountService.updateVolume(transaction.accountId, transaction.amount);
    await this.webhookService.notifyPaymentSuccess(transaction);

    return transaction;
  }

  private identifyBank(sender: string): string | null {
    const normalizedSender = sender.toUpperCase();
    for (const [bank, senders] of Object.entries(this.bankSenders)) {
      if (senders.some(s => normalizedSender.includes(s))) {
        return bank;
      }
    }
    return null;
  }

  private parseSMS(message: string, bank: string): { amount: number } | null {
    const patterns = this.bankPatterns[bank];
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(amount) && amount > 0) {
          return { amount };
        }
      }
    }
    return null;
  }

  private async findMatchingTransaction(amount: number): Promise<Transaction | null> {
    return TransactionModel.findOne({
      amount,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });
  }

  private async updateTransaction(
    transaction: Transaction,
    sms: { message: string; sender: string; receivedAt: string }
  ): Promise<void> {
    await TransactionModel.updateOne(
      { _id: transaction.id },
      {
        $set: {
          status: 'completed',
          smsConfirmation: {
            message: sms.message,
            sender: sms.sender,
            receivedAt: new Date(sms.receivedAt)
          }
        }
      }
    );

    logger.info('Transaction completed', {
      transactionId: transaction.id,
      amount: transaction.amount
    });
  }
}