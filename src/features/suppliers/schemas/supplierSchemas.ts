/**
 * supplierSchemas.ts — Zod validation schemas for the Supplier module.
 */
import { supplierSchema, type SupplierFormValues } from "@/lib/schemas";
import { z } from "zod";

export { supplierSchema };
export type { SupplierFormValues };

// ─── Default values for the form ──────────────────────────────────────────────

export const SUPPLIER_FORM_DEFAULTS: SupplierFormValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
};

// ─── Filter schema ────────────────────────────────────────────────────────────

export const supplierFilterSchema = z.object({
  search: z.string().optional(),
});

export type SupplierFilterValues = z.infer<typeof supplierFilterSchema>;
