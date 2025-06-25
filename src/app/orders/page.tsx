
'use client';

import * as React from 'react';
import { useAppStore } from "@/lib/store";
import { OrderList } from "@/components/order-list";
import { LoginRequired } from '@/components/auth/login-required';

export default function OrdersPage() {
  const { orders, currentUser } = useAppStore();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="container py-8 md:py-12">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-secondary/50 mb-8"></div>
        <div className="space-y-4">
          <div className="h-24 w-full animate-pulse rounded-lg bg-secondary/50"></div>
          <div className="h-24 w-full animate-pulse rounded-lg bg-secondary/50"></div>
          <div className="h-24 w-full animate-pulse rounded-lg bg-secondary/50"></div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
        <div className="container py-8 md:py-12">
            <LoginRequired message="View Your Orders" />
        </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline">My Orders</h1>
      <OrderList orders={orders} />
    </div>
  );
}
