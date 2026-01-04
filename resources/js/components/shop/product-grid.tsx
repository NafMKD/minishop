import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProductCard, type Product } from './product-card';
import { Cart } from '@/pages/admin/carts/components/cart-details-modal';

type Props = {
    products: Product[];
    isAuthenticated: boolean;
    nextUrl: string | null;
    activeCart: Cart | null;
    loadingMore: boolean;
    sentinelRef: React.RefObject<HTMLDivElement | null>;
    onLoadMore: () => void;
    onAddToCart?: (productId: number) => void;
};

export function ProductGrid({
    products,
    isAuthenticated,
    nextUrl,
    activeCart,
    loadingMore,
    sentinelRef,
    onLoadMore,
    onAddToCart,
}: Props) {
    return (
        <section className="mx-auto max-w-6xl px-4 py-10">
            <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                    <div className="text-lg font-semibold">Products</div>
                    <div className="text-sm text-muted-foreground">
                        Scroll to load more.
                    </div>
                </div>
            </div>

            <Separator className="mb-6" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => {
                    const isInActiveCart = (activeCart)  ? !!activeCart?.items?.some(
                        (item) => item.product_id === p.id,
                    ) : false;
                    return (
                        <ProductCard
                            key={p.id}
                            product={p}
                            isAuthenticated={isAuthenticated}
                            activeCart={isInActiveCart}
                            onAddToCart={onAddToCart}
                        />
                    );
                })}
            </div>

            <div ref={sentinelRef} className="h-10" />

            <div className="mt-6 flex items-center justify-center">
                {loadingMore ? (
                    <div className="text-sm text-muted-foreground">
                        Loading more…
                    </div>
                ) : nextUrl ? (
                    <Button variant="outline" onClick={onLoadMore}>
                        Load more
                    </Button>
                ) : (
                    <div className="text-sm text-muted-foreground">
                        You're all caught up.
                    </div>
                )}
            </div>
        </section>
    );
}
