import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function OrderSummaryCard({
  totalItems,
  totalAmount,
  hasInvalidItems,
  onCheckout,
}: {
  totalItems: number;
  totalAmount: number;
  hasInvalidItems: boolean;
  onCheckout: () => void;
}) {
  return (
    <div className="rounded-3xl border bg-card p-5">
      <div className="text-sm font-semibold">Order summary</div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">Items</div>
          <div className="font-medium">{totalItems}</div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">Total</div>
          <div className="font-semibold">${totalAmount.toFixed(2)}</div>
        </div>

        <Separator />

        <Button
          className="w-full rounded-xl"
          disabled={hasInvalidItems}
          onClick={onCheckout}
        >
          Checkout
        </Button>

        {hasInvalidItems ? (
          <div className="text-sm text-destructive">
            Some items are out of stock or have invalid quantities. Fix them
            before checkout.
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            Checkout will create an order and mark the cart as ordered.
          </div>
        )}
      </div>
    </div>
  );
}
