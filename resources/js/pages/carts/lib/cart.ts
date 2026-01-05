import { router } from '@inertiajs/react';

export function updateCartItemQuantity(itemId: number, quantity: number) {
    router.put(
        `/carts/items/${itemId}`,
        { quantity },
        { preserveScroll: true, preserveState: true },
    );
}

export function removeCartItem(itemId: number) {
    router.delete(`/carts/items/${itemId}`, {
        preserveScroll: true,
        preserveState: true,
    });
}

export function checkoutCart(cart_id: number) {
    router.post(`/carts/checkout/${cart_id}`, {}, { preserveScroll: true });
}
