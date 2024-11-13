export interface BankLimits {
  minTransaction: number;
  maxTransaction: number;
  dailyLimit: number;
  monthlyLimit: number;
}

export interface Bank {
  name: string;
  code: string;
  ifscPrefix: string;
  upiHandles: string[];
  smsPatterns: RegExp[];
  smsSenders: string[];
  limits: BankLimits;
  features?: {
    instantRefund?: boolean;
    bulkTransfer?: boolean;
    scheduledPayments?: boolean;
    internationalTransfer?: boolean;
  };
  apiConfig?: {
    baseUrl?: string;
    timeout?: number;
    version?: string;
  };
  webhookConfig?: {
    enabled: boolean;
    signatureHeader?: string;
    secretKey?: string;
  };
}

export interface BankValidationResult {
  isValid: boolean;
  message?: string;
  details?: {
    ifscValid: boolean;
    accountNumberValid: boolean;
    upiIdValid: boolean;
    limitValid?: boolean;
  };
  metadata?: {
    bankName?: string;
    branchCode?: string;
    branchName?: string;
  };
}