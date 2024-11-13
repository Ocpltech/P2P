import { Client } from '../types';
import { ClientModel } from '../models/Client';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import crypto from 'crypto';

export class ClientService {
  async createClient(data: Partial<Client>): Promise<Client> {
    const apiKey = this.generateApiKey();
    const secretKey = this.generateSecretKey();

    const client = await ClientModel.create({
      ...data,
      apiKey,
      secretKey,
      status: 'active'
    });

    logger.info('Client created', { clientId: client.id });
    return client;
  }

  async getClient(id: string): Promise<Client | null> {
    return ClientModel.findById(id);
  }

  async updateClient(id: string, data: Partial<Client>): Promise<Client | null> {
    const client = await ClientModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    if (client) {
      logger.info('Client updated', { clientId: id });
    }

    return client;
  }

  async listClients(params: {
    page: number;
    limit: number;
    status?: string;
  }): Promise<{ clients: Client[]; total: number }> {
    const query: any = {};
    if (params.status) {
      query.status = params.status;
    }

    const [clients, total] = await Promise.all([
      ClientModel.find(query)
        .sort({ createdAt: -1 })
        .skip((params.page - 1) * params.limit)
        .limit(params.limit),
      ClientModel.countDocuments(query)
    ]);

    return { clients, total };
  }

  async updateClientStatus(id: string, status: string): Promise<Client | null> {
    const client = await ClientModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (client) {
      logger.info('Client status updated', { clientId: id, status });
    }

    return client;
  }

  private generateApiKey(): string {
    return `pk_${crypto.randomBytes(24).toString('hex')}`;
  }

  private generateSecretKey(): string {
    return `sk_${crypto.randomBytes(32).toString('hex')}`;
  }
}