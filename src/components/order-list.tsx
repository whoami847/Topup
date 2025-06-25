'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/lib/store";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
    "Completed": "default",
    "Pending": "secondary",
    "Failed": "destructive",
};

export function OrderList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
        <Card className="mt-4 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-20 text-center">
                <AlertCircle className="h-16 w-16 text-primary mb-4" />
                <h3 className="text-xl font-bold">No orders have been made yet.</h3>
                <Link href="/" className="mt-4">
                    <Button size="lg">Browse Products</Button>
                </Link>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">{order.id}</TableCell>
              <TableCell className="font-medium whitespace-nowrap">{order.date}</TableCell>
              <TableCell>{order.description}</TableCell>
              <TableCell className="text-right font-semibold">৳{order.amount.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <Badge variant={statusVariantMap[order.status] ?? 'default'}>
                  {order.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
