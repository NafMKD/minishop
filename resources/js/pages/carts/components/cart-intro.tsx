import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export function CartIntro({
  totalItems,
  totalAmount,
}: {
  totalItems: number;
  totalAmount: number;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Your Cart</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review items, update quantities, then checkout.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="secondary">{totalItems} items</Badge>
        <div className="text-lg font-semibold">${totalAmount.toFixed(2)}</div>
      </div>
    </div>
  );
}
