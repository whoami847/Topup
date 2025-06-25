'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from './ui/label';

const paymentMethods = [
  { id: 'bKash', name: 'bKash', number: '01756851247' },
  { id: 'Nagad', name: 'Nagad', number: '01756851247' },
  { id: 'Rocket', name: 'Rocket', number: '01756851247' },
];

const formSchema = z.object({
  amount: z.coerce.number().min(1, { message: "Please enter a valid amount." }),
  paymentMethod: z.string({ required_error: "Please select a payment method." }),
  transactionId: z.string().min(1, { message: "Transaction ID is required." }),
});

export function WalletTopUpForm() {
  const { toast } = useToast();
  const { addTransaction, balance, setBalance } = useAppStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      paymentMethod: undefined,
      transactionId: '',
    },
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Payment number copied to clipboard.",
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newBalance = balance + values.amount;
    setBalance(newBalance);

    addTransaction({
        id: `TXN-${Date.now()}`,
        date: format(new Date(), 'dd/MM/yyyy, HH:mm:ss'),
        description: `Wallet Top-up via ${values.paymentMethod}`,
        amount: values.amount,
        status: 'Completed'
    });
    
    toast({
      title: "Top-up Successful",
      description: `৳${values.amount.toFixed(2)} has been added to your main balance.`,
    });

    router.push('/wallet');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount to Topup (৳) *</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter amount to topup" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel>Select Payment Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center gap-4">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label
                          htmlFor={method.id}
                          className={cn(
                              "flex-1 flex justify-between items-center rounded-lg border-2 p-4 cursor-pointer transition-colors",
                              field.value === method.id ? 'border-primary bg-primary/5' : 'border-muted'
                          )}
                      >
                          <div>
                              <p className="font-semibold">{method.name}</p>
                              <p className="text-sm text-muted-foreground">Personal</p>
                              <p className="text-sm font-medium">{method.number}</p>
                          </div>
                          <Button type="button" variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); handleCopy(method.number)}}>
                              <Copy className="h-5 w-5 text-muted-foreground" />
                          </Button>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transactionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction ID *</FormLabel>
              <FormControl>
                <Input placeholder="Enter your transaction ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold">
          Submit Payment
        </Button>
      </form>
    </Form>
  );
}
