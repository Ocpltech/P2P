import { Card } from '@/components/ui/card'
import { 
  ArrowUpRight, 
  ArrowDownRight,
  Users,
  CreditCard,
  Building2,
  Activity
} from 'lucide-react'
import { TransactionChart } from '@/components/TransactionChart'
import { RecentTransactions } from '@/components/RecentTransactions'

const stats = [
  {
    title: 'Total Revenue',
    value: '₹2,45,000',
    change: '+12.5%',
    trend: 'up',
    icon: CreditCard,
  },
  {
    title: 'Active Clients',
    value: '145',
    change: '+4.3%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Bank Accounts',
    value: '12',
    change: '0%',
    trend: 'neutral',
    icon: Building2,
  },
  {
    title: 'Success Rate',
    value: '98.5%',
    change: '-0.5%',
    trend: 'down',
    icon: Activity,
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-muted-foreground" />
                {stat.trend === 'up' && (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                )}
                {stat.trend === 'down' && (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className={cn(
                  "text-sm",
                  stat.trend === 'up' && "text-green-500",
                  stat.trend === 'down' && "text-red-500"
                )}>
                  {stat.change}
                </p>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-6">
          <h3 className="font-semibold">Transaction Volume</h3>
          <TransactionChart />
        </Card>
        <Card className="col-span-3 p-6">
          <h3 className="font-semibold">Recent Transactions</h3>
          <RecentTransactions />
        </Card>
      </div>
    </div>
  )
}