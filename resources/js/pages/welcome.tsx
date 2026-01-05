import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

import { HeroSearch } from '@/components/shop/hero-search';
import type { Product } from '@/components/shop/product-card';
import { ProductGrid } from '@/components/shop/product-grid';
import { SiteFooter } from '@/components/shop/site-footer';
import { SiteHeader } from '@/components/shop/site-header';
import { Cart } from './admin/carts/components/cart-details-modal';
import { CartItem } from './carts/components/cart-item-card';

type PageProps = SharedData & {
    products: {
        data: Product[];
        next_page_url: string | null;
        prev_page_url: string | null;
        current_page?: number;
        last_page?: number;
    };
    filters?: { search?: string };
};

export interface ActiveCart {
    items: CartItem[];
}

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { props } = usePage<PageProps>();

    const isAuthenticated = !!props.auth.user;
    const isAdmin = !!props.auth.user?.is_admin || null;
    const name = props.auth.user?.name || null;
    const active_cart = props.auth.user?.active_cart
        ? (props.auth.user?.active_cart as ActiveCart).items?.length
        : null;

    const [search, setSearch] = useState(props.filters?.search ?? '');
    const [loading, setLoading] = useState(false);

    const listTopRef = useRef<HTMLDivElement | null>(null);

    const activeCart = props.auth.user?.active_cart || null;

    const items = props.products?.data ?? [];
    const nextUrl = props.products?.next_page_url ?? null;
    const prevUrl = props.products?.prev_page_url ?? null;

    const handleSearch = () => {
        router.get(
            '/',
            { search: search || undefined },
            { preserveState: false, replace: true },
        );
    };

    const handleReset = () => {
        setSearch('');
        router.get('/', {}, { preserveState: false, replace: true });
    };

    const goTo = (url: string | null) => {
        if (!url || loading) return;

        setLoading(true);

        router.get(
            url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['products', 'filters'],
                onSuccess: () => {
                    listTopRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                },
                onFinish: () => setLoading(false),
            },
        );
    };

    const handleAddToCart = (productId: number) => {
        router.post(`/carts/${productId}`, { quantity: 1 });
    };

    return (
        <>
            <Head title="Shop" />

            <div className="min-h-screen bg-background">
                <SiteHeader
                    isAuthenticated={isAuthenticated}
                    isAdmin={isAdmin}
                    canRegister={canRegister}
                    name={name}
                    active_cart={active_cart}
                />

                <HeroSearch
                    search={search}
                    onChangeSearch={setSearch}
                    onSearch={handleSearch}
                    onReset={handleReset}
                />

                <div ref={listTopRef} />

                <ProductGrid
                    products={items}
                    isAuthenticated={isAuthenticated}
                    isAdmin={isAdmin}
                    nextUrl={nextUrl}
                    prevUrl={prevUrl}
                    activeCart={activeCart as Cart | null}
                    loading={loading}
                    onNext={() => goTo(nextUrl)}
                    onPrev={() => goTo(prevUrl)}
                    onAddToCart={handleAddToCart}
                />

                <SiteFooter />
            </div>
        </>
    );
}
