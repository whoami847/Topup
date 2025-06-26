
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
import type { Product } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

const pricePointSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  price: z.coerce.number().min(0, 'Price must be a non-negative number.'),
});

type PricePointFormValues = z.infer<typeof pricePointSchema>;

interface PricePointDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  pricePoint: Product | null;
  topUpCategoryId: string;
  onSuccess: () => void;
}

export function PricePointDialog({ isOpen, onOpenChange, pricePoint, topUpCategoryId, onSuccess }: PricePointDialogProps) {
  const { addPricePoint, updatePricePoint } = useAppStore();
  const { toast } = useToast();

  const form = useForm<PricePointFormValues>({
    resolver: zodResolver(pricePointSchema),
    defaultValues: {
      name: '',
      price: 0,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (pricePoint) {
        form.reset({
          name: pricePoint.name,
          price: pricePoint.price,
        });
      } else {
        form.reset({
          name: '',
          price: 0,
        });
      }
    }
  }, [pricePoint, form, isOpen]);

  const onSubmit = (data: PricePointFormValues) => {
    try {
      if (pricePoint) {
        updatePricePoint(topUpCategoryId, pricePoint.id, data);
        toast({ title: 'Success', description: 'Price point updated successfully.' });
      } else {
        addPricePoint(topUpCategoryId, data);
        toast({ title: 'Success', description: 'Price point created successfully.' });
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
          <DialogTitle>{pricePoint ? 'Edit Price Point' : 'Create New Price Point'}</DialogTitle>
          <DialogDescription>
            {pricePoint ? 'Update the details for this price point.' : 'Fill in the details for the new price point.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 25 Diamond" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (৳)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 22" {...field} />
                  </FormControl>
                  <FormMessage />
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
