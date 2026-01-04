import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import {
    CartDetailsModal,
    type Cart,
} from '@/pages/admin/carts/components/cart-details-modal';
import { CartFiltersBar } from '@/pages/admin/carts/components/cart-filters-bar';
import {
    CartPagination,
    type PaginationLink,
} from '@/pages/admin/carts/components/cart-pagination';
import { CartTable } from '@/pages/admin/carts/components/cart-table';

import { goTo, listCarts } from '@/pages/admin/carts/lib/carts';

type PageProps = {
    carts: {
        data: Cart[];
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
        status?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Carts', href: '/admin/carts' },
];

export default function Index() {
    const { props } = usePage<PageProps>();
    const paginated = props.carts;

    const [search, setSearch] = useState(props.filters?.search ?? '');
    const [status, setStatus] = useState(props.filters?.status ?? 'all');

    const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const meta = paginated.meta;    

    const showingText = useMemo(() => {
        if (!meta) return null;
        const from = (meta.current_page - 1) * meta.per_page + 1;
        const to = from + paginated.data.length - 1;
        return `Showing ${from}-${to} of ${meta.total}`;
    }, [meta, paginated.data.length]);

    const handleApply = () => {
        listCarts('/admin/carts', { search, status });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        listCarts('/admin/carts', {});
    };

    const onView = (cart: Cart) => {
        setSelectedCart(cart);
        setDetailsOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Carts" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <div className="text-xl font-semibold">Carts</div>
                    {showingText ? (
                        <div className="text-sm text-muted-foreground">
                            {showingText}
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-col gap-3 rounded-xl border p-4">
                    <CartFiltersBar
                        search={search}
                        status={status}
                        onChangeSearch={setSearch}
                        onChangeStatus={setStatus}
                        onSubmit={handleApply}
                        onReset={handleReset}
                    />

                    <CartTable carts={paginated.data} onView={onView} />
                    <hr />
                    {paginated.links?.length ? (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-muted-foreground">
                                {meta
                                    ? `Page ${meta.current_page} of ${meta.last_page}`
                                    : null}
                            </div>

                            <CartPagination
                                links={paginated.links}
                                onNavigate={(url) => goTo(url)}
                            />
                        </div>
                    ) : null}
                </div>

                <CartDetailsModal
                    open={detailsOpen}
                    onOpenChange={(open) => {
                        setDetailsOpen(open);
                        if (!open) setSelectedCart(null);
                    }}
                    cart={selectedCart}
                />
            </div>
        </AppLayout>
    );
}
