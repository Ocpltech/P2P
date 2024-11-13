export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  accountHolder: string;
  status: 'active' | 'inactive' | 'suspended';
  dailyLimit: number;
  monthlyLimit: number;
  currentDailyVolume: number;
  currentMonthlyVolume: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  clientId: string;
  accountId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentDetails: {
    upiId: string;
    qrCode: string;
  };
  smsConfirmation?: {
    message: string;
    sender: string;
    receivedAt: Date;
  };
  metadata?: Record<string, any>;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  apiKey: string;
  secretKey: string;
  webhookUrl?: string;
  ipWhitelist: string[];
  status: 'active' | 'suspended';
  limits: {
    dailyLimit: number;
    monthlyLimit: number;
    perTransactionLimit: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export * from './banks';