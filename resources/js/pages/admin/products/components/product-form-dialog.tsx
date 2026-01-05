import * as React from 'react';
import { useMemo, useState } from 'react';
import { z } from 'zod';

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

import {
  CreateProductFormSchema,
  UpdateProductFormSchema,
  type CreateProductFormData,
  type UpdateProductFormData,
} from './product-schema';

type Errors<T extends Record<string, unknown>> = Partial<Record<keyof T, string>>;

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

function parseZodErrors<T extends Record<string, unknown>>(err: z.ZodError<T>): Errors<T> {
  const out: Errors<T> = {};
  for (const issue of err.issues) {
    const key = issue.path[0] as keyof T | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

function CreateProductFormInner(props: {
  title: string;
  description?: string;
  submitLabel: string;
  initialValues?: Partial<CreateProductFormData>;
  onCancel: () => void;
  onSubmit: (data: CreateProductFormData) => void;
}) {
  const schema = CreateProductFormSchema;

  const [form, setForm] = useState<CreateProductFormData>(() => ({
    name: '',
    price: '',
    stock_quantity: '0',
    low_stock_threshold: '',
    images: [],
    ...(props.initialValues ?? {}),
  }));

  const [errors, setErrors] = useState<Errors<CreateProductFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof CreateProductFormData>(
    key: K,
    value: CreateProductFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setErrors(parseZodErrors(parsed.error));
      setSubmitting(false);
      return;
    }

    props.onSubmit(form);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{props.title}</DialogTitle>
        {props.description ? <DialogDescription>{props.description}</DialogDescription> : null}
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={(e) => setField('name', e.target.value)} />
          {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              inputMode="decimal"
              value={form.price}
              onChange={(e) => setField('price', e.target.value)}
            />
            {errors.price ? <p className="text-sm text-destructive">{errors.price}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input
              id="stock_quantity"
              inputMode="numeric"
              value={form.stock_quantity}
              onChange={(e) => setField('stock_quantity', e.target.value)}
            />
            {errors.stock_quantity ? (
              <p className="text-sm text-destructive">{errors.stock_quantity}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="images">Images (min 1, max 5)</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setField('images', files);
            }}
          />
          {errors.images ? <p className="text-sm text-destructive">{String(errors.images)}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="low_stock_threshold">Low Stock Threshold (optional)</Label>
          <Input
            id="low_stock_threshold"
            inputMode="numeric"
            value={form.low_stock_threshold ?? ''}
            onChange={(e) => setField('low_stock_threshold', e.target.value)}
            placeholder="Leave empty to use default"
          />
          {errors.low_stock_threshold ? (
            <p className="text-sm text-destructive">{errors.low_stock_threshold}</p>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : props.submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

function EditProductFormInner(props: {
  title: string;
  description?: string;
  submitLabel: string;
  initialValues?: Partial<UpdateProductFormData>;
  onCancel: () => void;
  onSubmit: (data: UpdateProductFormData) => void;
}) {
  const schema = UpdateProductFormSchema;

  const [form, setForm] = useState<UpdateProductFormData>(() => ({
    name: '',
    price: '',
    stock_quantity: '0',
    low_stock_threshold: '',
    images: undefined,
    ...(props.initialValues ?? {}),
  }));

  const [errors, setErrors] = useState<Errors<UpdateProductFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof UpdateProductFormData>(
    key: K,
    value: UpdateProductFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setErrors(parseZodErrors(parsed.error));
      setSubmitting(false);
      return;
    }

    props.onSubmit(form);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{props.title}</DialogTitle>
        {props.description ? <DialogDescription>{props.description}</DialogDescription> : null}
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={(e) => setField('name', e.target.value)} />
          {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              inputMode="decimal"
              value={form.price}
              onChange={(e) => setField('price', e.target.value)}
            />
            {errors.price ? <p className="text-sm text-destructive">{errors.price}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input
              id="stock_quantity"
              inputMode="numeric"
              value={form.stock_quantity}
              onChange={(e) => setField('stock_quantity', e.target.value)}
            />
            {errors.stock_quantity ? (
              <p className="text-sm text-destructive">{errors.stock_quantity}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="images">Images (optional, max 5)</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setField('images', files.length ? files : undefined);
            }}
          />
          {errors.images ? <p className="text-sm text-destructive">{String(errors.images)}</p> : null}

          <p className="text-xs text-muted-foreground">
            Leave empty to keep existing images. Selecting new images will replace them.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="low_stock_threshold">Low Stock Threshold (optional)</Label>
          <Input
            id="low_stock_threshold"
            inputMode="numeric"
            value={form.low_stock_threshold ?? ''}
            onChange={(e) => setField('low_stock_threshold', e.target.value)}
            placeholder="Leave empty to use default"
          />
          {errors.low_stock_threshold ? (
            <p className="text-sm text-destructive">{errors.low_stock_threshold}</p>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : props.submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export function ProductFormDialog(props: Props) {
  // Just keep this memo if you use it elsewhere; otherwise you can remove it.
  useMemo(() => {
    return props.mode === 'create' ? CreateProductFormSchema : UpdateProductFormSchema;
  }, [props.mode]);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      {props.open ? (
        <DialogContent className="sm:max-w-[520px]">
          {props.mode === 'create' ? (
            <CreateProductFormInner
              title={props.title}
              description={props.description}
              submitLabel={props.submitLabel}
              initialValues={props.initialValues}
              onCancel={() => props.onOpenChange(false)}
              onSubmit={props.onSubmit}
            />
          ) : (
            <EditProductFormInner
              title={props.title}
              description={props.description}
              submitLabel={props.submitLabel}
              initialValues={props.initialValues}
              onCancel={() => props.onOpenChange(false)}
              onSubmit={props.onSubmit}
            />
          )}
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
