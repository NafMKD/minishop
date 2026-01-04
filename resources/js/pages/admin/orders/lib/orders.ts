import { router } from '@inertiajs/react';

export type OrderListParams = {
    search?: string;
};

export function listOrders(url: string, params: OrderListParams = {}) {
    router.get(
        url,
        { search: params.search || undefined },
        { preserveState: true, replace: true },
    );
}

export function goTo(url: string) {
    router.get(url, {}, { preserveState: true, replace: true });
}
