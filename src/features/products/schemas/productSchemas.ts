/**
 * productSchemas.ts — Zod validation schemas for the Product module.
 *
 * Used with React Hook Form + @hookform/resolvers/zod.
 */
import { z } from "zod";

// ─── Product Categories ───────────────────────────────────────────────────────

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food & Beverages",
  "Hardware",
  "Software",
  "Furniture",
  "Stationery",
  "Health & Beauty",
  "Sports",
  "Automotive",
  "Other",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

// ─── Product Form Schema ──────────────────────────────────────────────────────

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Name must be 200 characters or less")
    .trim(),

  sku: z
    .string()
    .min(1, "SKU is required")
    .max(50, "SKU must be 50 characters or less")
    .regex(/^[A-Za-z0-9_-]+$/, "SKU can only contain letters, numbers, hyphens, and underscores")
    .trim(),

  category: z
    .string()
    .max(100, "Category must be 100 characters or less")
    .optional()
    .nullable(),

  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional()
    .nullable(),

  purchase_price: z
    .number({ error: "Purchase price must be a valid number" })
    .min(0, "Purchase price cannot be negative"),

  selling_price: z
    .number({ error: "Selling price must be a valid number" })
    .min(0, "Selling price cannot be negative"),

  stock_quantity: z
    .number({ error: "Stock quantity must be a valid number" })
    .int("Stock quantity must be a whole number")
    .min(0, "Stock quantity cannot be negative"),

  min_stock: z
    .number({ error: "Minimum stock must be a valid number" })
    .int("Minimum stock must be a whole number")
    .min(0, "Minimum stock cannot be negative"),
});

// ─── Type Inference ───────────────────────────────────────────────────────────

export type ProductFormValues = z.infer<typeof productSchema>;

// ─── Default values for the form ──────────────────────────────────────────────

export const PRODUCT_FORM_DEFAULTS: ProductFormValues = {
  name:           "",
  sku:            "",
  category:       "",
  description:    "",
  purchase_price: 0,
  selling_price:  0,
  stock_quantity: 0,
  min_stock:      0,
};

// ─── Filter schema ────────────────────────────────────────────────────────────

export const productFilterSchema = z.object({
  search:       z.string().optional(),
  category:     z.string().optional(),
  stockStatus:  z.enum(["all", "in_stock", "low_stock", "out_of_stock"]).optional(),
});

export type ProductFilterValues = z.infer<typeof productFilterSchema>;
