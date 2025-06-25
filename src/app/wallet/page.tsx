'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletForm } from "@/components/wallet-form";
import { TransactionList } from "@/components/transaction-list";
import { DollarSign } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function WalletPage() {
  const store = useAppStore();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const balance = store.balance;

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8 font-headline">My Wallet</h1>
      <div className="grid md:grid-cols-1 gap-8 mb-12 max-w-md mx-auto">
        <Card className="bg-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Main Balance</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isClient ? `৳${balance.toFixed(2)}` : '৳0.00'}</div>
            <p className="text-xs text-muted-foreground">Available for immediate use</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4 font-headline">Top Up Wallet</h2>
          <Card>
            <CardContent className="pt-6">
              <WalletForm />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 font-headline">Transaction History</h2>
          <TransactionList />
        </div>
      </div>
    </div>
  );
}
