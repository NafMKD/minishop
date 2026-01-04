import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

export function EmptyCartState() {
  return (
    <div className="rounded-3xl border bg-card p-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border bg-muted">
        <ShoppingCart className="h-5 w-5" />
      </div>
      <div className="text-lg font-semibold">Your cart is empty</div>
      <div className="mt-1 text-sm text-muted-foreground">
        Add a few products and they'll show up here.
      </div>
      <div className="mt-6">
        <Button asChild className="rounded-xl">
          <Link href="/">Browse products</Link>
        </Button>
      </div>
    </div>
  );
}
