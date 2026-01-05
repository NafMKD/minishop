import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { RecentOrder } from '../lib/types';
import { formatDate, money } from '@/pages/orders/lib/format';

export function RecentOrdersCard({ orders }: { orders: RecentOrder[] }) {
  return (
    <Card className="min-h-[420px]">
      <CardHeader>
        <CardTitle className="text-base">Recent orders</CardTitle>
        <div className="text-sm text-muted-foreground">
          Latest {orders.length} orders
        </div>
      </CardHeader>

      <CardContent>
        <div className="max-h-[520px] overflow-auto rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No recent orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{`#${o.id}`}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {o.customer_name ?? '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      {money(o.total_amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(o.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
