import { router } from '@inertiajs/react';

export type ProductPayload = {
    name: string;
    price: string;
    stock_quantity: string;
    low_stock_threshold?: string;
    images?: File[];
};

export type ListParams = {
    search?: string;
};

export function listProducts(url: string, params: ListParams = {}) {
    router.get(
        url,
        { search: params.search || undefined },
        { preserveState: true, replace: true },
    );
}

export function createProduct(payload: ProductPayload) {
    router.post('/admin/products', payload, {
        preserveScroll: true,
        forceFormData: true,
    });
}

export function updateProduct(productId: number, payload: ProductPayload) {
    router.post(
        `/admin/products/${productId}`,
        { ...payload, _method: 'put' },
        {
            preserveScroll: true,
            forceFormData: true,
        },
    );
}

export function deleteProduct(productId: number) {
    router.delete(`/admin/products/${productId}`, {
        preserveScroll: true,
    });
}