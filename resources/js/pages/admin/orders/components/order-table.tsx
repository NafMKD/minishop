import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import type { Order } from './order-details-modal';
import { formatDate } from '@/pages/orders/lib/format';

type Props = {
    orders: Order[];
    onView: (order: Order) => void;
};

export function OrderTable({ orders, onView }: Props) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[110px]">ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead className="min-w-[240px]">Email</TableHead>
                        <TableHead className="w-[130px]">Total</TableHead>
                        <TableHead className="w-[120px]">Created</TableHead>
                        <TableHead className="w-[80px] text-right">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {orders.length ? (
                        orders.map((o) => (
                            <TableRow key={o.id}>
                                <TableCell className="font-medium">
                                    #{o.id}
                                </TableCell>
                                <TableCell>{o.user?.name ?? '—'}</TableCell>
                                <TableCell>{o.user?.email ?? '—'}</TableCell>
                                <TableCell>{o.total_amount ?? '—'}</TableCell>
                                <TableCell>{formatDate(o.created_at) ?? '—'}</TableCell>

                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => onView(o)}
                                            >
                                                View
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="py-10 text-center text-muted-foreground"
                            >
                                No orders found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
