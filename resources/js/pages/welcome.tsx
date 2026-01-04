import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

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
    };
    filters?: {
        search?: string;
    };
};

interface PaginatedProducts {
    data: Product[];
    next_page_url: string | null;
}

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
    const active_cart = props.auth.user?.active_cart ? (props.auth.user?.active_cart as ActiveCart).items?.length : null;
    
    const [search, setSearch] = useState(props.filters?.search ?? '');
    const [items, setItems] = useState<Product[]>(props.products?.data ?? []);
    const [nextUrl, setNextUrl] = useState<string | null>(
        props.products?.next_page_url ?? null,
    );
    const [loadingMore, setLoadingMore] = useState(false);
    const activeCart = props.auth.user?.active_cart || null;

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setItems(props.products?.data ?? []);
        setNextUrl(props.products?.next_page_url ?? null);
        setLoadingMore(false);
    }, [props.products?.data, props.products?.next_page_url]);

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

    const loadMore = () => {
        if (!nextUrl || loadingMore) return;

        setLoadingMore(true);

        router.get(
            nextUrl,
            {},
            {
                preserveState: true,
                replace: true,
                only: ['products', 'filters'],
                onSuccess: (page) => {
                    const products = (page.props.products ?? undefined) as
                        | PaginatedProducts
                        | undefined;
                    if (!products) return;

                    setItems((prev) => [...prev, ...products.data]);
                    setNextUrl(products.next_page_url);
                },
                onFinish: () => setLoadingMore(false),
            },
        );
    };

    const handleAddToCart = (productId: number) => {
        router.post(`/carts/${productId}`, { quantity: 1 });
    };

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) loadMore();
            },
            { root: null, rootMargin: '200px', threshold: 0.1 },
        );

        observer.observe(el);
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sentinelRef.current, nextUrl, loadingMore]);

    return (
        <>
            <Head title="Shop">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

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

                <ProductGrid
                    products={items}
                    isAuthenticated={isAuthenticated}
                    nextUrl={nextUrl}
                    activeCart={activeCart as Cart | null}
                    loadingMore={loadingMore}
                    sentinelRef={sentinelRef}
                    onLoadMore={loadMore}
                    onAddToCart={handleAddToCart}
                />

                <SiteFooter />
            </div>
        </>
    );
}
