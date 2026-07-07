/**
 * salesSchemas.ts — Zod validation schemas for the Sales module.
 */
import { saleSchema, type SaleFormValues } from "@/lib/schemas";
import { z } from "zod";

export { saleSchema };
export type { SaleFormValues };

// ─── Default values for the form ──────────────────────────────────────────────

export const SALES_FORM_DEFAULTS: SaleFormValues = {
  customer_id: "",
  sale_date:   new Date().toISOString().split("T")[0],
  notes:       "",
  items: [
    { product_id: "", quantity: 1, unit_price: 0 },
  ],
};

// ─── Filter schema ────────────────────────────────────────────────────────────

export const salesFilterSchema = z.object({
  search: z.string().optional(),
});

export type SalesFilterValues = z.infer<typeof salesFilterSchema>;
