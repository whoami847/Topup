
'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import type { TopUpCategory, FormFieldType, Product } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { PlusCircle, X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const formFieldsOptions: { id: FormFieldType; label: string }[] = [
    { id: 'player_id', label: 'Player ID' },
    { id: 'email', label: 'Email' },
    { id: 'account_type', label: 'Account Type' },
    { id: 'email_phone', label: 'Email/Phone' },
    { id: 'password', label: 'Password' },
    { id: 'two_step_code', label: 'Two-Step Code' },
    { id: 'quantity', label: 'Quantity' },
];

const productSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  slug: z.string().min(1, 'Slug is required.'),
  pageTitle: z.string().min(1, 'Page Title is required.'),
  imageUrl: z.string().url('Must be a valid URL.'),
  imageHint: z.string().min(1, 'Image hint is required.'),
  description: z.string().optional(),
  formFields: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one form field.',
  }),
  products: z.array(
    z.object({
      name: z.string().min(1, 'Price point name is required.'),
      price: z.coerce.number().min(0, 'Price must be a positive number.'),
    })
  ).min(1, 'At least one price point is required.'),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: TopUpCategory | null;
  onSuccess: () => void;
}

export function ProductDialog({ isOpen, onOpenChange, product, onSuccess }: ProductDialogProps) {
  const { addTopUpCategory, updateTopUpCategory } = useAppStore();
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      slug: '',
      pageTitle: '',
      imageUrl: '',
      imageHint: '',
      description: '',
      formFields: [],
      products: [],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products',
  });

  React.useEffect(() => {
    if (product) {
      form.reset({
        ...product,
        description: product.description.join('\n'),
        // Ensure products have the correct structure for the form
        products: product.products.map(p => ({ name: p.name, price: p.price }))
      });
    } else {
      form.reset({
        title: '',
        slug: '',
        pageTitle: '',
        imageUrl: 'https://placehold.co/400x400.png',
        imageHint: '',
        description: '',
        formFields: [],
        products: [{ name: '', price: 0 }],
      });
    }
  }, [product, form, isOpen]);

  const onSubmit = (data: ProductFormValues) => {
    const processedData = {
        ...data,
        description: data.description ? data.description.split('\n').filter(Boolean) : [],
        products: data.products.map((p, index) => ({...p, id: product?.products[index]?.id || `${data.slug}_${index + 1}`}))
    };
    
    try {
      if (product) {
        updateTopUpCategory(product.id, processedData);
        toast({ title: 'Success', description: 'Product updated successfully.' });
      } else {
        addTopUpCategory(processedData as Omit<TopUpCategory, 'id'>);
        toast({ title: 'Success', description: 'Product created successfully.' });
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Create New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update the details for this product.' : 'Fill in the details for the new product.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh] pr-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl><Input placeholder="e.g., DIAMOND TOP UP [BD]" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="slug" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl><Input placeholder="e.g., diamond-top-up-bd" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="pageTitle" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Page Title</FormLabel>
                        <FormControl><Input placeholder="e.g., FREE FIRE TOPUP BD" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl><Input placeholder="https://placehold.co/400x400.png" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="imageHint" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image Hint</FormLabel>
                            <FormControl><Input placeholder="e.g., diamond topup" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea placeholder="Enter each line of the description on a new line." {...field} rows={3} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                
                <Separator />

                <FormField
                  control={form.control}
                  name="formFields"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-base">Required Form Fields</FormLabel>
                      <FormDescription>Select the fields needed for this product's top-up form.</FormDescription>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        {formFieldsOptions.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="formFields"
                            render={({ field }) => (
                              <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(field.value?.filter((value) => value !== item.id));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />
                
                <div>
                    <FormLabel className="text-base">Price Points</FormLabel>
                    <FormDescription>Add the different options and prices for this product.</FormDescription>
                    <div className="space-y-4 pt-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                                <FormField
                                    control={form.control}
                                    name={`products.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Name</FormLabel>
                                            <FormControl><Input placeholder="e.g., 25 Diamond" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name={`products.${index}.price`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price (৳)</FormLabel>
                                            <FormControl><Input type="number" placeholder="e.g., 22" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ name: '', price: 0 })}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Price Point
                        </Button>
                    </div>
                     <FormField
                        control={form.control}
                        name="products"
                        render={() => (<FormMessage className="mt-2" />)}
                      />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-8">
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

