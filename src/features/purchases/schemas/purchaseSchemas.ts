/**
 * purchaseSchemas.ts — Zod validation schemas for the Purchase module.
 */
import { purchaseSchema, type PurchaseFormValues } from "@/lib/schemas";
import { z } from "zod";

export { purchaseSchema };
export type { PurchaseFormValues };

// ─── Default values for the form ──────────────────────────────────────────────

export const PURCHASE_FORM_DEFAULTS: PurchaseFormValues = {
  supplier_id:   "",
  purchase_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
  notes:         "",
  items: [
    { product_id: "", quantity: 1, unit_price: 0 },
  ],
};

// ─── Filter schema ────────────────────────────────────────────────────────────

export const purchaseFilterSchema = z.object({
  search: z.string().optional(),
});

export type PurchaseFilterValues = z.infer<typeof purchaseFilterSchema>;
