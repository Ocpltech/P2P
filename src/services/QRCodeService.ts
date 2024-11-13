import QRCode from 'qrcode';
import { logger } from '../utils/logger';

export class QRCodeService {
  async generateQRCode(data: { upiId: string; amount: number }): Promise<string> {
    try {
      const upiUrl = this.generateUPIUrl(data.upiId, data.amount);
      return await QRCode.toDataURL(upiUrl);
    } catch (error) {
      logger.error('QR Code generation failed', { error });
      throw error;
    }
  }

  private generateUPIUrl(upiId: string, amount: number): string {
    const params = new URLSearchParams({
      pa: upiId,
      pn: 'Payment Gateway',
      am: amount.toString(),
      cu: 'INR'
    });

    return `upi://pay?${params.toString()}`;
  }
}