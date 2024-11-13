import { MigrationInterface } from '../migration-interface';
import { ClientModel } from '../../models/Client';
import { BankAccountModel } from '../../models/BankAccount';
import { TransactionModel } from '../../models/Transaction';

export default class InitialSetup1700000000000 implements MigrationInterface {
  async up(): Promise<void> {
    // Create indexes for Transaction collection
    await TransactionModel.collection.createIndexes([
      { key: { clientId: 1, createdAt: -1 } },
      { key: { status: 1 } },
      { key: { amount: 1 } }
    ]);

    // Create indexes for BankAccount collection
    await BankAccountModel.collection.createIndexes([
      { key: { status: 1 } },
      { key: { upiId: 1 }, unique: true }
    ]);

    // Create indexes for Client collection
    await ClientModel.collection.createIndexes([
      { key: { apiKey: 1 }, unique: true },
      { key: { status: 1 } }
    ]);
  }

  async down(): Promise<void> {
    await TransactionModel.collection.dropIndexes();
    await BankAccountModel.collection.dropIndexes();
    await ClientModel.collection.dropIndexes();
  }
}