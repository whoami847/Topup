import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Archive } from 'lucide-react';

export default function AdminProductsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>Manage your store's products.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 text-center h-64">
            <Archive className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Product management is coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
