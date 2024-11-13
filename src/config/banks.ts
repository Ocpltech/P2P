import { Bank } from '../types';

export const INDIAN_BANKS: Record<string, Bank> = {
  SBI: {
    name: 'State Bank of India',
    code: 'SBI',
    ifscPrefix: 'SBIN',
    upiHandles: ['@sbi', '@oksbi'],
    smsPatterns: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /received.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?(?:a\/c|acct).*?([X\d]+)/i,
      /UPI-CR.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i
    ],
    smsSenders: ['SBI', 'SBIUPI', 'SBIPAY', 'SBIINB'],
    limits: {
      minTransaction: 1,
      maxTransaction: 200000,
      dailyLimit: 1000000,
      monthlyLimit: 20000000
    }
  },
  HDFC: {
    name: 'HDFC Bank',
    code: 'HDFC',
    ifscPrefix: 'HDFC',
    upiHandles: ['@hdfcbank', '@payzapp'],
    smsPatterns: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*transferred.*?(?:a\/c|acct).*?([X\d]+)/i,
      /received.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*via\s+UPI/i,
      /UPI-CREDIT.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i
    ],
    smsSenders: ['HDFC', 'HDFCBK', 'HDFCUPI', 'HDFCINB'],
    limits: {
      minTransaction: 1,
      maxTransaction: 200000,
      dailyLimit: 1000000,
      monthlyLimit: 20000000
    }
  },
  ICICI: {
    name: 'ICICI Bank',
    code: 'ICICI',
    ifscPrefix: 'ICIC',
    upiHandles: ['@icici', '@ibl'],
    smsPatterns: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*received.*?UPI/i,
      /UPI.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*credited/i,
      /UPI-CR.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i
    ],
    smsSenders: ['ICICI', 'ICICIB', 'ICICIUPI', 'ICICINB'],
    limits: {
      minTransaction: 1,
      maxTransaction: 200000,
      dailyLimit: 1000000,
      monthlyLimit: 20000000
    }
  },
  AXIS: {
    name: 'Axis Bank',
    code: 'AXIS',
    ifscPrefix: 'UTIB',
    upiHandles: ['@axisbank', '@axl'],
    smsPatterns: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*received.*?UPI/i,
      /UPI.*?credit.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i,
      /UPI-CR.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i
    ],
    smsSenders: ['AXIS', 'AXISBK', 'AXISUPI', 'AXISINB'],
    limits: {
      minTransaction: 1,
      maxTransaction: 200000,
      dailyLimit: 1000000,
      monthlyLimit: 20000000
    }
  },
  YES: {
    name: 'Yes Bank',
    code: 'YES',
    ifscPrefix: 'YESB',
    upiHandles: ['@yesbank', '@ybl'],
    smsPatterns: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*received.*?UPI/i,
      /UPI.*?transfer.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i,
      /UPI-CR.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i
    ],
    smsSenders: ['YES', 'YESBK', 'YESUPI', 'YESINB'],
    limits: {
      minTransaction: 1,
      maxTransaction: 200000,
      dailyLimit: 1000000,
      monthlyLimit: 20000000
    }
  },
  KOTAK: {
    name: 'Kotak Mahindra Bank',
    code: 'KOTAK',
    ifscPrefix: 'KKBK',
    upiHandles: ['@kotak', '@kmbl'],
    smsPatterns: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*received.*?UPI/i,
      /UPI.*?credit.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i,
      /Money Received via UPI.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i
    ],
    smsSenders: ['KOTAK', 'KOTAKB', 'KOTAKUPI', 'KOTAKINB'],
    limits: {
      minTransaction: 1,
      maxTransaction: 200000,
      dailyLimit: 1000000,
      monthlyLimit: 20000000
    }
  },
  PNB: {
    name: 'Punjab National Bank',
    code: 'PNB',
    ifscPrefix: 'PUNB',
    upiHandles: ['@pnb', '@pnbinb'],
    smsPatterns: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*received.*?UPI/i,
      /UPI.*?credit.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i,
      /UPI-CR.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i
    ],
    smsSenders: ['PNB', 'PNBSMS', 'PNBUPI', 'PNBINB'],
    limits: {
      minTransaction: 1,
      maxTransaction: 200000,
      dailyLimit: 1000000,
      monthlyLimit: 20000000
    }
  },
  BOB: {
    name: 'Bank of Baroda',
    code: 'BOB',
    ifscPrefix: 'BARB',
    upiHandles: ['@barodampay', '@bob'],
    smsPatterns: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*received.*?UPI/i,
      /UPI.*?credit.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i,
      /UPI-CR.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*.*?\/([X\d]+)/i
    ],
    smsSenders: ['BOB', 'BOBSMS', 'BOBUPI', 'BOBINB'],
    limits: {
      minTransaction: 1,
      maxTransaction: 200000,
      dailyLimit: 1000000,
      monthlyLimit: 20000000
    }
  },
  IDBI: {
    name: 'IDBI Bank',
    code: 'IDBI',
    ifscPrefix: 'IBKL',
    upiHandles: ['@idbi', '@ibkl'],
    smsPatterns: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*received.*?UPI/i,
      /UPI.*?credit.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i
    ],
    smsSenders: ['IDBI', 'IDBIB', 'IDBIUPI', 'IDBIINB'],
    limits: {
      minTransaction: 1,
      maxTransaction: 200000,
      dailyLimit: 1000000,
      monthlyLimit: 20000000
    }
  },
  UNION: {
    name: 'Union Bank of India',
    code: 'UNION',
    ifscPrefix: 'UBIN',
    upiHandles: ['@unionbank', '@uboi'],
    smsPatterns: [
      /credited.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*(?:cr|credited).*?(?:a\/c|acct).*?([X\d]+)/i,
      /(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)\s*received.*?UPI/i,
      /UPI.*?credit.*?(?:INR|Rs\.)\s*([\d,]+(?:\.\d{2})?)/i
    ],
    smsSenders: ['UNION', 'UBOI', 'UNIONUPI', 'UNIONINB'],
    limits: {
      minTransaction: 1,
      maxTransaction: 200000,
      dailyLimit: 1000000,
      monthlyLimit: 20000000
    }
  }
};