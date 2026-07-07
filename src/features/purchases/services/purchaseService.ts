/**
 * purchaseService.ts — Supabase database interactions for purchases.
 */
import { supabase } from "@/lib/supabase";
import type { Purchase, PurchaseWithSupplier, PurchaseWithItems } from "@/types/entities";
import type { PurchaseFormValues, PurchaseFilterValues } from "@/features/purchases/schemas/purchaseSchemas";

export interface GetPurchasesOptions {
  filters?:  PurchaseFilterValues;
  page?:     number;
  pageSize?: number;
}

export interface PurchasesResult {
  data:  PurchaseWithSupplier[];
  count: number;
}

export const purchaseService = {
  /**
   * Get all purchases with supplier name joined.
   */
  getPurchases: async ({
    filters = {},
    page    = 1,
    pageSize = 10,
  }: GetPurchasesOptions = {}): Promise<PurchasesResult> => {
    const from = (page - 1) * pageSize;
    const to   = from + pageSize - 1;

    // Supabase query with nested select for supplier
    let query = supabase
      .from("purchases")
      .select(`
        *,
        supplier:suppliers(id, name, email, phone, address)
      `, { count: "exact" })
      .order("purchase_date", { ascending: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    // Search by supplier name or notes (client-side or server filter)
    if (filters.search?.trim()) {
      const term = filters.search.trim();
      // Use text search on notes or filter via rpc. Let's filter notes ilike or join
      query = query.ilike("notes", `%${term}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: (data ?? []) as unknown as PurchaseWithSupplier[],
      count: count ?? 0,
    };
  },

  /**
   * Get purchase by ID with items, products, and supplier details.
   */
  getPurchaseById: async (id: string): Promise<PurchaseWithItems> => {
    const { data, error } = await supabase
      .from("purchases")
      .select(`
        *,
        supplier:suppliers(id, name, email, phone, address),
        purchase_items(
          id,
          purchase_id,
          product_id,
          quantity,
          unit_price,
          total_price,
          product:products(id, name, sku, category)
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as unknown as PurchaseWithItems;
  },

  /**
   * Create a purchase order and insert child items, then transition to completed.
   * Leverages the Postgres trigger for stock updates.
   */
  createPurchase: async (
    values: PurchaseFormValues,
    userId: string
  ): Promise<Purchase> => {
    // 1. Calculate total order amount
    const totalAmount = values.items.reduce(
      (sum, item) => sum + (item.quantity * item.unit_price),
      0
    );

    // 2. Insert purchase header as 'pending'
    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        user_id:       userId,
        supplier_id:   values.supplier_id,
        status:        "pending", // start pending to avoid early trigger
        total_amount:  totalAmount,
        purchase_date: values.purchase_date,
        notes:         values.notes?.trim() || null,
      })
      .select()
      .single();

    if (purchaseError) throw purchaseError;

    try {
      // 3. Insert purchase line items
      const lineItems = values.items.map((item) => ({
        purchase_id: purchase.id,
        product_id:  item.product_id,
        quantity:    item.quantity,
        unit_price:  item.unit_price,
        total_price: item.quantity * item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("purchase_items")
        .insert(lineItems);

      if (itemsError) throw itemsError;

      // 4. Update status to 'completed' -> fires DB stock trigger atomically
      const { data: completedPurchase, error: updateError } = await supabase
        .from("purchases")
        .update({ status: "completed" })
        .eq("id", purchase.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return completedPurchase as Purchase;

    } catch (err) {
      // Clean up orphaned header on item insert failure (acting like rollback)
      await supabase.from("purchases").delete().eq("id", purchase.id);
      throw err;
    }
  },

  /**
   * Delete a purchase. CASCADE delete will remove child purchase_items.
   */
  deletePurchase: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("purchases")
      .delete()
      .eq("id", id);

    if (error) {
      if (error.code === "23503") {
        throw new Error("Cannot delete this purchase because of active system constraints.");
      }
      throw error;
    }
  },
};
