'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/lib/store";
import { AlertCircle, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusConfig = {
    Completed: {
      variant: "default" as const,
      className: "bg-green-500 text-primary-foreground border-transparent hover:bg-green-600",
      text: "Completed",
    },
    Pending: {
      variant: "outline" as const,
      className: "bg-yellow-500 text-white border-transparent hover:bg-yellow-600",
      text: "Pending",
    },
    Failed: {
      variant: "destructive" as const,
      className: "border-transparent",
      text: "Failed",
    },
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
    <div className="space-y-4">
      {orders.map((order) => {
        const config = statusConfig[order.status] ?? statusConfig.Pending;
        return (
            <Card key={order.id} className="p-4 shadow-md bg-secondary/30">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                        <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="font-semibold truncate">{order.description}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="font-bold text-lg mb-1 whitespace-nowrap">৳{order.amount.toFixed(2)}</p>
                        <Badge variant={config.variant} className={cn('text-xs font-bold', config.className)}>
                            {config.text}
                        </Badge>
                    </div>
                </div>
            </Card>
        );
      })}
    </div>
  );
}
