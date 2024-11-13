import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { BankAccountDialog } from '@/components/BankAccountDialog'

const bankAccounts = [
  {
    id: 'ACC001',
    bankName: 'HDFC Bank',
    accountNumber: 'XXXX1234',
    ifscCode: 'HDFC0001234',
    upiId: 'business@hdfcbank',
    status: 'active',
    dailyLimit: 1000000,
    monthlyLimit: 20000000,
    currentVolume: 450000
  },
  // Add more bank account data...
]

const columns = [
  {
    header: 'Bank Name',
    accessorKey: 'bankName',
  },
  {
    header: 'Account Number',
    accessorKey: 'accountNumber',
  },
  {
    header: 'IFSC Code',
    accessorKey: 'ifscCode',
  },
  {
    header: 'UPI ID',
    accessorKey: 'upiId',
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => (
      <span className={
        row.original.status === 'active'
          ? 'text-green-500'
          : 'text-red-500'
      }>
        {row.original.status}
      </span>
    )
  },
  {
    header: 'Daily Limit',
    accessorKey: 'dailyLimit',
    cell: ({ row }) => <span>₹{row.original.dailyLimit}</span>
  },
  {
    header: 'Current Volume',
    accessorKey: 'currentVolume',
    cell: ({ row }) => <span>₹{row.original.currentVolume}</span>
  },
]

export default function BankAccounts() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bank Accounts</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Bank Account
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <DataTable
            columns={columns}
            data={bankAccounts}
          />
        </div>
      </Card>

      <BankAccountDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}