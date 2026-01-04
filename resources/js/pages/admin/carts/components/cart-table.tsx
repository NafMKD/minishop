import { Badge } from '@/components/ui/badge';
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
import type { Cart } from './cart-details-modal';

type Props = {
    carts: Cart[];
    onView: (cart: Cart) => void;
};

function statusBadge(status: string) {
    if (status === 'ordered') return <Badge>Ordered</Badge>;
    if (status === 'active') return <Badge variant="secondary">Active</Badge>;
    if (status === 'deleted')
        return <Badge variant="destructive">Deleted</Badge>;
    return <Badge variant="outline">{status}</Badge>;
}

export function CartTable({ carts, onView }: Props) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead className="min-w-[220px]">Email</TableHead>
                        <TableHead className="w-[80px] text-right">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {carts.length ? (
                        carts.map((cart) => (
                            <TableRow key={cart.id}>
                                <TableCell className="font-medium">
                                    #{cart.id}
                                </TableCell>
                                <TableCell>
                                    {statusBadge(cart.status)}
                                </TableCell>
                                <TableCell>{cart.user?.name ?? '—'}</TableCell>
                                <TableCell>{cart.user?.email ?? '—'}</TableCell>

                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => onView(cart)}
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
                                colSpan={5}
                                className="py-10 text-center text-muted-foreground"
                            >
                                No carts found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
