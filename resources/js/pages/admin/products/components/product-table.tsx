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

export type Product = {
    id: number;
    name: string;
    price: string | number;
    stock_quantity: number;
    low_stock_threshold: number | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    products: Product[];
    onEdit: (p: Product) => void;
    onDelete: (p: Product) => void;
};

export function ProductTable({ products, onEdit, onDelete }: Props) {
    const stockBadge = (p: Product) => {
        const threshold = p.low_stock_threshold ?? null;
        if (threshold !== null && p.stock_quantity <= threshold) {
            return <Badge variant="destructive">Low</Badge>;
        }
        return <Badge variant="secondary">OK</Badge>;
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[240px]">Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Threshold</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[60px] text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {products.length ? (
                        products.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell className="font-medium">
                                    {p.name}
                                </TableCell>
                                <TableCell>{p.price}</TableCell>
                                <TableCell>{p.stock_quantity}</TableCell>
                                <TableCell>
                                    {p.low_stock_threshold ?? '—'}
                                </TableCell>
                                <TableCell>{stockBadge(p)}</TableCell>

                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => onEdit(p)}
                                            >
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() => onDelete(p)}
                                            >
                                                Delete
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
                                No products found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
