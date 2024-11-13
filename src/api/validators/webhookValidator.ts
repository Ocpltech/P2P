import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../../middleware/errorHandler';

const smsWebhookSchema = z.object({
  message: z.string().min(1),
  sender: z.string().min(1),
  receivedAt: z.string().datetime()
});

export const validateSMSWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = smsWebhookSchema.parse(req.body);
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