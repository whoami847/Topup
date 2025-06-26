
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MainCategory } from '@/lib/products';
import { CategoryDialog } from '@/components/admin/category-dialog';

export default function AdminCategoriesPage() {
  const { mainCategories, deleteMainCategory } = useAppStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<MainCategory | null>(null);

  const handleNew = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: MainCategory) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category: MainCategory) => {
    setSelectedCategory(category);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteMainCategory(selectedCategory.id);
    }
    setIsDeleteConfirmOpen(false);
    setSelectedCategory(null);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Organize your products into categories.</CardDescription>
          </div>
          <Button onClick={handleNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Category
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Image Hint</TableHead>
                <TableHead className="text-center">Sub-categories</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mainCategories.length > 0 ? (
                mainCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.title}</TableCell>
                    <TableCell>{category.imageHint}</TableCell>
                    <TableCell className="text-center">{category.subCategorySlugs.length}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(category)}>
                                  Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(category)} className="text-destructive">
                                  Delete
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <CategoryDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        category={selectedCategory}
        onSuccess={closeForm}
      />

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category
              "{selectedCategory?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
