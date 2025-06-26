
'use client';

import * as React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
import type { TopUpCategory, FormFieldType } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';

const formFieldsOptions: { id: FormFieldType; label: string }[] = [
    { id: 'player_id', label: 'Player ID' },
    { id: 'email', label: 'Email' },
    { id: 'account_type', label: 'Account Type' },
    { id: 'email_phone', label: 'Email/Phone' },
    { id: 'password', label: 'Password' },
    { id: 'two_step_code', label: 'Two-Step Code' },
    { id: 'quantity', label: 'Quantity' },
];

const productPriceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required."),
  price: z.coerce.number().min(0, "Price must be non-negative."),
});

const productSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  imageUrl: z.string().url('Must be a valid URL.'),
  description: z.string().optional(),
  formFields: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one form field.',
  }),
  categoryId: z.string().min(1, 'Please select a category.'),
  products: z.array(productPriceSchema).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: TopUpCategory | null;
  onSuccess: () => void;
}

export function ProductDialog({ isOpen, onOpenChange, product, onSuccess }: ProductDialogProps) {
  const { mainCategories, addTopUpCategory, updateTopUpCategory } = useAppStore();
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      imageUrl: '',
      description: '',
      formFields: [],
      categoryId: '',
      products: [],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  React.useEffect(() => {
    if (isOpen) {
      if (product) {
        const currentMainCategory = mainCategories.find(mc => mc.subCategorySlugs.includes(product.slug));
        form.reset({
          title: product.title,
          imageUrl: product.imageUrl,
          description: product.description.join('\n'),
          formFields: product.formFields,
          categoryId: currentMainCategory?.id || '',
          products: product.products,
        });
      } else {
        form.reset({
          title: '',
          imageUrl: 'https://placehold.co/400x400.png',
          description: '',
          formFields: [],
          categoryId: '',
          products: [],
        });
      }
    }
  }, [product, form, isOpen, mainCategories]);

  const onSubmit = (data: ProductFormValues) => {
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };
    
    const { categoryId, ...productData } = data;

    const processedData = {
        title: productData.title,
        slug: generateSlug(productData.title),
        pageTitle: productData.title.toUpperCase(),
        imageUrl: productData.imageUrl,
        imageHint: productData.title.toLowerCase().split(' ').slice(0, 2).join(' '),
        description: productData.description ? productData.description.split('\n').filter(Boolean) : [],
        formFields: productData.formFields,
        products: productData.products || [],
    };
    
    try {
      if (product) {
        updateTopUpCategory(product.id, processedData, categoryId);
        toast({ title: 'Success', description: 'Product updated successfully.' });
      } else {
        addTopUpCategory(processedData, categoryId);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl><Input placeholder="e.g., DIAMOND TOP UP [BD]" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Main Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mainCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl><Input placeholder="https://placehold.co/400x400.png" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
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
                  <div className="space-y-3 pt-4">
                    <div className="grid grid-cols-[1fr_100px_auto] gap-2 items-start">
                        <FormLabel>Name</FormLabel>
                        <FormLabel>Price (৳)</FormLabel>
                    </div>
                    {fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-[1fr_100px_auto] gap-2 items-start">
                        <FormField
                          control={form.control}
                          name={`products.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
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
                              <FormControl><Input type="number" placeholder="e.g., 22" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                          className="shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => append({ id: `new-${Date.now()}`, name: '', price: 0 })}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Price Point
                    </Button>
                  </div>
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
