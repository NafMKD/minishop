import { router } from '@inertiajs/react';

export type CartListParams = {
    search?: string;
    status?: string;
};

export function listCarts(url: string, params: CartListParams = {}) {
    router.get(
        url,
        {
            search: params.search || undefined,
            status:
                params.status && params.status !== 'all'
                    ? params.status
                    : undefined,
        },
        { preserveState: true, replace: true },
    );
}

export function goTo(url: string) {
    router.get(url, {}, { preserveState: true, replace: true });
}
