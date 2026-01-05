import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Cart } from '@/pages/admin/carts/components/cart-details-modal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard, type Product } from './product-card';

type Props = {
    products: Product[];
    isAuthenticated: boolean;
    nextUrl: string | null;
    prevUrl: string | null;
    activeCart: Cart | null;
    loading: boolean;
    onNext: () => void;
    onPrev: () => void;
    onAddToCart?: (productId: number) => void;
};

function Pager({
    prevUrl,
    nextUrl,
    loading,
    onPrev,
    onNext,
}: {
    prevUrl: string | null;
    nextUrl: string | null;
    loading: boolean;
    onPrev: () => void;
    onNext: () => void;
}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <Button
                type="button"
                variant="outline"
                disabled={!prevUrl || loading}
                onClick={onPrev}
            >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
            </Button>

            <div className="text-sm text-muted-foreground">
                {loading ? 'Loading…' : ' '}
            </div>

            <Button
                type="button"
                variant="outline"
                disabled={!nextUrl || loading}
                onClick={onNext}
            >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    );
}

export function ProductGrid({
    products,
    isAuthenticated,
    nextUrl,
    prevUrl,
    activeCart,
    loading,
    onNext,
    onPrev,
    onAddToCart,
}: Props) {
    return (
        <section className="mx-auto max-w-6xl px-4 py-10">
            <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                    <div className="text-lg font-semibold">Products</div>
                    <div className="text-sm text-muted-foreground">
                        Use Next/Previous to navigate.
                    </div>
                </div>
            </div>

            <Pager
                prevUrl={prevUrl}
                nextUrl={nextUrl}
                loading={loading}
                onPrev={onPrev}
                onNext={onNext}
            />

            <Separator className="my-6" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => {
                    const isInActiveCart = activeCart
                        ? !!activeCart?.items?.some(
                              (item) => item.product_id === p.id,
                          )
                        : false;

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

            <Separator className="my-6" />

            <Pager
                prevUrl={prevUrl}
                nextUrl={nextUrl}
                loading={loading}
                onPrev={onPrev}
                onNext={onNext}
            />
        </section>
    );
}
