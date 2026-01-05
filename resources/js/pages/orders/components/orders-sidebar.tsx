import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import type { Order, Paginated } from '@/pages/orders/lib/types';

export function OrdersSidebar({ initial }: { initial: Paginated<Order> }) {
  const counts = useMemo(() => {
    return {
      total: initial.total ?? initial.data.length,
    };
  }, [initial]);

  return (
    <div className="sticky top-4 space-y-4">
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="text-sm font-medium">Order summary</div>
          <div className="text-xs text-muted-foreground">
            Snapshot of what's in this list.
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <Row label="All orders" value={counts.total} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="text-sm font-medium">Tip</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Scroll down to auto-load more orders. Open any order to see details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
