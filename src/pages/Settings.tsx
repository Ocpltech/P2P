import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">General Settings</h2>
            <div className="space-y-4 max-w-lg">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input defaultValue="Acme Payments" />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input type="email" defaultValue="admin@acme.com" />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <select className="w-full rounded-md border p-2">
                  <option>Asia/Kolkata (GMT+5:30)</option>
                  <option>UTC</option>
                </select>
              </div>
              <Button>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Security Settings</h2>
            <div className="space-y-6 max-w-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">IP Whitelisting</h3>
                  <p className="text-sm text-muted-foreground">
                    Restrict access to specific IP addresses
                  </p>
                </div>
                <Switch />
              </div>
              <Button>Update Security Settings</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
            <div className="space-y-6 max-w-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive transaction updates via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Webhook Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Send transaction updates to webhook URL
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input defaultValue="https://api.example.com/webhook" />
              </div>
              <Button>Save Preferences</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">API Keys</h2>
            <div className="space-y-6 max-w-lg">
              <div className="space-y-2">
                <Label>Live API Key</Label>
                <div className="flex gap-2">
                  <Input defaultValue="pk_live_..." type="password" />
                  <Button variant="outline">Show</Button>
                  <Button variant="outline">Copy</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Test API Key</Label>
                <div className="flex gap-2">
                  <Input defaultValue="pk_test_..." type="password" />
                  <Button variant="outline">Show</Button>
                  <Button variant="outline">Copy</Button>
                </div>
              </div>
              <Button>Generate New Keys</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}