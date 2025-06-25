import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default function AdminProductPricesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Prices</CardTitle>
        <CardDescription>Manage the pricing for your products.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 text-center h-64">
            <DollarSign className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Price management is coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
