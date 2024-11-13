import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card } from "./ui/card"
import { useQuery } from "@tanstack/react-query"
import { getTransactionVolume } from "@/lib/api"

export function VolumeChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['transactionVolume'],
    queryFn: () => getTransactionVolume('daily')
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Today's Volume
          </div>
          <div className="text-2xl font-bold">₹2,45,000</div>
          <div className="text-xs text-green-500">+12.5% from yesterday</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Weekly Average
          </div>
          <div className="text-2xl font-bold">₹1,95,000</div>
          <div className="text-xs text-green-500">+8.2% from last week</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Monthly Total
          </div>
          <div className="text-2xl font-bold">₹58,50,000</div>
          <div className="text-xs text-green-500">+15.3% from last month</div>
        </Card>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="volume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#volume)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}