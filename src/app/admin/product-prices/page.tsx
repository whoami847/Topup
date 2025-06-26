
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
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import type { TopUpCategory } from '@/lib/products';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function AdminProductPricesPage() {
  const { topUpCategories } = useAppStore();
  const [selectedCategory, setSelectedCategory] = React.useState<TopUpCategory | null>(null);

  if (selectedCategory) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setSelectedCategory(null)}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div>
              <CardTitle>{selectedCategory.title}</CardTitle>
              <CardDescription>
                A list of all price points for this product.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Option Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedCategory.products.length > 0 ? (
                selectedCategory.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right font-semibold">৳{product.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    No price points found for this product.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Prices</CardTitle>
        <CardDescription>Select a product group to view its price points.</CardDescription>
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
