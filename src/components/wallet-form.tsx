"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { format } from 'date-fns';

const formSchema = z.object({
  amount: z.coerce.number().min(1, { message: "Amount must be at least ৳1." }),
});

export function WalletForm() {
  const { toast } = useToast();
  const { balance, setBalance, addTransaction } = useAppStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newBalance = balance + values.amount;
    setBalance(newBalance);

    addTransaction({
        id: `TXN-${Date.now()}`,
        date: format(new Date(), 'dd/MM/yyyy, HH:mm:ss'),
        description: 'Wallet Top-up',
        amount: values.amount,
        status: 'Completed'
    });
    
    toast({
      title: "Top-up Successful",
      description: `You have added ৳${values.amount.toFixed(2)} to your wallet.`,
    });
    form.reset({ amount: undefined });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (BDT)</FormLabel>
              <FormControl>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
                    <Input type="number" placeholder="e.g., 500" {...field} className="pl-6"/>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add Funds
        </Button>
      </form>
    </Form>
  );
}
