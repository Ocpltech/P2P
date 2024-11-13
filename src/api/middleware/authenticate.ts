import { Request, Response, NextFunction } from 'express';
import { ClientModel } from '../../models/Client';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';

declare global {
  namespace Express {
    interface Request {
      client: any;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      throw new AppError(401, 'API key is required');
    }

    const client = await ClientModel.findOne({ apiKey, status: 'active' });
    if (!client) {
      throw new AppError(401, 'Invalid API key');
    }

    // Validate IP whitelist if configured
    if (client.ipWhitelist?.length > 0) {
      const clientIp = req.ip;
      if (!client.ipWhitelist.includes(clientIp)) {
        logger.warn('IP not whitelisted', { clientIp, clientId: client.id });
        throw new AppError(403, 'IP not whitelisted');
      }
    }

    req.client = client;
    next();
  } catch (error) {
    next(error);
  }
};