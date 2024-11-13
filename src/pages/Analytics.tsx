import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VolumeChart } from '@/components/VolumeChart'
import { SuccessRateChart } from '@/components/SuccessRateChart'
import { BankPerformance } from '@/components/BankPerformance'

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <Tabs defaultValue="volume">
        <TabsList>
          <TabsTrigger value="volume">Transaction Volume</TabsTrigger>
          <TabsTrigger value="success">Success Rate</TabsTrigger>
          <TabsTrigger value="banks">Bank Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="volume" className="mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Transaction Volume</h2>
            <VolumeChart />
          </Card>
        </TabsContent>

        <TabsContent value="success" className="mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Success Rate</h2>
            <SuccessRateChart />
          </Card>
        </TabsContent>

        <TabsContent value="banks" className="mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Bank Performance</h2>
            <BankPerformance />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}