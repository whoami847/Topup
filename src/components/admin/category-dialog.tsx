
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
import type { MainCategory } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';

const categorySchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  imageUrl: z.string().url('Must be a valid URL.'),
  imageHint: z.string().min(1, 'Image hint is required.'),
  subCategorySlugs: z.string().min(1, 'At least one sub-category slug is required.'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  category: MainCategory | null;
  onSuccess: () => void;
}

export function CategoryDialog({ isOpen, onOpenChange, category, onSuccess }: CategoryDialogProps) {
  const { addMainCategory, updateMainCategory } = useAppStore();
  const { toast } = useToast();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: '',
      imageUrl: '',
      imageHint: '',
      subCategorySlugs: '',
    },
  });

  React.useEffect(() => {
    if (category) {
      form.reset({
        title: category.title,
        imageUrl: category.imageUrl,
        imageHint: category.imageHint,
        subCategorySlugs: category.subCategorySlugs.join(', '),
      });
    } else {
      form.reset({
        title: '',
        imageUrl: 'https://placehold.co/400x400.png',
        imageHint: '',
        subCategorySlugs: '',
      });
    }
  }, [category, form, isOpen]);

  const onSubmit = (data: CategoryFormValues) => {
    const processedData = {
        ...data,
        subCategorySlugs: data.subCategorySlugs.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (category) {
        updateMainCategory(category.id, processedData);
        toast({ title: 'Success', description: 'Category updated successfully.' });
      } else {
        addMainCategory(processedData);
        toast({ title: 'Success', description: 'Category created successfully.' });
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
          <DialogTitle>{category ? 'Edit Category' : 'Create New Category'}</DialogTitle>
          <DialogDescription>
            {category ? 'Update the details for this category.' : 'Fill in the details for the new category.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., FREE FIRE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://placehold.co/400x400.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Hint</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., free fire character" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subCategorySlugs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-Category Slugs</FormLabel>
                  <FormControl>
                    <Textarea placeholder="slug-one, slug-two, slug-three" {...field} />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">Enter slugs separated by commas.</p>
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
