
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
import Image from 'next/image';
import { resizeImage } from '@/lib/utils';

const categorySchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  imageUrl: z.string().min(1, 'Image is required.'),
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
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: '',
      imageUrl: '',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (category) {
        form.reset({
          title: category.title,
          imageUrl: category.imageUrl,
        });
        setImagePreview(category.imageUrl);
      } else {
        form.reset({
          title: '',
          imageUrl: '',
        });
        setImagePreview(null);
      }
    }
  }, [category, form, isOpen]);

  const onSubmit = (data: CategoryFormValues) => {
    try {
      if (category) {
        // Only update fields present in the form
        updateMainCategory(category.id, {
            title: data.title,
            imageUrl: data.imageUrl,
        });
        toast({ title: 'Success', description: 'Category updated successfully.' });
      } else {
        // For new categories, build the full object
        const newCategoryData: Omit<MainCategory, 'id'> = {
            title: data.title,
            imageUrl: data.imageUrl,
            imageHint: data.title.toLowerCase().split(' ').slice(0, 2).join(' '),
            subCategorySlugs: []
        };
        addMainCategory(newCategoryData);
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
              render={() => (
                <FormItem>
                  <FormLabel>Category Image</FormLabel>
                  <FormControl>
                    <div>
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Category Preview"
                          width={128}
                          height={128}
                          className="w-32 h-32 object-cover rounded-md mb-2 border"
                        />
                      ) : (
                        <div className="w-32 h-32 flex items-center justify-center bg-muted rounded-md mb-2 border">
                          <span className="text-xs text-muted-foreground">No Image</span>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const dataUrl = await resizeImage(file, 400, 400);
                              form.setValue('imageUrl', dataUrl, { shouldValidate: true });
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
