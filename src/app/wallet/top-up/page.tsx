
import { WalletTopUpForm } from '@/components/wallet-top-up-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WalletTopUpPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold font-headline text-center">Manual Wallet Top-up</CardTitle>
          </CardHeader>
          <CardContent>
            <WalletTopUpForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
