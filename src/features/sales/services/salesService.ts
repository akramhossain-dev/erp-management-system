/**
 * salesService.ts — Supabase database interactions for sales and invoicing.
 */
import { supabase } from "@/lib/supabase";
import type { Sale, SaleWithCustomer, SaleWithItems } from "@/types/entities";
import type { SaleFormValues, SalesFilterValues } from "@/features/sales/schemas/salesSchemas";

export interface GetSalesOptions {
  filters?:  SalesFilterValues;
  page?:     number;
  pageSize?: number;
}

export interface SalesResult {
  data:  SaleWithCustomer[];
  count: number;
}

export const salesService = {
  /**
   * Get all sales with customer name and address details joined.
   */
  getSales: async ({
    filters = {},
    page    = 1,
    pageSize = 10,
  }: GetSalesOptions = {}): Promise<SalesResult> => {
    const from = (page - 1) * pageSize;
    const to   = from + pageSize - 1;

    let query = supabase
      .from("sales")
      .select(`
        *,
        customer:customers(id, name, email, phone, address)
      `, { count: "exact" })
      .order("sale_date", { ascending: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filters.search?.trim()) {
      const term = filters.search.trim();
      query = query.or(`invoice_number.ilike.%${term}%,notes.ilike.%${term}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: (data ?? []) as unknown as SaleWithCustomer[],
      count: count ?? 0,
    };
  },

  /**
   * Get sale record by ID with items, products, and customer details.
   */
  getSaleById: async (id: string): Promise<SaleWithItems> => {
    const { data, error } = await supabase
      .from("sales")
      .select(`
        *,
        customer:customers(id, name, email, phone, address),
        sale_items(
          id,
          sale_id,
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
    return data as unknown as SaleWithItems;
  },

  /**
   * Create a new sales invoice. Checks stock availability and updates product stock level.
   */
  createSale: async (
    values: SaleFormValues,
    userId: string
  ): Promise<Sale> => {
    // 1. Generate unique invoice number via database RPC function
    const { data: invoiceNo, error: invoiceError } = await supabase
      .rpc("generate_invoice_number");

    if (invoiceError) throw invoiceError;

    // 2. Calculate total sum
    const totalAmount = values.items.reduce(
      (sum, item) => sum + (item.quantity * item.unit_price),
      0
    );

    // 3. Create sale header in 'pending' status
    const { data: sale, error: saleError } = await supabase
      .from("sales")
      .insert({
        user_id:        userId,
        customer_id:    values.customer_id,
        invoice_number: invoiceNo,
        status:         "pending",
        total_amount:   totalAmount,
        sale_date:      values.sale_date,
        notes:          values.notes?.trim() || null,
      })
      .select()
      .single();

    if (saleError) throw saleError;

    try {
      // 4. Save sale items line rows (triggers stock check trigger on database side)
      const lineItems = values.items.map((item) => ({
        sale_id:     sale.id,
        product_id:  item.product_id,
        quantity:    item.quantity,
        unit_price:  item.unit_price,
        total_price: item.quantity * item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("sale_items")
        .insert(lineItems);

      if (itemsError) {
        // Customize user feedback on stock limit errors
        if (itemsError.message?.includes("Insufficient stock")) {
          throw new Error(itemsError.message);
        }
        throw itemsError;
      }

      // 5. Update header status to completed -> fires parent DB trigger atomically
      const { data: completedSale, error: updateError } = await supabase
        .from("sales")
        .update({ status: "completed" })
        .eq("id", sale.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return completedSale as Sale;

    } catch (err) {
      // Rollback orphaned sales header record on failure
      await supabase.from("sales").delete().eq("id", sale.id);
      throw err;
    }
  },

  /**
   * Delete sale record.
   */
  deleteSale: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("sales")
      .delete()
      .eq("id", id);

    if (error) {
      if (error.code === "23503") {
        throw new Error("Cannot delete this sale because of system integrity constraints.");
      }
      throw error;
    }
  },
};
