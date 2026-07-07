/**
 * reportService.ts — fetches data for the 5 different report views.
 *
 * Scoped to user_id via RLS, handles aggregations in memory for correctness.
 */
import { supabase } from "@/lib/supabase";

export interface ProductReportRow {
  id:             string;
  name:           string;
  sku:            string;
  category:       string | null;
  purchase_price: number;
  selling_price:  number;
  stock_quantity: number;
  inventory_value: number; // qty * purchase_price
}

export interface CustomerReportRow {
  id:                 string;
  name:               string;
  email:              string | null;
  phone:              string | null;
  total_orders:       number;
  total_spent:        number;
  last_purchase_date: string | null;
}

export interface SupplierReportRow {
  id:                 string;
  name:               string;
  email:              string | null;
  phone:              string | null;
  total_supplies:     number;
  total_supplied_val: number;
  last_supply_date:   string | null;
}

export interface PurchaseReportRow {
  id:            string;
  supplier_name: string;
  purchase_date: string;
  total_amount:  number;
  items_count:   number;
}

export interface SalesReportRow {
  id:             string;
  invoice_number: string;
  customer_name:  string;
  sale_date:      string;
  total_amount:   number;
  items_count:    number;
}

export const reportService = {
  /**
   * Product Report data.
   */
  getProductReport: async (): Promise<ProductReportRow[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, sku, category, purchase_price, selling_price, stock_quantity")
      .order("name", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((p) => {
      const purchasePrice = Number(p.purchase_price);
      const stockQty      = Number(p.stock_quantity);
      return {
        id:             p.id,
        name:           p.name,
        sku:            p.sku,
        category:       p.category,
        purchase_price: purchasePrice,
        selling_price:  Number(p.selling_price),
        stock_quantity: stockQty,
        inventory_value: stockQty * purchasePrice,
      };
    });
  },

  /**
   * Customer spending report details.
   */
  getCustomerReport: async (): Promise<CustomerReportRow[]> => {
    // Select customer details and completed sales
    const { data, error } = await supabase
      .from("customers")
      .select(`
        id,
        name,
        email,
        phone,
        sales(id, total_amount, sale_date, status)
      `)
      .order("name", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((c) => {
      // Aggregate client-side to bypass Supabase RPC/limitations
      const completedSales = (c.sales ?? []).filter((s: { status: string }) => s.status === "completed");
      const totalSpent = completedSales.reduce((sum: number, s: { total_amount: number }) => sum + Number(s.total_amount), 0);
      const lastPurchase = completedSales.length > 0
        ? completedSales.reduce((latest: string, s: { sale_date: string }) =>
            s.sale_date > latest ? s.sale_date : latest,
            completedSales[0].sale_date
          )
        : null;

      return {
        id:                 c.id,
        name:               c.name,
        email:              c.email,
        phone:              c.phone,
        total_orders:       completedSales.length,
        total_spent:        totalSpent,
        last_purchase_date: lastPurchase,
      };
    });
  },

  /**
   * Supplier supply values report.
   */
  getSupplierReport: async (): Promise<SupplierReportRow[]> => {
    // Select supplier details and completed purchases
    const { data, error } = await supabase
      .from("suppliers")
      .select(`
        id,
        name,
        email,
        phone,
        purchases(id, total_amount, purchase_date, status)
      `)
      .order("name", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((s) => {
      const completedPurchases = (s.purchases ?? []).filter((p: { status: string }) => p.status === "completed");
      const totalSupplied = completedPurchases.reduce((sum: number, p: { total_amount: number }) => sum + Number(p.total_amount), 0);
      const lastSupply = completedPurchases.length > 0
        ? completedPurchases.reduce((latest: string, p: { purchase_date: string }) =>
            p.purchase_date > latest ? p.purchase_date : latest,
            completedPurchases[0].purchase_date
          )
        : null;

      return {
        id:                 s.id,
        name:               s.name,
        email:              s.email,
        phone:              s.phone,
        total_supplies:     completedPurchases.length,
        total_supplied_val: totalSupplied,
        last_supply_date:   lastSupply,
      };
    });
  },

  /**
   * Purchase reports with date range and supplier filters.
   */
  getPurchaseReport: async (options: {
    dateFrom?:   string;
    dateTo?:     string;
    supplierId?: string;
  } = {}): Promise<PurchaseReportRow[]> => {
    let query = supabase
      .from("purchases")
      .select(`
        id,
        purchase_date,
        total_amount,
        status,
        supplier:suppliers(name),
        purchase_items(quantity)
      `)
      .eq("status", "completed")
      .order("purchase_date", { ascending: false });

    if (options.dateFrom)   query = query.gte("purchase_date", options.dateFrom);
    if (options.dateTo)     query = query.lte("purchase_date", options.dateTo);
    if (options.supplierId) query = query.eq("supplier_id", options.supplierId);

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((p) => {
      // Calculate count of items (sum of quantity)
      const itemsCount = (p.purchase_items ?? []).reduce(
        (sum: number, item: { quantity: number }) => sum + (Number(item?.quantity) || 0),
        0
      );

      return {
        id:            p.id,
        supplier_name: (p.supplier as unknown as { name: string })?.name ?? "Unknown",
        purchase_date: p.purchase_date,
        total_amount:  Number(p.total_amount),
        items_count:   itemsCount,
      };
    });
  },

  /**
   * Sales report with date range and customer filters.
   */
  getSalesReport: async (options: {
    dateFrom?:   string;
    dateTo?:     string;
    customerId?: string;
  } = {}): Promise<SalesReportRow[]> => {
    let query = supabase
      .from("sales")
      .select(`
        id,
        invoice_number,
        sale_date,
        total_amount,
        status,
        customer:customers(name),
        sale_items(quantity)
      `)
      .eq("status", "completed")
      .order("sale_date", { ascending: false });

    if (options.dateFrom)   query = query.gte("sale_date", options.dateFrom);
    if (options.dateTo)     query = query.lte("sale_date", options.dateTo);
    if (options.customerId) query = query.eq("customer_id", options.customerId);

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((s) => {
      const itemsCount = (s.sale_items ?? []).reduce(
        (sum: number, item: { quantity: number }) => sum + (Number(item?.quantity) || 0),
        0
      );

      return {
        id:             s.id,
        invoice_number: s.invoice_number,
        customer_name:  (s.customer as unknown as { name: string })?.name ?? "Walk-in",
        sale_date:      s.sale_date,
        total_amount:   Number(s.total_amount),
        items_count:    itemsCount,
      };
    });
  },
};
