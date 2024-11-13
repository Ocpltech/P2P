import { Bank, BankValidationResult } from '../types/banks';
import { INDIAN_BANKS } from '../config/banks';
import { logger } from '../utils/logger';

export class BankValidationService {
  validateBankAccount(data: {
    bankCode: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
  }): BankValidationResult {
    const bank = INDIAN_BANKS[data.bankCode];
    if (!bank) {
      return {
        isValid: false,
        message: 'Invalid bank code'
      };
    }

    const ifscValid = this.validateIFSC(data.ifscCode, bank);
    const accountNumberValid = this.validateAccountNumber(data.accountNumber);
    const upiIdValid = this.validateUPIId(data.upiId, bank);

    const isValid = ifscValid && accountNumberValid && upiIdValid;

    return {
      isValid,
      details: {
        ifscValid,
        accountNumberValid,
        upiIdValid
      },
      message: isValid ? 'Valid bank account' : 'Invalid bank account details'
    };
  }

  private validateIFSC(ifsc: string, bank: Bank): boolean {
    const ifscRegex = new RegExp(`^${bank.ifscPrefix}0[0-9]{6}$`);
    return ifscRegex.test(ifsc);
  }

  private validateAccountNumber(accountNumber: string): boolean {
    // Most Indian banks have account numbers between 11 to 16 digits
    const accountRegex = /^\d{11,16}$/;
    return accountRegex.test(accountNumber);
  }

  private validateUPIId(upiId: string, bank: Bank): boolean {
    return bank.upiHandles.some(handle => upiId.toLowerCase().endsWith(handle.toLowerCase()));
  }

  validateSMSSender(sender: string): string | null {
    for (const [bankCode, bank] of Object.entries(INDIAN_BANKS)) {
      if (bank.smsSenders.some(s => sender.toUpperCase().includes(s))) {
        return bankCode;
      }
    }
    return null;
  }

  parseSMSAmount(message: string, bankCode: string): number | null {
    const bank = INDIAN_BANKS[bankCode];
    if (!bank) return null;

    for (const pattern of bank.smsPatterns) {
      const match = message.match(pattern);
      if (match) {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(amount) && amount > 0) {
          return amount;
        }
      }
    }
    return null;
  }

  validateTransactionAmount(amount: number, bankCode: string): boolean {
    const bank = INDIAN_BANKS[bankCode];
    if (!bank) return false;

    return (
      amount >= bank.limits.minTransaction &&
      amount <= bank.limits.maxTransaction
    );
  }
}