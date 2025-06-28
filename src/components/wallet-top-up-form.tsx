
'use client';

import * as React from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import Image from 'next/image';
import { Landmark, Copy } from 'lucide-react';

const formSchema = z.object({
  amount: z.coerce.number().min(1, { message: "Amount must be greater than 0." }),
  transactionId: z.string().min(5, { message: "Please enter a valid Transaction ID." }),
});

export function WalletTopUpForm() {
  const { toast } = useToast();
  const { addTransaction, currentUser, setAuthDialogOpen, paymentMethods } = useAppStore();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '' as any,
      transactionId: '',
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "The account number has been copied to your clipboard.",
      });
    }).catch(err => {
      toast({
        title: "Failed to copy",
        description: "Could not copy the text. Please try again.",
        variant: "destructive",
      });
      console.error('Could not copy text: ', err);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) {
        toast({ title: "Login Required", description: "You must be logged in to top-up your wallet.", variant: "destructive" });
        setAuthDialogOpen(true);
        return;
    }
    try {
      const newTransaction = {
        date: format(new Date(), 'dd/MM/yyyy, HH:mm:ss'),
        description: `Wallet Top-up Request (TrxID: ${values.transactionId})`,
        amount: values.amount,
        status: 'Pending' as const,
      };
      await addTransaction(newTransaction);
      toast({
        title: "Request Submitted!",
        description: "Your top-up request has been received. Please wait for admin approval.",
      });
      form.reset();
    } catch (error) {
      console.error("Failed to submit top-up request", error);
      toast({
        title: "Submission Failed",
        description: "An error occurred while submitting your request.",
        variant: "destructive",
      });
    }
  }
  
  const enabledPaymentMethods = (paymentMethods || []).filter(m => m.enabled);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-center">Send money to any of the accounts below:</h3>
        {enabledPaymentMethods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enabledPaymentMethods.map((method) => (
                <Alert key={method.id} className="bg-secondary/50 border-secondary-foreground/10">
                    <div className="flex items-center gap-3">
                        <Image src={method.logoUrl} alt={method.name} width={24} height={24} className="h-6 w-6" />
                        <AlertTitle className="font-bold flex-grow">{method.name} ({method.accountType})</AlertTitle>
                    </div>
                    <AlertDescription className="mt-3 flex items-center justify-between rounded-md bg-background p-2 pl-3">
                        <span className="font-mono text-base font-semibold text-primary/90 tracking-wider">
                            {method.accountNumber}
                        </span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(method.accountNumber)}>
                            <span className="sr-only">Copy account number</span>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </AlertDescription>
                </Alert>
            ))}
            </div>
        ) : (
            <div className="text-center text-muted-foreground py-8 border rounded-lg">
                <Landmark className="mx-auto h-10 w-10 mb-2" />
                <p>No manual payment methods are currently enabled.</p>
                <p className="text-sm">Please contact support.</p>
            </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Sent (৳) *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter the amount you sent" {...field} />
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
                  <Input placeholder="Enter the transaction ID from your payment app" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            size="lg" 
            className="w-full" 
            disabled={form.formState.isSubmitting || enabledPaymentMethods.length === 0}
          >
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Top-up Request'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
