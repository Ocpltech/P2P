import { Request, Response, NextFunction } from 'express';
import { ClientService } from '../../services/ClientService';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';

export class ClientController {
  private service: ClientService;

  constructor() {
    this.service = new ClientService();
  }

  createClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = await this.service.createClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  };

  getClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const client = await this.service.getClient(id);
      
      if (!client) {
        throw new AppError(404, 'Client not found');
      }

      res.json(client);
    } catch (error) {
      next(error);
    }
  };

  updateClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const client = await this.service.updateClient(id, req.body);
      
      if (!client) {
        throw new AppError(404, 'Client not found');
      }

      res.json(client);
    } catch (error) {
      next(error);
    }
  };

  listClients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const clients = await this.service.listClients({
        page: Number(page),
        limit: Number(limit),
        status: status as string
      });

      res.json(clients);
    } catch (error) {
      next(error);
    }
  };

  updateClientStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const client = await this.service.updateClientStatus(id, status);
      if (!client) {
        throw new AppError(404, 'Client not found');
      }

      res.json(client);
    } catch (error) {
      next(error);
    }
  };
}