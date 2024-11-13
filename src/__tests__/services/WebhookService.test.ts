import { WebhookService } from '../../services/WebhookService';
import { ClientModel } from '../../models/Client';
import axios from 'axios';

jest.mock('axios');
jest.mock('../../models/Client');

describe('WebhookService', () => {
  let service: WebhookService;

  beforeEach(() => {
    service = new WebhookService();
    jest.clearAllMocks();
  });

  describe('notifyPaymentSuccess', () => {
    it('should send success webhook notification', async () => {
      const mockTransaction = {
        id: 'trans123',
        clientId: 'client123',
        amount: 1000,
        status: 'completed'
      };

      const mockClient = {
        webhookUrl: 'https://example.com/webhook',
        secretKey: 'test-secret'
      };

      (ClientModel.findById as jest.Mock).mockResolvedValue(mockClient);
      (axios.post as jest.Mock).mockResolvedValue({ status: 200 });

      await service.notifyPaymentSuccess(mockTransaction);

      expect(axios.post).toHaveBeenCalledWith(
        mockClient.webhookUrl,
        expect.any(Object),
        expect.any(Object)
      );
    });

    it('should handle webhook failure and retry', async () => {
      const mockTransaction = {
        id: 'trans123',
        clientId: 'client123',
        amount: 1000,
        status: 'completed'
      };

      const mockClient = {
        webhookUrl: 'https://example.com/webhook',
        secretKey: 'test-secret'
      };

      (ClientModel.findById as jest.Mock).mockResolvedValue(mockClient);
      (axios.post as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ status: 200 });

      await service.notifyPaymentSuccess(mockTransaction);

      expect(axios.post).toHaveBeenCalledTimes(2);
    });
  });
});