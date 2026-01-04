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

export type CartItem = {
    id: number;
    quantity: number;
    product_id?: number;
    product: {
        id: number;
        name: string;
        price: string | number;
    };
};

export type Cart = {
    id: number;
    status: 'active' | 'ordered' | 'deleted' | string;
    created_at?: string;
    ordered_at?: string | null;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    items?: CartItem[];
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cart: Cart | null;
};

function statusBadge(status: string) {
    if (status === 'ordered') return <Badge>Ordered</Badge>;
    if (status === 'active') return <Badge variant="secondary">Active</Badge>;
    if (status === 'deleted')
        return <Badge variant="destructive">Deleted</Badge>;
    return <Badge variant="outline">{status}</Badge>;
}

function toNumber(v: string | number) {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
}

export function CartDetailsModal({ open, onOpenChange, cart }: Props) {
    const items = cart?.items ?? [];
    const total = items.reduce((sum, item) => {
        const price = toNumber(item.product.price);
        return sum + price * item.quantity;
    }, 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[720px]">
                <DialogHeader>
                    <DialogTitle>Cart Details</DialogTitle>
                    <DialogDescription>
                        Review items in the selected cart.
                    </DialogDescription>
                </DialogHeader>

                {!cart ? (
                    <div className="text-sm text-muted-foreground">
                        No cart selected.
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                    Cart
                                </div>
                                <div className="font-medium">#{cart.id}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                    Status
                                </div>
                                <div>{statusBadge(cart.status)}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                    User
                                </div>
                                <div className="font-medium">
                                    {cart.user
                                        ? `${cart.user.name} (${cart.user.email})`
                                        : '—'}
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
                                                <TableHead className="min-w-[240px]">
                                                    Product
                                                </TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Qty</TableHead>
                                                <TableHead className="text-right">
                                                    Subtotal
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items.map((item) => {
                                                const price = toNumber(
                                                    item.product.price,
                                                );
                                                const subtotal =
                                                    price * item.quantity;

                                                return (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">
                                                            {item.product.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.product.price}
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
                                    No items available for this cart (or items
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
