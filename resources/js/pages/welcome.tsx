import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

import { HeroSearch } from '@/components/shop/hero-search';
import type { Product } from '@/components/shop/product-card';
import { ProductGrid } from '@/components/shop/product-grid';
import { SiteFooter } from '@/components/shop/site-footer';
import { SiteHeader } from '@/components/shop/site-header';

type PageProps = SharedData & {
    products: {
        data: Product[];
        next_page_url: string | null;
    };
    filters?: {
        search?: string;
    };
};

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { props } = usePage<PageProps>();
    const isAuthenticated = !!props.auth.user;

    const [search, setSearch] = useState(props.filters?.search ?? '');
    const [items, setItems] = useState<Product[]>(props.products?.data ?? []);
    const [nextUrl, setNextUrl] = useState<string | null>(
        props.products?.next_page_url ?? null,
    );
    const [loadingMore, setLoadingMore] = useState(false);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // when server returns new props (search change), reset list
        setItems(props.products?.data ?? []);
        setNextUrl(props.products?.next_page_url ?? null);
        setLoadingMore(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    const p = (page.props as any).products;
                    setItems((prev) => [...prev, ...(p?.data ?? [])]);
                    setNextUrl(p?.next_page_url ?? null);
                },
                onFinish: () => setLoadingMore(false),
            },
        );
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
                    canRegister={canRegister}
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
                    loadingMore={loadingMore}
                    sentinelRef={sentinelRef}
                    onLoadMore={loadMore}
                    onAddToCart={(productId) => {
                        // wire later: router.post('/cart/items', { product_id: productId, quantity: 1 })
                    }}
                />

                <SiteFooter />
            </div>
        </>
    );
}
