import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';

const confirmSchema = z.object({
  confirm: z.string().refine((val) => val === 'CONFIRM', {
    message: 'Type CONFIRM to place the order.',
  }),
});

export type ConfirmParsed = ReturnType<typeof confirmSchema.safeParse>;

export function CheckoutConfirmModal({
  open,
  confirm,
  onConfirmChange,
  confirmParsed,
  hasInvalidItems,
  onCancel,
  onPlaceOrder,
}: {
  open: boolean;
  confirm: string;
  onConfirmChange: (v: string) => void;
  confirmParsed: ConfirmParsed;
  hasInvalidItems: boolean;
  onCancel: () => void;
  onPlaceOrder: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl border bg-background p-5 shadow-lg">
        <div className="text-lg font-semibold">Confirm checkout</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Type <span className="font-medium">CONFIRM</span> to place your order.
        </div>

        <div className="mt-4 space-y-2">
          <Input
            value={confirm}
            onChange={(e) => onConfirmChange(e.target.value)}
            placeholder="CONFIRM"
          />
          {!confirmParsed.success ? (
            <div className="text-sm text-destructive">
              {confirmParsed.error.issues[0]?.message}
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            disabled={!confirmParsed.success || hasInvalidItems}
            onClick={onPlaceOrder}
          >
            Place order
          </Button>
        </div>
      </div>
    </div>
  );
}

export function parseConfirm(confirm: string) {
  return confirmSchema.safeParse({ confirm });
}
