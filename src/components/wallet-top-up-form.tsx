
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
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';
import { useState } from 'react';
import { Landmark } from 'lucide-react';

const formSchema = z.object({
  amount: z.coerce.number().min(50, { message: "Minimum top-up amount is ৳50." }),
});

export function WalletTopUpForm() {
  const { toast } = useToast();
  const { currentUser, setAuthDialogOpen, gateways } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '' as any,
    },
  });

  const enabledGateways = (gateways || []).filter(g => g.enabled);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    if (!currentUser) {
        toast({ title: "Login Required", description: "You must be logged in to top-up your wallet.", variant: "destructive" });
        setAuthDialogOpen(true);
        setIsSubmitting(false);
        return;
    }
    if (enabledGateways.length === 0) {
        toast({ title: "No Gateway", description: "No payment gateway is enabled. Please contact support.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    try {
        const orderDetails = {
            date: format(new Date(), 'dd/MM/yyyy, HH:mm:ss'),
            description: `Wallet Top-up`, // Simple description
            amount: values.amount,
            userId: currentUser.uid,
        };

        const response = await fetch('/api/payment/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: orderDetails, user: currentUser }),
        });

        const data = await response.json();

        if (response.ok && data.url) {
            window.location.href = data.url; // Redirect to payment gateway
        } else {
            toast({ title: "Error", description: data.message || "Failed to initiate payment.", variant: "destructive" });
            setIsSubmitting(false);
        }
    } catch (error) {
        console.error("Failed to initiate wallet top-up", error);
        toast({ title: "Error", description: "Failed to connect to the payment server.", variant: "destructive" });
        setIsSubmitting(false);
    }
  }

  if (enabledGateways.length === 0) {
      return (
          <div className="text-center text-muted-foreground py-8 border rounded-lg">
            <Landmark className="mx-auto h-10 w-10 mb-2" />
            <p>No payment gateways are currently available.</p>
            <p className="text-sm">Please contact support.</p>
          </div>
      )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount to Top-up (৳) *</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold" 
            disabled={isSubmitting || enabledGateways.length === 0}
        >
          {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </form>
    </Form>
  );
}
