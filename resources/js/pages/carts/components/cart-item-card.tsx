import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { removeCartItem, updateCartItemQuantity } from '@/pages/carts/lib/cart';
import { Trash2 } from 'lucide-react';
import { SharedData } from '@/types';
import { Product } from '@/components/shop/product-card';

export type CartItem = {
  id: number;
  quantity: number;
  product: Product;
};

export type PageProps = SharedData & {
    cart: { id: number; status: string; items: CartItem[] } | null;
};

export function toNumber(v: string | number) {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function CartItemCard({ item }: { item: CartItem }) {
  const price = toNumber(item.product.price);
  const subtotal = price * item.quantity;

  const outOfStock = item.product.stock_quantity <= 0;
  const maxQty = Math.max(1, item.product.stock_quantity);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string>(''); 

  const displayValue = useMemo(() => {
    return isEditing ? draft : String(item.quantity);
  }, [isEditing, draft, item.quantity]);

  const commit = useCallback(
    async (nextQty: number) => {
      if (outOfStock) return;
      if (nextQty < 1) return;
      const safeQty = clamp(nextQty, 1, maxQty);
      if (safeQty === item.quantity) return;

      try {
        await updateCartItemQuantity(item.id, safeQty);
      } catch {
        //  toast 
      }
    },
    [outOfStock, maxQty, item.id, item.quantity]
  );

  const onFocus = () => {
    if (outOfStock) return;
    setIsEditing(true);
    setDraft(String(item.quantity)); 
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (raw === '') {
      setDraft('');
      return;
    }

    if (!/^\d+$/.test(raw)) return;

    const n = clamp(parseInt(raw, 10), 1, maxQty);
    setDraft(String(n));
  };

  const onBlur = async () => {
    const n = draft === '' ? 1 : parseInt(draft, 10);
    await commit(Number.isFinite(n) ? n : 1);

    setIsEditing(false);
    setDraft('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.currentTarget as HTMLInputElement).blur();
    }
    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
      e.preventDefault();
    }
  };

  return (
    <div className="rounded-3xl border bg-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-2xl bg-muted">
            {item.product.images  ? (
              <img
                src={`storage/${item.product.images[0].path}`}
                alt={item.product.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="font-semibold">{item.product.name}</div>
            <div className="text-sm text-muted-foreground">
              ${price.toFixed(2)} • Stock: {item.product.stock_quantity}
            </div>

            {outOfStock ? (
              <div className="text-xs font-medium text-destructive">
                Out of stock - please remove this item.
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="text-sm text-muted-foreground">Subtotal</div>
          <div className="text-lg font-semibold">${subtotal.toFixed(2)}</div>

          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="number"
              value={displayValue}
              onFocus={onFocus}
              onChange={onChange}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              className="w-28"
              inputMode="numeric"
              min={1}
              max={maxQty}
              step={1}
              disabled={outOfStock}
            />

            <Button
                type="button"
              variant="destructive"
              onClick={() => removeCartItem(item.id)}
              className="rounded-xl"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Qty must be between 1 and {item.product.stock_quantity}.
          </div>
        </div>
      </div>
    </div>
  );
}
