import mongoose, { Schema } from 'mongoose';
import { BankAccount } from '../types';

const bankAccountSchema = new Schema<BankAccount>({
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  upiId: { type: String, required: true, unique: true },
  accountHolder: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  dailyLimit: { type: Number, required: true },
  monthlyLimit: { type: Number, required: true },
  currentDailyVolume: { type: Number, default: 0 },
  currentMonthlyVolume: { type: Number, default: 0 },
}, {
  timestamps: true
});

bankAccountSchema.index({ status: 1 });
bankAccountSchema.index({ upiId: 1 }, { unique: true });

export const BankAccountModel = mongoose.model<BankAccount>('BankAccount', bankAccountSchema);