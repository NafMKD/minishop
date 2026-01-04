import { Button } from '@/components/ui/button';

export type ProductImage = {
    id: number;
    path: string;
};

export type Product = {
    id: number;
    name: string;
    price: string | number;
    stock_quantity: number;
    images?: ProductImage[];
    image?: ProductImage;
};

function toNumber(v: string | number) {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
}

type Props = {
    product: Product;
    isAuthenticated: boolean;
    onAddToCart?: (productId: number) => void;
};

export function ProductCard({ product, isAuthenticated, onAddToCart }: Props) {
    const price = toNumber(product.price).toFixed(2);
    const imgUrl = product.images
        ? product.images?.[0]?.path
        : product.image?.path || null;

    return (
        <div className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                {imgUrl ? (
                    <img
                        src={imgUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        No image
                    </div>
                )}

                {product.stock_quantity <= 0 ? (
                    <div className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">
                        Out of stock
                    </div>
                ) : null}
            </div>

            <div className="space-y-2 p-4">
                <div className="line-clamp-1 text-sm font-semibold">
                    {product.name}
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">${price}</div>
                    <div className="text-xs text-muted-foreground">
                        Stock: {product.stock_quantity}
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        className="w-full rounded-xl"
                        disabled={
                            product.stock_quantity <= 0 || !isAuthenticated
                        }
                        onClick={() => onAddToCart?.(product.id)}
                    >
                        {isAuthenticated ? 'Add to cart' : 'Login to add'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
