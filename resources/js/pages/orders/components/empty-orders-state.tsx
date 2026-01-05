import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export function EmptyOrdersState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-lg font-semibold">No orders yet</div>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          When you place an order, it’ll show up here with status updates and item details.
        </p>
        <div className="mt-5 flex gap-2">
          <Button asChild>
            <Link href="/shop">Start shopping</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/cart">Go to cart</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
