import { BankAccount } from '../types';
import { BankAccountModel } from '../models/BankAccount';
import { logger } from '../utils/logger';

export class BankAccountService {
  async getAvailableAccount(amount: number): Promise<BankAccount | null> {
    const account = await BankAccountModel.findOne({
      status: 'active',
      currentDailyVolume: { $lte: { $subtract: ['$dailyLimit', amount] } },
      currentMonthlyVolume: { $lte: { $subtract: ['$monthlyLimit', amount] } }
    });

    if (!account) {
      logger.warn('No available bank account found', { amount });
      return null;
    }

    return account;
  }

  async updateVolume(accountId: string, amount: number): Promise<void> {
    await BankAccountModel.updateOne(
      { _id: accountId },
      {
        $inc: {
          currentDailyVolume: amount,
          currentMonthlyVolume: amount
        }
      }
    );

    logger.info('Bank account volume updated', { accountId, amount });
  }
}