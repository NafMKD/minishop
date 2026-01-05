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
    const current = new URL(window.location.href);
    const target = new URL(url, window.location.origin);

    const merged = new URLSearchParams(current.search);

    target.searchParams.forEach((value, key) => {
        merged.set(key, value);
    });

    target.search = merged.toString();

    router.get(target.toString(), {}, { preserveState: true, replace: true });
}