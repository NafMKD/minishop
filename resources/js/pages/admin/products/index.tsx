import AppLayout from '@/layouts/app-layout';
import { products } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { ProductFormDialog } from '@/pages/admin/products/components/product-form-dialog';
import {
    ProductPagination,
    type PaginationLink,
} from '@/pages/admin/products/components/product-pagination';
import { ProductSearchBar } from '@/pages/admin/products/components/product-search-bar';
import {
    ProductTable,
    type Product,
} from '@/pages/admin/products/components/product-table';

import {
    createProduct,
    deleteProduct,
    listProducts,
    updateProduct,
    type ProductPayload,
} from '@/pages/admin/products/lib/products';
import { goTo } from '../carts/lib/carts';

type PageProps = {
    products: {
        data: Product[];
        links: PaginationLink[];
        meta?: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filters?: {
        search?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: products().url,
    },
];

export default function Index() {
    const { props } = usePage<PageProps>();
    const paginated = props.products;

    const [searchValue, setSearchValue] = useState(props.filters?.search ?? '');

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const meta = paginated.meta;

    const minimalLinks = useMemo(() => {
        const links = paginated.links ?? [];
        if (!links.length) return [];

        const prev = links[0];
        const next = links[links.length - 1];
        const numeric = links.filter((l) => /^\d+$/.test(l.label));
        const firstPage = numeric[0];
        const lastPage = numeric[numeric.length - 1];

        const out = [prev, firstPage];
        if (lastPage && firstPage?.label !== lastPage.label) out.push(lastPage);
        out.push(next);

        return out.filter(Boolean);
    }, [paginated.links]);

    const showingText = useMemo(() => {
        if (!meta) return null;
        const from = (meta.current_page - 1) * meta.per_page + 1;
        const to = from + paginated.data.length - 1;
        return `Showing ${from}-${to} of ${meta.total}`;
    }, [meta, paginated.data.length]);

    const handleSearch = () => {
        listProducts(products().url, { search: searchValue });
    };

    const handleReset = () => {
        setSearchValue('');
        listProducts(products().url, {});
    };

    const handleCreate = (data: ProductPayload) => {
        createProduct(data);
        setCreateOpen(false);
    };

    const handleEdit = (data: ProductPayload) => {
        if (!editProduct) return;
        updateProduct(editProduct.id, data);
        setEditOpen(false);
        setEditProduct(null);
    };

    const onEditRow = (p: Product) => {
        setEditProduct(p);
        setEditOpen(true);
    };

    const onDeleteRow = (p: Product) => {
        deleteProduct(p.id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <div className="text-xl font-semibold">Products</div>
                        {showingText ? (
                            <div className="text-sm text-muted-foreground">
                                {showingText}
                            </div>
                        ) : null}
                    </div>

                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border p-4">
                    <ProductSearchBar
                        value={searchValue}
                        onChange={setSearchValue}
                        onSubmit={handleSearch}
                        onReset={handleReset}
                    />

                    <ProductTable
                        products={paginated.data}
                        onEdit={onEditRow}
                        onDelete={onDeleteRow}
                    />
                    <hr />
                    {paginated.links?.length ? (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-muted-foreground">
                                {meta
                                    ? `Page ${meta.current_page} of ${meta.last_page}`
                                    : null}
                            </div>

                            <ProductPagination
                                links={minimalLinks}
                                onNavigate={(url) => goTo(url)}
                            />
                        </div>
                    ) : null}
                </div>

                <ProductFormDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                    title="Add Product"
                    description="Create a new product with price and stock."
                    submitLabel="Save"
                    onSubmit={handleCreate}
                    mode="create"
                />

                <ProductFormDialog
                    open={editOpen}
                    onOpenChange={(open) => {
                        setEditOpen(open);
                        if (!open) setEditProduct(null);
                    }}
                    title="Edit Product"
                    description="Update product details."
                    submitLabel="Save changes"
                    initialValues={
                        editProduct
                            ? {
                                  name: editProduct.name,
                                  price: String(editProduct.price),
                                  stock_quantity: String(
                                      editProduct.stock_quantity,
                                  ),
                                  low_stock_threshold:
                                      editProduct.low_stock_threshold === null
                                          ? ''
                                          : String(
                                                editProduct.low_stock_threshold,
                                            ),
                              }
                            : undefined
                    }
                    onSubmit={handleEdit}
                    mode="edit"
                />
            </div>
        </AppLayout>
    );
}
