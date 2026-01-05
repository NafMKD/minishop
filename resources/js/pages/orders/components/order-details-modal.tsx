import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

import type { Order } from '@/pages/orders/lib/types';
import { formatDate, money, toNumber } from '../lib/format';

export function OrderDetailsModal({
  open,
  onOpenChange,
  order,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}) {
  if (!order) return null;

  const itemsTotal = (order.items ?? []).reduce((acc, it) => {
    return acc + toNumber(it.unit_price) * toNumber(it.quantity);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            <span>
              Order {order.number ? `#${order.number}` : `#${order.id}`}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="rounded-lg border bg-card p-3 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <div>
                <span className="text-muted-foreground">Placed: </span>
                <span className="font-medium">{formatDate(order.created_at) || '—'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Items: </span>
                <span className="font-medium">{order.items?.length ?? 0}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total: </span>
                <span className="font-medium">{money(order.total_amount)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="p-3 text-sm font-medium">Items</div>
            <Separator />
            <div className="max-h-[50vh] overflow-auto">
              {(order.items ?? []).map((it) => (
                <div key={it.id} className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {it.product?.name ?? 'Item'}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Qty: <span className="text-foreground font-medium">{it.quantity}</span>
                        <span className="mx-2">•</span>
                        Unit: <span className="text-foreground font-medium">{money(it.unit_price)}</span>
                      </div>
                    </div>

                    <div className="text-sm font-medium">
                      {money(toNumber(it.unit_price) * toNumber(it.quantity))}
                    </div>
                  </div>
                  <Separator className="mt-3" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              Calculated items total:
            </div>
            <div className="font-medium">{money(itemsTotal)}</div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
