import { Request, Response, NextFunction } from 'express';
import { BankAccountService } from '../../services/BankAccountService';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';

export class BankAccountController {
  private service: BankAccountService;

  constructor() {
    this.service = new BankAccountService();
  }

  createBankAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bankAccount = await this.service.createBankAccount(req.body);
      res.status(201).json(bankAccount);
    } catch (error) {
      next(error);
    }
  };

  getBankAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const bankAccount = await this.service.getBankAccount(id);
      
      if (!bankAccount) {
        throw new AppError(404, 'Bank account not found');
      }

      res.json(bankAccount);
    } catch (error) {
      next(error);
    }
  };

  updateBankAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const bankAccount = await this.service.updateBankAccount(id, req.body);
      
      if (!bankAccount) {
        throw new AppError(404, 'Bank account not found');
      }

      res.json(bankAccount);
    } catch (error) {
      next(error);
    }
  };

  listBankAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const accounts = await this.service.listBankAccounts({
        page: Number(page),
        limit: Number(limit),
        status: status as string
      });

      res.json(accounts);
    } catch (error) {
      next(error);
    }
  };

  updateAccountStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const bankAccount = await this.service.updateAccountStatus(id, status);
      if (!bankAccount) {
        throw new AppError(404, 'Bank account not found');
      }

      res.json(bankAccount);
    } catch (error) {
      next(error);
    }
  };
}