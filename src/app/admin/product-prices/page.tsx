
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
import { useAppStore } from '@/lib/store';
import type { TopUpCategory, Product } from '@/lib/products';
import { ArrowLeft, ChevronRight, MoreHorizontal, PlusCircle } from 'lucide-react';
import { PricePointDialog } from '@/components/admin/price-point-dialog';

export default function AdminProductPricesPage() {
  const { topUpCategories, deletePricePoint } = useAppStore();
  const [selectedCategory, setSelectedCategory] = React.useState<TopUpCategory | null>(null);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [selectedPricePoint, setSelectedPricePoint] = React.useState<Product | null>(null);

  const handleNew = () => {
    setSelectedPricePoint(null);
    setIsFormOpen(true);
  };

  const handleEdit = (pricePoint: Product) => {
    setSelectedPricePoint(pricePoint);
    setIsFormOpen(true);
  };

  const handleDelete = (pricePoint: Product) => {
    setSelectedPricePoint(pricePoint);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategory && selectedPricePoint) {
      deletePricePoint(selectedCategory.id, selectedPricePoint.id);
    }
    setIsDeleteConfirmOpen(false);
    setSelectedPricePoint(null);
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedPricePoint(null);
  }

  const currentCategory = topUpCategories.find(c => c.id === selectedCategory?.id);

  if (currentCategory) {
    return (
      <>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setSelectedCategory(null)}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
                <div>
                  <CardTitle>{currentCategory.title}</CardTitle>
                  <CardDescription>
                    Manage the price points for this product.
                  </CardDescription>
                </div>
              </div>
              <Button onClick={handleNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Price Point
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Option Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCategory.products.length > 0 ? (
                  currentCategory.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right font-semibold">৳{product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(product)}>
                                  Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(product)} className="text-destructive">
                                  Delete
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No price points found for this product.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedCategory && (
          <PricePointDialog
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            pricePoint={selectedPricePoint}
            topUpCategoryId={selectedCategory.id}
            onSuccess={closeForm}
          />
        )}

        <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the price point
                "{selectedPricePoint?.name}".
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Prices</CardTitle>
        <CardDescription>Select a product group to view and manage its price points.</CardDescription>
      </CardHeader>
      <CardContent>
        {topUpCategories.length > 0 ? (
          <div className="divide-y divide-border rounded-md border">
            {topUpCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{category.title}</p>
                  <p className="text-sm text-muted-foreground">{category.products.length} price points</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        ) : (
          <div className="h-24 text-center text-muted-foreground flex items-center justify-center">
            <p>No product groups found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
