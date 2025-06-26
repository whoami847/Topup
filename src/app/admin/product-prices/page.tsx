
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
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';

export default function AdminProductPricesPage() {
  const { topUpCategories } = useAppStore();

  const allProducts = React.useMemo(() => {
    return topUpCategories.flatMap(category => 
      category.products.map(product => ({
        ...product,
        categoryTitle: category.title,
      }))
    ).sort((a, b) => b.price - a.price);
  }, [topUpCategories]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Prices</CardTitle>
        <CardDescription>A list of all products and their current prices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allProducts.length > 0 ? (
              allProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.categoryTitle}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">৳{product.price.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
