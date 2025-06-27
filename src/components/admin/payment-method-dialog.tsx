
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
import { useAppStore } from '@/lib/store';
import type { PaymentMethod } from '@/lib/payments';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { resizeImage } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';

const paymentMethodSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  logoUrl: z.string().min(1, 'Logo is required.'),
  accountNumber: z.string().min(1, 'Account number is required.'),
  accountType: z.enum(['Personal', 'Agent']),
  enabled: z.boolean(),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  method: PaymentMethod | null;
  onSuccess: () => void;
}

export function PaymentMethodDialog({ isOpen, onOpenChange, method, onSuccess }: PaymentMethodDialogProps) {
  const { addPaymentMethod, updatePaymentMethod } = useAppStore();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: '',
      logoUrl: '',
      accountNumber: '',
      accountType: 'Personal',
      enabled: true,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (method) {
        form.reset({
          name: method.name,
          logoUrl: method.logoUrl,
          accountNumber: method.accountNumber,
          accountType: method.accountType,
          enabled: method.enabled,
        });
        setImagePreview(method.logoUrl);
      } else {
        form.reset({
          name: '',
          logoUrl: '',
          accountNumber: '',
          accountType: 'Personal',
          enabled: true,
        });
        setImagePreview(null);
      }
    }
  }, [method, form, isOpen]);

  const onSubmit = (data: PaymentMethodFormValues) => {
    try {
      if (method) {
        updatePaymentMethod(method.id, data);
        toast({ title: 'Success', description: 'Payment method updated successfully.' });
      } else {
        const newMethodData: Omit<PaymentMethod, 'id'> = {
            ...data,
            imageHint: data.name.toLowerCase(),
        };
        addPaymentMethod(newMethodData);
        toast({ title: 'Success', description: 'Payment method created successfully.' });
      }
      onSuccess();
    } catch (error) {
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{method ? 'Edit Method' : 'Create New Method'}</DialogTitle>
          <DialogDescription>
            {method ? 'Update the details for this payment method.' : 'Fill in the details for the new payment method.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., bKash" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 01234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Agent">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <div>
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Logo Preview"
                          width={64}
                          height={64}
                          className="w-16 h-16 object-contain rounded-md mb-2 border p-1"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md mb-2 border">
                          <span className="text-xs text-muted-foreground">No Logo</span>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const dataUrl = await resizeImage(file, 128, 128);
                              form.setValue('logoUrl', dataUrl, { shouldValidate: true });
                              setImagePreview(dataUrl);
                            } catch (error) {
                                console.error("Image processing failed", error);
                                toast({ title: 'Error', description: 'Could not process image. Please try another one.', variant: 'destructive' });
                            }
                          }
                        }}
                        className="max-w-xs"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Enable Method</FormLabel>
                            <FormMessage />
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
