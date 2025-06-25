import { WalletTopUpForm } from '@/components/wallet-top-up-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WalletTopUpPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-md mx-auto">
        <Card className="bg-card">
            <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold font-headline text-center">Wallet Topup</CardTitle>
            </CardHeader>
            <CardContent>
                <WalletTopUpForm />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
