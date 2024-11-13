import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { TransactionDialog } from '@/components/TransactionDialog'

const transactions = [
  {
    id: 'TRANS001',
    amount: 25000,
    status: 'completed',
    date: '2024-01-20 10:00 AM',
    bank: 'HDFC Bank',
    client: 'Acme Corp',
    reference: 'INV-2024-001'
  },
  // Add more transaction data...
]

const columns = [
  {
    header: 'Transaction ID',
    accessorKey: 'id',
  },
  {
    header: 'Amount',
    accessorKey: 'amount',
    cell: ({ row }) => <span>₹{row.original.amount}</span>
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => (
      <span className={
        row.original.status === 'completed' 
          ? 'text-green-500' 
          : 'text-red-500'
      }>
        {row.original.status}
      </span>
    )
  },
  {
    header: 'Date',
    accessorKey: 'date',
  },
  {
    header: 'Bank',
    accessorKey: 'bank',
  },
  {
    header: 'Client',
    accessorKey: 'client',
  },
  {
    header: 'Reference',
    accessorKey: 'reference',
  },
]

export default function Transactions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Transaction
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          <DataTable
            columns={columns}
            data={transactions}
          />
        </div>
      </Card>

      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}