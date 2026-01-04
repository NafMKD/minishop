import type { CartItem } from './cart-item-card';
import { CartItemCard } from './cart-item-card';

export function CartItemsList({ items }: { items: CartItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
