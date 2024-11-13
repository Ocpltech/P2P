import mongoose, { Schema } from 'mongoose';
import { Client } from '../types';

const clientSchema = new Schema<Client>({
  name: { type: String, required: true },
  apiKey: { type: String, required: true, unique: true },
  secretKey: { type: String, required: true },
  webhookUrl: String,
  ipWhitelist: [String],
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  limits: {
    dailyLimit: { type: Number, required: true },
    monthlyLimit: { type: Number, required: true },
    perTransactionLimit: { type: Number, required: true }
  }
}, {
  timestamps: true
});

clientSchema.index({ apiKey: 1 }, { unique: true });
clientSchema.index({ status: 1 });

export const ClientModel = mongoose.model<Client>('Client', clientSchema);