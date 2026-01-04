import { OrderSummaryCard } from './order-summary-card';

export function CartSidebar({
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
    <div className="space-y-4">
      <OrderSummaryCard
        totalItems={totalItems}
        totalAmount={totalAmount}
        hasInvalidItems={hasInvalidItems}
        onCheckout={onCheckout}
      />

      <div className="rounded-3xl border bg-muted/30 p-5">
        <div className="text-sm font-semibold">Tip</div>
        <div className="mt-1 text-sm text-muted-foreground">
          You can update quantities inline - changes are saved immediately.
        </div>
      </div>
    </div>
  );
}
