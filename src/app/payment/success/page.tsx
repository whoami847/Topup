
'use client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="container py-12 md:py-24">
      <Card className="max-w-lg mx-auto bg-secondary/30">
        <CardContent className="flex flex-col items-center justify-center gap-6 p-8 md:p-12 text-center">
          <CheckCircle2 className="h-20 w-20 text-green-500" />
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase! Your top-up is being processed and will be delivered to your account shortly. You can check the status in your order history.
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="/orders" passHref>
              <Button size="lg">View My Orders</Button>
            </Link>
            <Link href="/" passHref>
              <Button size="lg" variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
