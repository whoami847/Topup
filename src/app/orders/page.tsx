'use client';

import * as React from 'react';
import { useAppStore } from "@/lib/store";
import { OrderList } from "@/components/order-list";
import { LoginRequired } from '@/components/auth/login-required';
import { Skeleton } from '@/components/ui/skeleton';

const PageSkeleton = () => (
  <div className="container py-8 md:py-12">
    <Skeleton className="h-10 w-48 mb-8" />
    <div className="space-y-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  </div>
);

export default function OrdersPage() {
  const { orders, currentUser, isAuthLoading } = useAppStore();

  const userProductOrders = React.useMemo(() => {
    if (!currentUser) return [];
    // Filter to show only the current user's orders and exclude wallet top-ups
    return orders
        .filter(order => order.userId === currentUser.uid)
        .filter(order => !order.description.toLowerCase().includes('wallet top-up'));
  }, [orders, currentUser]);
  
  if (isAuthLoading) {
    return <PageSkeleton />;
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
      <OrderList orders={userProductOrders} />
    </div>
  );
}
