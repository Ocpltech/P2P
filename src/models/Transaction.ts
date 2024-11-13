import mongoose, { Schema } from 'mongoose';
import { Transaction } from '../types';

const transactionSchema = new Schema<Transaction>({
  clientId: { type: String, required: true },
  accountId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  paymentDetails: {
    upiId: { type: String, required: true },
    qrCode: { type: String, required: true }
  },
  smsConfirmation: {
    message: String,
    sender: String,
    receivedAt: Date
  },
  metadata: Schema.Types.Mixed,
  expiresAt: { type: Date, required: true },
}, {
  timestamps: true
});

transactionSchema.index({ clientId: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ amount: 1 });

export const TransactionModel = mongoose.model<Transaction>('Transaction', transactionSchema);