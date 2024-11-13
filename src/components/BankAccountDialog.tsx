import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
  upiId: z.string().email("Invalid UPI ID"),
  accountHolder: z.string().min(1, "Account holder name is required"),
  dailyLimit: z.string().min(1, "Daily limit is required"),
  monthlyLimit: z.string().min(1, "Monthly limit is required"),
})

interface BankAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const banks = [
  { name: "HDFC Bank", code: "HDFC" },
  { name: "ICICI Bank", code: "ICIC" },
  { name: "State Bank of India", code: "SBIN" },
  { name: "Axis Bank", code: "UTIB" },
]

export function BankAccountDialog({ open, onOpenChange }: BankAccountDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      upiId: "",
      accountHolder: "",
      dailyLimit: "",
      monthlyLimit: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      // Add API call here
      console.log(values)
      toast({
        title: "Success",
        description: "Bank account added successfully",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add bank account",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
          <DialogDescription>
            Add a new bank account for receiving payments.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Bank</Label>
            <Select
              onValueChange={(value) => form.setValue("bankName", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.code} value={bank.name}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              {...form.register("accountNumber")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              id="ifscCode"
              {...form.register("ifscCode")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              {...form.register("upiId")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountHolder">Account Holder</Label>
            <Input
              id="accountHolder"
              {...form.register("accountHolder")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dailyLimit">Daily Limit</Label>
              <Input
                id="dailyLimit"
                type="number"
                {...form.register("dailyLimit")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyLimit">Monthly Limit</Label>
              <Input
                id="monthlyLimit"
                type="number"
                {...form.register("monthlyLimit")}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}