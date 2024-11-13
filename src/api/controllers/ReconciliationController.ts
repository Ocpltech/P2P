import { Request, Response, NextFunction } from 'express';
import { ReconciliationService } from '../../services/ReconciliationService';
import { logger } from '../../utils/logger';

export class ReconciliationController {
  private service: ReconciliationService;

  constructor() {
    this.service = new ReconciliationService();
  }

  reconcileTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const results = await this.service.reconcileTransactions();
      
      logger.info('Reconciliation completed', results);
      res.json({
        success: true,
        results
      });
    } catch (error) {
      next(error);
    }
  };

  getReconciliationStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Implement status check logic here
      res.json({
        status: 'operational',
        lastRun: new Date(),
        nextScheduledRun: new Date(Date.now() + 3600000) // 1 hour from now
      });
    } catch (error) {
      next(error);
    }
  };
}