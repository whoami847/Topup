
'use client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailPage() {
  return (
    <div className="container py-12 md:py-24">
      <Card className="max-w-lg mx-auto">
        <CardContent className="flex flex-col items-center justify-center gap-6 p-8 md:p-12 text-center">
          <XCircle className="h-20 w-20 text-destructive" />
          <h1 className="text-3xl font-bold">Payment Failed</h1>
          <p className="text-muted-foreground">
            Unfortunately, we were unable to process your payment. Your order has been cancelled. Please try again or use a different payment method.
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="/" passHref>
              <Button size="lg">Back to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
