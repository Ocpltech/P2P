# Payment Gateway API Documentation

## Base URL
```
https://api.example.com/v1
```

## Authentication
All API endpoints require authentication using an API key in the header:
```http
x-api-key: your_api_key
```

## Endpoints

### Transactions

#### Create Transaction
```http
POST /transactions
```

Create a new payment transaction.

**Request Body:**
```json
{
  "amount": 1000.00,
  "metadata": {
    "orderId": "ORD123",
    "customerEmail": "customer@example.com"
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "trans_123abc",
  "amount": 1000.00,
  "status": "pending",
  "paymentDetails": {
    "upiId": "merchant@bank",
    "qrCode": "data:image/png;base64,..."
  },
  "expiresAt": "2024-01-20T10:30:00Z",
  "createdAt": "2024-01-20T10:00:00Z"
}
```

#### Get Transaction
```http
GET /transactions/:id
```

Retrieve details of a specific transaction.

**Response:** `200 OK`
```json
{
  "id": "trans_123abc",
  "amount": 1000.00,
  "status": "completed",
  "paymentDetails": {
    "upiId": "merchant@bank",
    "qrCode": "data:image/png;base64,..."
  },
  "smsConfirmation": {
    "message": "INR 1,000.00 credited to A/c XX1234",
    "sender": "HDFCBK",
    "receivedAt": "2024-01-20T10:05:00Z"
  },
  "metadata": {
    "orderId": "ORD123",
    "customerEmail": "customer@example.com"
  },
  "createdAt": "2024-01-20T10:00:00Z",
  "updatedAt": "2024-01-20T10:05:00Z"
}
```

#### List Transactions
```http
GET /transactions
```

List all transactions with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (pending/completed/failed)

**Response:** `200 OK`
```json
{
  "transactions": [
    {
      "id": "trans_123abc",
      "amount": 1000.00,
      "status": "completed",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:05:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

### Bank Accounts

#### Add Bank Account
```http
POST /bank-accounts
```

Add a new bank account for receiving payments.

**Request Body:**
```json
{
  "bankName": "HDFC Bank",
  "accountNumber": "12345678901",
  "ifscCode": "HDFC0001234",
  "upiId": "merchant@hdfcbank",
  "accountHolder": "Merchant Name",
  "dailyLimit": 1000000,
  "monthlyLimit": 20000000
}
```

**Response:** `201 Created`
```json
{
  "id": "acc_123abc",
  "bankName": "HDFC Bank",
  "accountNumber": "12345678901",
  "ifscCode": "HDFC0001234",
  "upiId": "merchant@hdfcbank",
  "accountHolder": "Merchant Name",
  "status": "active",
  "dailyLimit": 1000000,
  "monthlyLimit": 20000000,
  "currentDailyVolume": 0,
  "currentMonthlyVolume": 0,
  "createdAt": "2024-01-20T10:00:00Z"
}
```

#### Update Bank Account Status
```http
PATCH /bank-accounts/:id/status
```

Update the status of a bank account.

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Response:** `200 OK`
```json
{
  "id": "acc_123abc",
  "status": "inactive",
  "updatedAt": "2024-01-20T10:05:00Z"
}
```

### Analytics

#### Get Transaction Summary
```http
GET /analytics/transactions/summary
```

Get summary of transactions for a date range.

**Query Parameters:**
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)

**Response:** `200 OK`
```json
{
  "total": {
    "count": 1000,
    "amount": 1000000
  },
  "successful": {
    "count": 950,
    "amount": 950000
  },
  "failed": {
    "count": 50,
    "amount": 50000
  }
}
```

#### Get Success Rate
```http
GET /analytics/success-rate
```

Get the success rate of transactions.

**Response:** `200 OK`
```json
{
  "successRate": 95.5,
  "total": 1000,
  "successful": 955
}
```

### Webhooks

#### SMS Webhook
```http
POST /webhook/sms
```

Endpoint for receiving SMS notifications.

**Request Body:**
```json
{
  "message": "INR 1,000.00 credited to A/c XX1234 by UPI",
  "sender": "HDFCBK",
  "receivedAt": "2024-01-20T10:05:00Z"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "transactionId": "trans_123abc"
}
```

### Reconciliation

#### Start Reconciliation
```http
POST /reconciliation/reconcile
```

Start the reconciliation process for pending transactions.

**Response:** `200 OK`
```json
{
  "success": true,
  "results": {
    "reconciled": 95,
    "failed": 5,
    "pending": 0
  }
}
```

## Supported Banks

The following Indian banks are supported for UPI payments:

1. State Bank of India (SBI)
   - UPI Handles: @sbi, @oksbi
   - IFSC Prefix: SBIN

2. HDFC Bank
   - UPI Handles: @hdfcbank, @payzapp
   - IFSC Prefix: HDFC

3. ICICI Bank
   - UPI Handles: @icici, @ibl
   - IFSC Prefix: ICIC

4. Axis Bank
   - UPI Handles: @axisbank, @axl
   - IFSC Prefix: UTIB

5. Yes Bank
   - UPI Handles: @yesbank, @ybl
   - IFSC Prefix: YESB

6. Kotak Mahindra Bank
   - UPI Handles: @kotak, @kmbl
   - IFSC Prefix: KKBK

7. Punjab National Bank
   - UPI Handles: @pnb, @pnbinb
   - IFSC Prefix: PUNB

8. Bank of Baroda
   - UPI Handles: @barodampay, @bob
   - IFSC Prefix: BARB

9. IDBI Bank
   - UPI Handles: @idbi, @ibkl
   - IFSC Prefix: IBKL

10. Union Bank of India
    - UPI Handles: @unionbank, @uboi
    - IFSC Prefix: UBIN

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid parameters or validation failed |
| 401  | Unauthorized - Invalid or missing API key |
| 403  | Forbidden - IP not whitelisted or insufficient permissions |
| 404  | Not Found - Resource not found |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error - Something went wrong on our end |

## Rate Limits

- 100 requests per minute per IP
- Burst: up to 200 requests
- Block duration: 15 minutes after exceeding limit

## Webhook Events

Your webhook URL will receive the following events:

| Event | Description |
|-------|-------------|
| `payment.success` | Payment was successful |
| `payment.failed` | Payment failed |
| `payment.expired` | Payment expired |
| `payment.reconciled` | Payment was reconciled |

Each webhook request includes:
- Event type
- Transaction data
- Timestamp
- HMAC signature for verification

## Best Practices

1. Always verify webhook signatures
2. Implement idempotency for payment creation
3. Handle retries for failed webhook deliveries
4. Store transaction IDs for reconciliation
5. Monitor transaction success rates
6. Keep API keys secure
7. Whitelist IPs for additional security
8. Implement proper error handling
9. Use test mode before going live
10. Monitor analytics regularly

## Testing

Use test mode API keys for development and testing:
- Test API Key: `pk_test_...`
- Test Secret Key: `sk_test_...`

Test bank accounts are provided for each supported bank in test mode.