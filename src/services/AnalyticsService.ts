import { TransactionModel } from '../models/Transaction';
import { BankAccountModel } from '../models/BankAccount';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class AnalyticsService {
  async getTransactionsSummary(
    clientId: string,
    startDate: string,
    endDate: string
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const summary = await TransactionModel.aggregate([
      {
        $match: {
          clientId,
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    return summary;
  }

  async getTransactionVolume(clientId: string, period: string) {
    const groupByPeriod = this.getGroupByPeriod(period);

    const volume = await TransactionModel.aggregate([
      {
        $match: {
          clientId,
          status: 'completed'
        }
      },
      {
        $group: {
          _id: groupByPeriod,
          volume: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    return volume;
  }

  async getSuccessRate(clientId: string, startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const stats = await TransactionModel.aggregate([
      {
        $match: {
          clientId,
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          successful: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return { successRate: 0 };
    }

    const { total, successful } = stats[0];
    return {
      successRate: (successful / total) * 100,
      total,
      successful
    };
  }

  async getBankPerformance(clientId: string, period: string) {
    const groupByPeriod = this.getGroupByPeriod(period);

    const performance = await TransactionModel.aggregate([
      {
        $match: {
          clientId,
          status: 'completed'
        }
      },
      {
        $lookup: {
          from: 'bankaccounts',
          localField: 'accountId',
          foreignField: '_id',
          as: 'bankAccount'
        }
      },
      {
        $unwind: '$bankAccount'
      },
      {
        $group: {
          _id: {
            period: groupByPeriod,
            bankName: '$bankAccount.bankName'
          },
          successCount: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          avgProcessingTime: {
            $avg: {
              $subtract: ['$updatedAt', '$createdAt']
            }
          }
        }
      },
      {
        $sort: { '_id.period': 1 }
      }
    ]);

    return performance;
  }

  private getGroupByPeriod(period: string) {
    switch (period) {
      case 'hourly':
        return {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
          hour: { $hour: '$createdAt' }
        };
      case 'daily':
        return {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
      case 'monthly':
        return {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
      default:
        throw new AppError(400, 'Invalid period specified');
    }
  }
}