import mongoose from 'mongoose';
import { config } from '../config';
import { ClientModel } from '../models/Client';
import { BankAccountModel } from '../models/BankAccount';
import { logger } from '../utils/logger';
import connectWithRetry from './connection';

async function seed() {
  let connection: typeof mongoose | undefined;
  
  try {
    connection = await connectWithRetry();
    logger.info('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      ClientModel.deleteMany({}),
      BankAccountModel.deleteMany({})
    ]);

    // Create test client
    const client = await ClientModel.create({
      name: 'Test Merchant',
      apiKey: 'test_pk_123456789',
      secretKey: 'test_sk_987654321',
      status: 'active',
      ipWhitelist: ['127.0.0.1'],
      limits: {
        dailyLimit: 1000000,
        monthlyLimit: 20000000,
        perTransactionLimit: 100000
      }
    });

    // Create test bank accounts for different banks
    const bankAccounts = [
      {
        bankName: 'HDFC Bank',
        accountNumber: '12345678901',
        ifscCode: 'HDFC0001234',
        upiId: 'test@hdfcbank',
        accountHolder: 'Test Merchant',
        status: 'active',
        dailyLimit: 1000000,
        monthlyLimit: 20000000,
        currentDailyVolume: 0,
        currentMonthlyVolume: 0
      },
      {
        bankName: 'ICICI Bank',
        accountNumber: '98765432109',
        ifscCode: 'ICIC0001234',
        upiId: 'test@icici',
        accountHolder: 'Test Merchant',
        status: 'active',
        dailyLimit: 1000000,
        monthlyLimit: 20000000,
        currentDailyVolume: 0,
        currentMonthlyVolume: 0
      }
    ];

    await BankAccountModel.insertMany(bankAccounts);

    logger.info('Seed data created successfully', {
      clientId: client.id,
      apiKey: client.apiKey,
      bankAccounts: bankAccounts.length
    });
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  } finally {
    if (connection && process.env.NODE_ENV === 'test') {
      await mongoose.disconnect();
    }
  }
}

if (require.main === module) {
  seed().catch(error => {
    logger.error('Unhandled seed error:', error);
    process.exit(1);
  });
}

export default seed;