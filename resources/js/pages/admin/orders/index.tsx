import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import {
    OrderDetailsModal,
    type Order,
} from '@/pages/admin/orders/components/order-details-modal';
import {
    OrderPagination,
    type PaginationLink,
} from '@/pages/admin/orders/components/order-pagination';
import { OrderSearchBar } from '@/pages/admin/orders/components/order-search-bar';
import { OrderTable } from '@/pages/admin/orders/components/order-table';

import { listOrders } from '@/pages/admin/orders/lib/orders';
import { goTo } from '../carts/lib/carts';

type PageProps = {
    orders: {
        data: Order[];
        links: PaginationLink[];
        meta?: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filters?: {
        search?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Orders', href: '/admin/orders' },
];

export default function Index() {
    const { props } = usePage<PageProps>();
    const paginated = props.orders;

    const [search, setSearch] = useState(props.filters?.search ?? '');

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const meta = paginated.meta;

    const minimalLinks = useMemo(() => {
        const links = paginated.links ?? [];
        if (!links.length) return [];

        const prev = links[0];
        const next = links[links.length - 1];
        const numeric = links.filter((l) => /^\d+$/.test(l.label));
        const firstPage = numeric[0];
        const lastPage = numeric[numeric.length - 1];

        const out = [prev, firstPage];
        if (lastPage && firstPage?.label !== lastPage.label) out.push(lastPage);
        out.push(next);

        return out.filter(Boolean);
    }, [paginated.links]);

    const showingText = useMemo(() => {
        if (!meta) return null;
        const from = (meta.current_page - 1) * meta.per_page + 1;
        const to = from + paginated.data.length - 1;
        return `Showing ${from}-${to} of ${meta.total}`;
    }, [meta, paginated.data.length]);

    const handleSearch = () => {
        listOrders('/admin/orders', { search });
    };

    const handleReset = () => {
        setSearch('');
        listOrders('/admin/orders', {});
    };

    const onView = (order: Order) => {
        setSelectedOrder(order);
        setDetailsOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <div className="text-xl font-semibold">Orders</div>
                    {showingText ? (
                        <div className="text-sm text-muted-foreground">
                            {showingText}
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-col gap-3 rounded-xl border p-4">
                    <OrderSearchBar
                        value={search}
                        onChange={setSearch}
                        onSubmit={handleSearch}
                        onReset={handleReset}
                    />

                    <OrderTable orders={paginated.data} onView={onView} />
                    <hr />
                    {paginated.links?.length ? (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-muted-foreground">
                                {meta
                                    ? `Page ${meta.current_page} of ${meta.last_page}`
                                    : null}
                            </div>

                            <OrderPagination
                                links={minimalLinks}
                                onNavigate={(url) => goTo(url)}
                            />
                        </div>
                    ) : null}
                </div>

                <OrderDetailsModal
                    open={detailsOpen}
                    onOpenChange={(open) => {
                        setDetailsOpen(open);
                        if (!open) setSelectedOrder(null);
                    }}
                    order={selectedOrder}
                />
            </div>
        </AppLayout>
    );
}
