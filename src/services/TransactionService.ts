import { Transaction } from '../types';
import { TransactionModel } from '../models/Transaction';
import { BankAccountService } from './BankAccountService';
import { QRCodeService } from './QRCodeService';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class TransactionService {
  private bankAccountService: BankAccountService;
  private qrCodeService: QRCodeService;

  constructor() {
    this.bankAccountService = new BankAccountService();
    this.qrCodeService = new QRCodeService();
  }

  async createTransaction(data: {
    amount: number;
    clientId: string;
    metadata?: any;
  }): Promise<Transaction> {
    const account = await this.bankAccountService.getAvailableAccount(data.amount);
    if (!account) {
      throw new AppError(503, 'No available bank accounts');
    }

    const qrCode = await this.qrCodeService.generateQRCode({
      upiId: account.upiId,
      amount: data.amount
    });

    const transaction = await TransactionModel.create({
      clientId: data.clientId,
      accountId: account.id,
      amount: data.amount,
      status: 'pending',
      paymentDetails: {
        upiId: account.upiId,
        qrCode
      },
      metadata: data.metadata,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    });

    logger.info('Transaction created', { transactionId: transaction.id });
    return transaction;
  }

  async getTransaction(id: string, clientId: string): Promise<Transaction | null> {
    return TransactionModel.findOne({ _id: id, clientId });
  }

  async listTransactions(params: {
    clientId: string;
    page: number;
    limit: number;
    status?: string;
  }): Promise<{ transactions: Transaction[]; total: number }> {
    const query: any = { clientId: params.clientId };
    if (params.status) {
      query.status = params.status;
    }

    const [transactions, total] = await Promise.all([
      TransactionModel.find(query)
        .sort({ createdAt: -1 })
        .skip((params.page - 1) * params.limit)
        .limit(params.limit),
      TransactionModel.countDocuments(query)
    ]);

    return { transactions, total };
  }
}