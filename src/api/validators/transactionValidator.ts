import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../../middleware/errorHandler';

const transactionSchema = z.object({
  amount: z.number().positive(),
  metadata: z.record(z.any()).optional()
});

export const validateTransaction = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = transactionSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(400, 'Validation error', error.errors));
    } else {
      next(error);
    }
  }
};