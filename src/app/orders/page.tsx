'use client';

import { useAppStore } from "@/lib/store";
import { OrderList } from "@/components/order-list";

export default function OrdersPage() {
  const { orders } = useAppStore();

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline">My Orders</h1>
      <OrderList orders={orders} />
    </div>
  );
}
