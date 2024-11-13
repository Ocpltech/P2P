import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card } from "./ui/card"
import { useQuery } from "@tanstack/react-query"
import { getSuccessRate } from "@/lib/api"

export function SuccessRateChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['successRate'],
    queryFn: () => getSuccessRate()
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Current Success Rate
          </div>
          <div className="text-2xl font-bold">98.5%</div>
          <div className="text-xs text-red-500">-0.5% from last week</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Failed Transactions
          </div>
          <div className="text-2xl font-bold">15</div>
          <div className="text-xs text-green-500">-3 from yesterday</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Average Processing Time
          </div>
          <div className="text-2xl font-bold">2.3s</div>
          <div className="text-xs text-green-500">-0.2s improvement</div>
        </Card>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
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
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}