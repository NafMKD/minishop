import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import {
    CreateProductFormSchema,
    UpdateProductFormSchema,
    type CreateProductFormData,
    type UpdateProductFormData,
} from './product-schema';

type Mode = 'create' | 'edit';

type Errors<T> = Partial<Record<keyof T, string>>;

type CommonProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    submitLabel: string;
};

type CreateProps = CommonProps & {
    mode: 'create';
    initialValues?: Partial<CreateProductFormData>;
    onSubmit: (data: CreateProductFormData) => void;
};

type EditProps = CommonProps & {
    mode: 'edit';
    initialValues?: Partial<UpdateProductFormData>;
    onSubmit: (data: UpdateProductFormData) => void;
};

type Props = CreateProps | EditProps;

function parseZodErrors<T extends Record<string, any>>(
    err: z.ZodError<T>,
): Partial<Record<keyof T, string>> {
    const out: Partial<Record<keyof T, string>> = {};
    for (const issue of err.issues) {
        const key = issue.path[0] as keyof T | undefined;
        if (key && !out[key]) out[key] = issue.message;
    }
    return out;
}

export function ProductFormDialog(props: Props) {
    const schema = useMemo(() => {
        return props.mode === 'create'
            ? CreateProductFormSchema
            : UpdateProductFormSchema;
    }, [props.mode]);

    const [createForm, setCreateForm] = useState<CreateProductFormData>({
        name: '',
        price: '',
        stock_quantity: '0',
        low_stock_threshold: '',
        images: [],
        ...(props.mode === 'create' ? props.initialValues : {}),
    });

    const [editForm, setEditForm] = useState<UpdateProductFormData>({
        name: '',
        price: '',
        stock_quantity: '0',
        low_stock_threshold: '',
        images: undefined,
        ...(props.mode === 'edit' ? props.initialValues : {}),
    });

    const [createErrors, setCreateErrors] = useState<
        Errors<CreateProductFormData>
    >({});
    const [editErrors, setEditErrors] = useState<Errors<UpdateProductFormData>>(
        {},
    );
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!props.open) return;

        setSubmitting(false);

        if (props.mode === 'create') {
            setCreateForm({
                name: '',
                price: '',
                stock_quantity: '0',
                low_stock_threshold: '',
                images: [],
                ...(props.initialValues ?? {}),
            });
            setCreateErrors({});
        } else {
            setEditForm({
                name: '',
                price: '',
                stock_quantity: '0',
                low_stock_threshold: '',
                images: undefined,
                ...(props.initialValues ?? {}),
            });
            setEditErrors({});
        }
    }, [props.open, props.mode, props.initialValues]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setSubmitting(true);

        if (props.mode === 'create') {
            setCreateErrors({});
            const parsed = schema.safeParse(createForm);

            if (!parsed.success) {
                setCreateErrors(
                    parseZodErrors(
                        parsed.error as z.ZodError<CreateProductFormData>,
                    ),
                );
                setSubmitting(false);
                return;
            }

            props.onSubmit(createForm);
            return;
        }

        setEditErrors({});
        const parsed = schema.safeParse(editForm);

        if (!parsed.success) {
            setEditErrors(
                parseZodErrors(
                    parsed.error as z.ZodError<UpdateProductFormData>,
                ),
            );
            setSubmitting(false);
            return;
        }

        props.onSubmit(editForm);
    };

    const form = props.mode === 'create' ? createForm : editForm;
    const errors = props.mode === 'create' ? createErrors : editErrors;

    const setField = (key: string, value: any) => {
        if (props.mode === 'create') {
            setCreateForm((prev) => ({ ...prev, [key]: value }));
        } else {
            setEditForm((prev) => ({ ...prev, [key]: value }));
        }
    };

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>{props.title}</DialogTitle>
                    {props.description ? (
                        <DialogDescription>
                            {props.description}
                        </DialogDescription>
                    ) : null}
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => setField('name', e.target.value)}
                        />
                        {errors.name ? (
                            <p className="text-sm text-destructive">
                                {errors.name}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                inputMode="decimal"
                                value={form.price}
                                onChange={(e) =>
                                    setField('price', e.target.value)
                                }
                            />
                            {errors.price ? (
                                <p className="text-sm text-destructive">
                                    {errors.price}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock_quantity">
                                Stock Quantity
                            </Label>
                            <Input
                                id="stock_quantity"
                                inputMode="numeric"
                                value={form.stock_quantity}
                                onChange={(e) =>
                                    setField('stock_quantity', e.target.value)
                                }
                            />
                            {errors.stock_quantity ? (
                                <p className="text-sm text-destructive">
                                    {errors.stock_quantity}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="images">
                            Images{' '}
                            {props.mode === 'create'
                                ? '(min 1, max 5)'
                                : '(optional, max 5)'}
                        </Label>
                        <Input
                            id="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                const files = Array.from(e.target.files ?? []);
                                if (props.mode === 'create') {
                                    setField('images', files);
                                } else {
                                    setField(
                                        'images',
                                        files.length ? files : undefined,
                                    );
                                }
                            }}
                        />
                        {errors.images ? (
                            <p className="text-sm text-destructive">
                                {String(errors.images)}
                            </p>
                        ) : null}

                        {props.mode === 'edit' ? (
                            <p className="text-xs text-muted-foreground">
                                Leave empty to keep existing images. Selecting
                                new images will replace them.
                            </p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="low_stock_threshold">
                            Low Stock Threshold (optional)
                        </Label>
                        <Input
                            id="low_stock_threshold"
                            inputMode="numeric"
                            value={form.low_stock_threshold ?? ''}
                            onChange={(e) =>
                                setField('low_stock_threshold', e.target.value)
                            }
                            placeholder="Leave empty to use default"
                        />
                        {errors.low_stock_threshold ? (
                            <p className="text-sm text-destructive">
                                {errors.low_stock_threshold}
                            </p>
                        ) : null}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => props.onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Saving...' : props.submitLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
