'use client';

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletForm } from "@/components/wallet-form";
import { TransactionList } from "@/components/transaction-list";
import { Plus, List } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function WalletPage() {
  const store = useAppStore();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const balance = store.balance;

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline">My Wallet</h1>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border-none rounded-lg bg-secondary/50">
            <AccordionTrigger className="p-4 hover:no-underline font-semibold text-lg data-[state=open]:border-b">
              <div className="flex items-center gap-4">
                <Plus className="h-6 w-6 text-primary" />
                <span>Wallet topup</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-2">
                <WalletForm />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-none rounded-lg bg-secondary/50">
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
      </div>
    </div>
  );
}
