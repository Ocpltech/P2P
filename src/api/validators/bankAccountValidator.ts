import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../../middleware/errorHandler';

const bankAccountSchema = z.object({
  bankName: z.string().min(1),
  accountNumber: z.string().min(1),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/),
  upiId: z.string().email(),
  accountHolder: z.string().min(1),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  dailyLimit: z.number().positive(),
  monthlyLimit: z.number().positive()
});

const statusUpdateSchema = z.object({
  status: z.enum(['active', 'inactive', 'suspended'])
});

export const validateBankAccount = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = bankAccountSchema.parse(req.body);
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

export const validateStatusUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = statusUpdateSchema.parse(req.body);
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