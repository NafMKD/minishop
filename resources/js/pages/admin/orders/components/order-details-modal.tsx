import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export type OrderItem = {
    id: number;
    quantity: number;
    unit_price: string | number;
    product: {
        name: string;
    };
};

export type Order = {
    id: number;
    cart_id?: number | null;
    total_amount?: string | number | null;
    created_at?: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    items?: OrderItem[];
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order | null;
};

function toNumber(v: string | number | null | undefined) {
    const n = typeof v === 'number' ? v : Number(v ?? 0);
    return Number.isFinite(n) ? n : 0;
}

export function OrderDetailsModal({ open, onOpenChange, order }: Props) {
    const items = order?.items ?? [];

    const computedTotal = items.reduce((sum, item) => {
        const price = toNumber(item.unit_price);
        return sum + price * item.quantity;
    }, 0);

    const total =
        order?.total_amount != null
            ? toNumber(order.total_amount)
            : computedTotal;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[760px]">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        Review items in the selected order.
                    </DialogDescription>
                </DialogHeader>

                {!order ? (
                    <div className="text-sm text-muted-foreground">
                        No order selected.
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                    Order
                                </div>
                                <div className="font-medium">#{order.id}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                    User
                                </div>
                                <div className="font-medium">
                                    {order.user
                                        ? `${order.user.name} (${order.user.email})`
                                        : '—'}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                    Cart ID
                                </div>
                                <div className="font-medium">
                                    {order.cart_id ?? '—'}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                    Total
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">
                                        {total.toFixed(2)}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border">
                            <div className="border-b px-4 py-3 font-medium">
                                Items
                            </div>

                            {items.length ? (
                                <div className="overflow-x-auto p-2">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="min-w-[260px]">
                                                    Product
                                                </TableHead>
                                                <TableHead>
                                                    Unit Price
                                                </TableHead>
                                                <TableHead>Qty</TableHead>
                                                <TableHead className="text-right">
                                                    Subtotal
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {items.map((item) => {
                                                const price = toNumber(
                                                    item.unit_price,
                                                );
                                                const subtotal =
                                                    price * item.quantity;

                                                return (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">
                                                            {item.product
                                                                ?.name ?? '—'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.unit_price}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.quantity}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {subtotal.toFixed(
                                                                2,
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}

                                            <TableRow>
                                                <TableCell
                                                    colSpan={3}
                                                    className="text-right font-medium"
                                                >
                                                    Total
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {total.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="p-4 text-sm text-muted-foreground">
                                    No items available for this order (or items
                                    not loaded by backend).
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
