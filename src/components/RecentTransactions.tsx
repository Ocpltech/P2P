import { CheckCircle2, XCircle } from 'lucide-react'

const transactions = [
  {
    id: 1,
    amount: 25000,
    status: 'completed',
    date: '2024-01-20 10:00 AM',
    bank: 'HDFC Bank'
  },
  {
    id: 2,
    amount: 15000,
    status: 'failed',
    date: '2024-01-20 09:45 AM',
    bank: 'ICICI Bank'
  },
  {
    id: 3,
    amount: 35000,
    status: 'completed',
    date: '2024-01-20 09:30 AM',
    bank: 'SBI'
  },
  {
    id: 4,
    amount: 20000,
    status: 'completed',
    date: '2024-01-20 09:15 AM',
    bank: 'Axis Bank'
  },
]

export function RecentTransactions() {
  return (
    <div className="mt-4 space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium">₹{transaction.amount}</p>
            <p className="text-sm text-muted-foreground">{transaction.bank}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm">{transaction.date}</p>
              <div className="flex items-center space-x-1">
                {transaction.status === 'completed' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <p className={cn(
                  "text-sm capitalize",
                  transaction.status === 'completed' ? "text-green-500" : "text-red-500"
                )}>
                  {transaction.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}