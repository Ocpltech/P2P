import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card } from "./ui/card"
import { useQuery } from "@tanstack/react-query"
import { getBankPerformance } from "@/lib/api"

export function BankPerformance() {
  const { data, isLoading } = useQuery({
    queryKey: ['bankPerformance'],
    queryFn: () => getBankPerformance()
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Best Performing Bank
          </div>
          <div className="text-2xl font-bold">HDFC Bank</div>
          <div className="text-xs text-green-500">99.2% success rate</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Active Banks
          </div>
          <div className="text-2xl font-bold">8</div>
          <div className="text-xs">Processing transactions</div>
        </Card>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="bank"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip />
            <Bar
              dataKey="successRate"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {data?.map((bank) => (
          <Card key={bank.bank} className="p-4">
            <div className="text-sm font-medium">{bank.bank}</div>
            <div className="mt-1 text-2xl font-bold">
              {bank.successRate}%
            </div>
            <div className="mt-2 flex items-center text-xs">
              <div className="text-muted-foreground">
                Volume: ₹{bank.volume}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}