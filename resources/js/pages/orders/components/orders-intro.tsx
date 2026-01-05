import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export function OrdersIntro({ totalOrders }: { totalOrders: number }) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Your orders</h1>
        <p className="text-sm text-muted-foreground">
          Track delivery, view invoices, and reorder your favorites.
        </p>
      </div>

      <div className="rounded-lg border bg-card px-3 py-2 text-sm">
        <span className="text-muted-foreground">Total:</span>{' '}
        <span className="font-medium">{totalOrders}</span>
      </div>
    </div>
  );
}
