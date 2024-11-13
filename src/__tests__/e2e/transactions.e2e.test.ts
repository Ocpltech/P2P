import request from 'supertest';
import { app } from '../../server';
import { TransactionModel } from '../../models/Transaction';
import { ClientModel } from '../../models/Client';

describe('Transaction API', () => {
  let validApiKey: string;

  beforeAll(async () => {
    const client = await ClientModel.create({
      name: 'Test Client',
      apiKey: 'test_api_key',
      secretKey: 'test_secret',
      status: 'active',
      limits: {
        dailyLimit: 10000,
        monthlyLimit: 100000,
        perTransactionLimit: 1000
      }
    });
    validApiKey = client.apiKey;
  });

  describe('POST /api/v1/transactions', () => {
    it('should create a new transaction', async () => {
      const response = await request(app)
        .post('/api/v1/transactions')
        .set('x-api-key', validApiKey)
        .send({
          amount: 1000,
          metadata: { orderId: '12345' }
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toBe(1000);
      expect(response.body.status).toBe('pending');
    });

    it('should return 401 for invalid API key', async () => {
      const response = await request(app)
        .post('/api/v1/transactions')
        .set('x-api-key', 'invalid_key')
        .send({
          amount: 1000
        });

      expect(response.status).toBe(401);
    });
  });
});