/**
 * Common Zod schema building blocks shared across all feature schemas.
 * Field names match the actual PostgreSQL column names.
 */
import { z } from "zod";

// ─── Base Field Schemas ───────────────────────────────────────────────────────

/** Required name field (1–200 chars) */
export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(200, "Name must be 200 characters or less");

/** Optional email field — mirrors the DB CHECK constraint */
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .optional()
  .or(z.literal(""));

/** Optional phone field */
export const phoneSchema = z
  .string()
  .max(50, "Phone must be 50 characters or less")
  .optional()
  .or(z.literal(""));

/** Optional address field */
export const addressSchema = z
  .string()
  .max(500, "Address must be 500 characters or less")
  .optional()
  .or(z.literal(""));

/** Optional notes / description field */
export const notesSchema = z
  .string()
  .max(2000, "Text must be 2000 characters or less")
  .optional()
  .or(z.literal(""));

/** Non-negative NUMERIC(12,2) price */
export const priceSchema = z
  .number({ error: "Price must be a positive number" })
  .min(0, "Price cannot be negative");

/** Non-negative integer quantity for inventory levels */
export const stockQuantitySchema = z
  .number({ error: "Quantity must be a number" })
  .int("Quantity must be a whole number")
  .min(0, "Quantity cannot be negative");

/** Positive integer quantity for line items */
export const lineItemQuantitySchema = z
  .number({ error: "Quantity must be a number" })
  .int("Quantity must be a whole number")
  .positive("Quantity must be at least 1");

/** UUID foreign key */
export const uuidSchema = z.string().uuid("Invalid ID format");

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email:    z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(200),
  email:     z.string().email("Please enter a valid email address"),
  password:  z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

// ─── Product Schemas ──────────────────────────────────────────────────────────

export const productSchema = z.object({
  name:           nameSchema,
  sku:            z.string().min(1, "SKU is required").max(50, "SKU must be 50 chars or less").toUpperCase(),
  description:    notesSchema,
  category:       z.string().max(100).optional().or(z.literal("")),
  purchase_price: priceSchema,
  selling_price:  priceSchema,
  stock_quantity: stockQuantitySchema.optional().default(0),
  min_stock:      stockQuantitySchema.optional().default(0),
});

// ─── Customer Schemas ─────────────────────────────────────────────────────────

export const customerSchema = z.object({
  name:    nameSchema,
  email:   emailSchema,
  phone:   phoneSchema,
  address: addressSchema,
  notes:   notesSchema,
});

// ─── Supplier Schemas ─────────────────────────────────────────────────────────

export const supplierSchema = z.object({
  name:    nameSchema,
  email:   emailSchema,
  phone:   phoneSchema,
  address: addressSchema,
  notes:   notesSchema,
});

// ─── Purchase Schemas ─────────────────────────────────────────────────────────

const purchaseItemSchema = z.object({
  product_id:  uuidSchema,
  quantity:    lineItemQuantitySchema,
  unit_price:  priceSchema,
});

export const purchaseSchema = z.object({
  supplier_id:   uuidSchema,
  purchase_date: z.string().min(1, "Purchase date is required"),
  notes:         notesSchema,
  items: z.array(purchaseItemSchema).min(1, "At least one item is required"),
});

// ─── Sale Schemas ─────────────────────────────────────────────────────────────

const saleItemSchema = z.object({
  product_id: uuidSchema,
  quantity:   lineItemQuantitySchema,
  unit_price: priceSchema,
});

export const saleSchema = z.object({
  customer_id: uuidSchema,
  sale_date:   z.string().min(1, "Sale date is required"),
  notes:       notesSchema,
  items: z.array(saleItemSchema).min(1, "At least one item is required"),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type LoginFormValues    = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ProductFormValues  = z.infer<typeof productSchema>;
export type CustomerFormValues = z.infer<typeof customerSchema>;
export type SupplierFormValues = z.infer<typeof supplierSchema>;
export type PurchaseFormValues = z.infer<typeof purchaseSchema>;
export type SaleFormValues     = z.infer<typeof saleSchema>;
