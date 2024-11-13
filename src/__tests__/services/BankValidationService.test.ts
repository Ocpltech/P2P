import { BankValidationService } from '../../services/BankValidationService';

describe('BankValidationService', () => {
  let service: BankValidationService;

  beforeEach(() => {
    service = new BankValidationService();
  });

  describe('validateBankAccount', () => {
    it('should validate HDFC bank account correctly', () => {
      const result = service.validateBankAccount({
        bankCode: 'HDFC',
        accountNumber: '12345678901',
        ifscCode: 'HDFC0001234',
        upiId: 'merchant@hdfcbank'
      });

      expect(result.isValid).toBe(true);
      expect(result.details?.ifscValid).toBe(true);
      expect(result.details?.accountNumberValid).toBe(true);
      expect(result.details?.upiIdValid).toBe(true);
    });

    it('should reject invalid bank code', () => {
      const result = service.validateBankAccount({
        bankCode: 'INVALID',
        accountNumber: '12345678901',
        ifscCode: 'HDFC0001234',
        upiId: 'merchant@hdfcbank'
      });

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Invalid bank code');
    });
  });

  describe('validateSMSSender', () => {
    it('should identify HDFC bank sender', () => {
      const result = service.validateSMSSender('HDFCBK');
      expect(result).toBe('HDFC');
    });

    it('should return null for unknown sender', () => {
      const result = service.validateSMSSender('UNKNOWN');
      expect(result).toBe(null);
    });
  });

  describe('parseSMSAmount', () => {
    it('should parse HDFC bank SMS amount', () => {
      const message = 'INR 1,000.00 credited to A/c XX1234';
      const result = service.parseSMSAmount(message, 'HDFC');
      expect(result).toBe(1000.00);
    });

    it('should return null for invalid message format', () => {
      const message = 'Invalid message format';
      const result = service.parseSMSAmount(message, 'HDFC');
      expect(result).toBe(null);
    });
  });
});