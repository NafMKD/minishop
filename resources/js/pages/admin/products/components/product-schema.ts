import { z } from 'zod';

const imageFileSchema = z.instanceof(File);

export const CreateProductFormSchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
    price: z
        .string()
        .trim()
        .min(1, 'Price is required.')
        .refine(
            (v) => !Number.isNaN(Number(v)) && Number(v) >= 0,
            'Price must be a valid number.',
        ),
    stock_quantity: z
        .string()
        .trim()
        .min(1, 'Stock quantity is required.')
        .refine(
            (v) => Number.isInteger(Number(v)) && Number(v) >= 0,
            'Stock quantity must be a valid integer.',
        ),
    low_stock_threshold: z
        .string()
        .trim()
        .optional()
        .refine(
            (v) =>
                v === undefined ||
                v === '' ||
                (Number.isInteger(Number(v)) && Number(v) >= 0),
            'Low stock threshold must be a valid integer.',
        ),
    images: z
        .array(imageFileSchema)
        .min(1, 'At least 1 image is required.')
        .max(5, 'Maximum 5 images allowed.'),
});

export const UpdateProductFormSchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
    price: z
        .string()
        .trim()
        .min(1, 'Price is required.')
        .refine(
            (v) => !Number.isNaN(Number(v)) && Number(v) >= 0,
            'Price must be a valid number.',
        ),
    stock_quantity: z
        .string()
        .trim()
        .min(1, 'Stock quantity is required.')
        .refine(
            (v) => Number.isInteger(Number(v)) && Number(v) >= 0,
            'Stock quantity must be a valid integer.',
        ),
    low_stock_threshold: z
        .string()
        .trim()
        .optional()
        .refine(
            (v) =>
                v === undefined ||
                v === '' ||
                (Number.isInteger(Number(v)) && Number(v) >= 0),
            'Low stock threshold must be a valid integer.',
        ),
    images: z
        .array(imageFileSchema)
        .max(5, 'Maximum 5 images allowed.')
        .optional(),
});

export type CreateProductFormData = z.infer<typeof CreateProductFormSchema>;
export type UpdateProductFormData = z.infer<typeof UpdateProductFormSchema>;

export type ProductFormErrors = Record<string, string | undefined>;
