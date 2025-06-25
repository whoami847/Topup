import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const transactions = [
  { id: "TXN12345", date: "2024-07-20", description: "Top-up: 100 Diamonds", amount: "$9.99", status: "Completed" },
  { id: "TXN12344", date: "2024-07-19", description: "Wallet Top-up", amount: "+$50.00", status: "Completed" },
  { id: "TXN12343", date: "2024-07-18", description: "Top-up: 50 Diamonds", amount: "$4.99", status: "Completed" },
  { id: "TXN12342", date: "2024-07-17", description: "Top-up: 200 Diamonds", amount: "$19.99", status: "Pending" },
  { id: "TXN12341", date: "2024-07-16", description: "Wallet Top-up", amount: "+$20.00", status: "Failed" },
];

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
    "Completed": "default",
    "Pending": "secondary",
    "Failed": "destructive",
};

export function TransactionList() {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium whitespace-nowrap">{transaction.date}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell className="text-right font-semibold">{transaction.amount}</TableCell>
              <TableCell className="text-center">
                <Badge variant={statusVariantMap[transaction.status] ?? 'default'}>
                  {transaction.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
