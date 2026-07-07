/**
 * Common Zod schema building blocks shared across all feature schemas.
 * Import from here instead of duplicating in each feature.
 */
import { z } from "zod";

// ─── Base Field Schemas ───────────────────────────────────────────────────────

/** Required name field (1–100 chars) */
export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name must be 100 characters or less");

/** Optional email field */
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .optional()
  .or(z.literal(""));

/** Optional phone field */
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-()]{7,20}$/, "Please enter a valid phone number")
  .optional()
  .or(z.literal(""));

/** Optional address field */
export const addressSchema = z
  .string()
  .max(500, "Address must be 500 characters or less")
  .optional()
  .or(z.literal(""));

/** Optional description field */
export const descriptionSchema = z
  .string()
  .max(1000, "Description must be 1000 characters or less")
  .optional()
  .or(z.literal(""));

/** Positive price field */
export const priceSchema = z
  .number({ error: "Price must be a positive number" })
  .positive("Price must be greater than 0");

/** Non-negative integer quantity */
export const quantitySchema = z
  .number({ error: "Quantity must be a number" })
  .int("Quantity must be a whole number")
  .min(0, "Quantity cannot be negative");

/** Positive integer quantity for line items */
export const lineItemQuantitySchema = z
  .number({ error: "Quantity must be a number" })
  .int("Quantity must be a whole number")
  .positive("Quantity must be at least 1");

/** UUID field */
export const uuidSchema = z
  .string()
  .uuid("Invalid ID format");

/** Required UUID foreign key */
export const foreignKeySchema = (fieldName: string) =>
  z.string().uuid(`Please select a valid ${fieldName}`).min(1, `${fieldName} is required`);

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
