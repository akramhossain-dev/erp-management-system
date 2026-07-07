/**
 * customerSchemas.ts — Zod validation schemas for the Customer module.
 *
 * Scopes/re-exports customer schema and types from global schemas.
 */
import { customerSchema, type CustomerFormValues } from "@/lib/schemas";
import { z } from "zod";

export { customerSchema };
export type { CustomerFormValues };

// ─── Default values for the form ──────────────────────────────────────────────

export const CUSTOMER_FORM_DEFAULTS: CustomerFormValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
};

// ─── Filter schema ────────────────────────────────────────────────────────────

export const customerFilterSchema = z.object({
  search: z.string().optional(),
});

export type CustomerFilterValues = z.infer<typeof customerFilterSchema>;
