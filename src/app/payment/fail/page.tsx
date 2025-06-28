
'use client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const error = searchParams.get('error');

  let message = "Unfortunately, we were unable to process your payment. Your order has been marked as failed. Please try again or use a different payment method.";
  if (status === 'cancel') {
    message = "Your payment has been cancelled. You can try again anytime."
  }
  if (status === 'verificationfailed') {
    message = "Your payment could not be verified. Please contact support if the amount was debited from your account."
  }
  if (error) {
    message = "An unexpected error occurred. Please contact support for assistance."
  }

  return (
    <div className="container py-12 md:py-24">
      <Card className="max-w-lg mx-auto">
        <CardContent className="flex flex-col items-center justify-center gap-6 p-8 md:p-12 text-center">
          <XCircle className="h-20 w-20 text-destructive" />
          <h1 className="text-3xl font-bold">Payment Failed or Cancelled</h1>
          <p className="text-muted-foreground">
            {message}
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
