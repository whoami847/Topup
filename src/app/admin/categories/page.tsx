import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Grid } from 'lucide-react';

export default function AdminCategoriesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>Organize your products into categories.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 text-center h-64">
            <Grid className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Category management is coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
