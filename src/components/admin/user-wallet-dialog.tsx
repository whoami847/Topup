
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppStore, User } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';

const walletManagementSchema = z.object({
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  type: z.enum(['add', 'subtract'], { required_error: 'You must select an action type.' }),
  reason: z.string().min(5, 'Please provide a reason for this adjustment.'),
});

type FormValues = z.infer<typeof walletManagementSchema>;

interface UserWalletDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User | null;
  onSuccess: () => void;
}

export function UserWalletDialog({ isOpen, onOpenChange, user, onSuccess }: UserWalletDialogProps) {
  const { manageUserWallet } = useAppStore();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(walletManagementSchema),
    defaultValues: {
      amount: undefined,
      type: 'add',
      reason: '',
    },
  });

  React.useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    try {
      await manageUserWallet(user.uid, data.amount, data.type, data.reason);
      toast({ title: 'Success', description: 'User wallet updated successfully.' });
      onSuccess();
    } catch (error) {
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Wallet</DialogTitle>
          <DialogDescription>
            Adjust the wallet balance for <span className="font-semibold text-primary">{user.email}</span>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Action</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="add" />
                        </FormControl>
                        <FormLabel className="font-normal text-green-500">Add to Balance</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="subtract" />
                        </FormControl>
                        <FormLabel className="font-normal text-destructive">Subtract from Balance</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (৳)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Adjustment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Refund for order #12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Confirm Adjustment'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
