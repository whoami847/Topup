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
import { Card } from "@/components/ui/card";
import type { Order } from "@/lib/store";

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
    "Completed": "default",
    "Pending": "secondary",
    "Failed": "destructive",
};

export function OrderList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
        <div className="text-center text-muted-foreground py-16">
            <p className="text-lg">You haven't placed any orders yet.</p>
        </div>
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
