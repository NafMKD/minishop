import { Separator } from '@/components/ui/separator';
import { checkoutCart } from '@/pages/carts/lib/cart';
import { usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { CartHead } from '@/pages/carts/components/cart-head';
import { CartIntro } from '@/pages/carts/components/cart-intro';
import {
    type PageProps,
    toNumber,
} from '@/pages/carts/components/cart-item-card';
import { CartItemsList } from '@/pages/carts/components/cart-items-list';
import { CartLayout } from '@/pages/carts/components/cart-layout';
import { CartSidebar } from '@/pages/carts/components/cart-sidebar';
import { EmptyCartState } from '@/pages/carts/components/empty-cart-state';

import { SiteHeader } from '@/components/shop/site-header';
import {
    CheckoutConfirmModal,
    parseConfirm,
} from '@/pages/carts/components/checkout-confirm-modal';

export default function CartPage() {
    const { props } = usePage<PageProps>();
    const isAuthenticated = !!props.auth.user;
    const isAdmin = !!props.auth.user?.is_admin || null;
    const name = props.auth.user?.name || null;
    const active_cart = props.auth.user?.active_cart ? true : false;

    const cart = props.cart;
    const totalAmount = toNumber(props.total_price as string);
    const totalItems = toNumber(props.total_items as string);
    const items = useMemo(() => cart?.items ?? [], [cart?.items]);

    const hasInvalidItems = useMemo(() => {
        return items.some(
            (i) =>
                i.product.stock_quantity <= 0 ||
                i.quantity > i.product.stock_quantity ||
                i.quantity < 1,
        );
    }, [items]);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirm, setConfirm] = useState('');
    const confirmParsed = useMemo(() => parseConfirm(confirm), [confirm]);

    return (
        <>
            <CartHead />

            <div className="min-h-screen bg-background">
                <SiteHeader
                    isAuthenticated={isAuthenticated}
                    isAdmin={isAdmin}
                    canRegister={true}
                    name={name}
                    active_cart={active_cart}
                />

                <main className="mx-auto max-w-6xl px-4 py-8">
                    <CartIntro
                        totalItems={totalItems}
                        totalAmount={totalAmount}
                    />

                    <Separator className="mb-6" />

                    {!cart || items.length === 0 ? (
                        <EmptyCartState />
                    ) : (
                        <CartLayout
                            items={<CartItemsList items={items} />}
                            summary={
                                <CartSidebar
                                    totalItems={totalItems}
                                    totalAmount={totalAmount}
                                    hasInvalidItems={hasInvalidItems}
                                    onCheckout={() => {
                                        setConfirmOpen(true);
                                        setConfirm('');
                                    }}
                                />
                            }
                        />
                    )}
                </main>

                <CheckoutConfirmModal
                    open={confirmOpen}
                    confirm={confirm}
                    onConfirmChange={setConfirm}
                    confirmParsed={confirmParsed}
                    hasInvalidItems={hasInvalidItems}
                    onCancel={() => setConfirmOpen(false)}
                    onPlaceOrder={() => {
                        setConfirmOpen(false);
                        checkoutCart();
                    }}
                />
            </div>
        </>
    );
}
