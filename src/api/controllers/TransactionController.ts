import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../../services/TransactionService';
import { AppError } from '../../middleware/errorHandler';
import logger from '../../utils/logger';

export class TransactionController {
  private service: TransactionService;

  constructor() {
    this.service = new TransactionService();
  }

  createTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { amount, metadata } = req.body;
      const clientId = req.client.id;

      const transaction = await this.service.createTransaction({
        amount,
        clientId,
        metadata,
      });

      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  };

  getTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const clientId = req.client.id;

      const transaction = await this.service.getTransaction(id, clientId);
      if (!transaction) {
        throw new AppError(404, 'Transaction not found');
      }

      res.json(transaction);
    } catch (error) {
      next(error);
    }
  };

  listTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clientId = req.client.id;
      const { page = 1, limit = 10, status } = req.query;

      const transactions = await this.service.listTransactions({
        clientId,
        page: Number(page),
        limit: Number(limit),
        status: status as string,
      });

      res.json(transactions);
    } catch (error) {
      next(error);
    }
  };
}
