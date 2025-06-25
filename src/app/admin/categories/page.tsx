
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mainCategories } from '@/lib/products';

export default function AdminCategoriesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>Organize your products into categories.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead className="text-center">Sub-categories</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mainCategories.length > 0 ? (
              mainCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.title}</TableCell>
                  <TableCell className="text-center">{category.subCategorySlugs.length}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
