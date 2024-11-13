import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../../middleware/errorHandler';

const clientSchema = z.object({
  name: z.string().min(1),
  webhookUrl: z.string().url().optional(),
  ipWhitelist: z.array(z.string().ip()).optional(),
  status: z.enum(['active', 'suspended']).optional(),
  limits: z.object({
    dailyLimit: z.number().positive(),
    monthlyLimit: z.number().positive(),
    perTransactionLimit: z.number().positive()
  })
});

const statusUpdateSchema = z.object({
  status: z.enum(['active', 'suspended'])
});

export const validateClient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = clientSchema.parse(req.body);
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