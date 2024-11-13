import { TransactionService } from '../../services/TransactionService';
import { BankAccountService } from '../../services/BankAccountService';
import { QRCodeService } from '../../services/QRCodeService';
import { TransactionModel } from '../../models/Transaction';
import { AppError } from '../../middleware/errorHandler';

jest.mock('../../models/Transaction');
jest.mock('../../services/BankAccountService');
jest.mock('../../services/QRCodeService');

describe('TransactionService', () => {
  let service: TransactionService;
  let mockBankAccountService: jest.Mocked<BankAccountService>;
  let mockQRCodeService: jest.Mocked<QRCodeService>;

  beforeEach(() => {
    mockBankAccountService = new BankAccountService() as jest.Mocked<BankAccountService>;
    mockQRCodeService = new QRCodeService() as jest.Mocked<QRCodeService>;
    service = new TransactionService();
  });

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const mockAccount = {
        id: 'account123',
        upiId: 'test@upi'
      };

      const mockQRCode = 'data:image/png;base64,...';

      const mockTransaction = {
        id: 'trans123',
        amount: 1000,
        status: 'pending',
        paymentDetails: {
          upiId: mockAccount.upiId,
          qrCode: mockQRCode
        }
      };

      mockBankAccountService.getAvailableAccount.mockResolvedValue(mockAccount);
      mockQRCodeService.generateQRCode.mockResolvedValue(mockQRCode);
      (TransactionModel.create as jest.Mock).mockResolvedValue(mockTransaction);

      const result = await service.createTransaction({
        amount: 1000,
        clientId: 'client123'
      });

      expect(result).toEqual(mockTransaction);
      expect(TransactionModel.create).toHaveBeenCalled();
    });

    it('should throw error when no bank account is available', async () => {
      mockBankAccountService.getAvailableAccount.mockResolvedValue(null);

      await expect(
        service.createTransaction({
          amount: 1000,
          clientId: 'client123'
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe('getTransaction', () => {
    it('should retrieve a transaction', async () => {
      const mockTransaction = {
        id: 'trans123',
        amount: 1000,
        status: 'completed'
      };

      (TransactionModel.findOne as jest.Mock).mockResolvedValue(mockTransaction);

      const result = await service.getTransaction('trans123', 'client123');
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('listTransactions', () => {
    it('should list transactions with pagination', async () => {
      const mockTransactions = [
        { id: 'trans1', amount: 1000 },
        { id: 'trans2', amount: 2000 }
      ];

      (TransactionModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockTransactions)
          })
        })
      });

      (TransactionModel.countDocuments as jest.Mock).mockResolvedValue(2);

      const result = await service.listTransactions({
        clientId: 'client123',
        page: 1,
        limit: 10
      });

      expect(result.transactions).toEqual(mockTransactions);
      expect(result.total).toBe(2);
    });
  });
});