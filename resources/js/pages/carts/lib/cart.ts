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

export function checkoutCart() {
    router.post(`/carts/checkout`, {}, { preserveScroll: true });
}
