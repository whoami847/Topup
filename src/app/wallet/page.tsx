'use client';

import * as React from "react";
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionList } from "@/components/transaction-list";
import { Plus, List, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function WalletPage() {
  const store = useAppStore();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const balance = store.balance;
  const pendingBalance = store.transactions
    .filter((t) => t.status === 'Pending' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline">My Wallet</h1>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/wallet/top-up" className="block p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors">
            <div className="flex items-center justify-between font-semibold text-lg">
                <div className="flex items-center gap-4">
                    <Plus className="h-6 w-6 text-primary" />
                    <span>Wallet topup</span>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </div>
        </Link>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="transactions" className="border-none rounded-lg bg-secondary/50">
            <AccordionTrigger className="p-4 hover:no-underline font-semibold text-lg data-[state=open]:border-b">
              <div className="flex items-center gap-4">
                <List className="h-6 w-6 text-primary" />
                <span>Transactions</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-2">
                <TransactionList />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Card className="bg-secondary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-green-500">Main Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-500">{isClient ? `৳${balance.toFixed(2)}` : '৳0.00'}</div>
            <p className="text-sm text-muted-foreground mt-1">This is your current available balance for purchases.</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-yellow-500">Pending Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-500">{isClient ? `৳${pendingBalance.toFixed(2)}` : '৳0.00'}</div>
            <p className="text-sm text-muted-foreground mt-1">This is the amount from top-up requests that are pending approval.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
