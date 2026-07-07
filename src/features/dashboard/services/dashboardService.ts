/**
 * dashboardService — Supabase queries for dashboard KPI data.
 *
 * All functions call the get_dashboard_stats() RPC for the main KPIs
 * (single round-trip), then fetch recent transactions for the activity feed.
 */
import { supabase } from "@/lib/supabase";
import type { DashboardStats, LowStockProduct } from "@/types/entities";

export const dashboardService = {
  /**
   * Fetch all KPI counts + total revenue in one DB round-trip.
   * Uses the get_dashboard_stats() Postgres function defined in Phase 2.
   */
  getStats: async (): Promise<DashboardStats> => {
    const { data, error } = await supabase.rpc("get_dashboard_stats");
    if (error) throw error;
    // RPC returns an array with one row
    const row = Array.isArray(data) ? data[0] : data;
    return {
      total_products:  Number(row?.total_products  ?? 0),
      total_customers: Number(row?.total_customers ?? 0),
      total_suppliers: Number(row?.total_suppliers ?? 0),
      total_purchases: Number(row?.total_purchases ?? 0),
      total_sales:     Number(row?.total_sales     ?? 0),
      total_revenue:   Number(row?.total_revenue   ?? 0),
    };
  },

  /**
   * Fetch low-stock products (stock_quantity <= min_stock).
   */
  getLowStockProducts: async (): Promise<LowStockProduct[]> => {
    const { data, error } = await supabase.rpc("get_low_stock_products");
    if (error) throw error;
    return (data ?? []) as unknown as LowStockProduct[];
  },

  /**
   * Fetch the 5 most recent completed sales for the activity feed.
   */
  getRecentSales: async () => {
    const { data, error } = await supabase
      .from("sales")
      .select(`
        id,
        invoice_number,
        total_amount,
        sale_date,
        status,
        customer:customers(name)
      `)
      .order("created_at", { ascending: false })
      .limit(5);
    if (error) throw error;
    return data ?? [];
  },

  /**
   * Fetch the 5 most recent purchases for the activity feed.
   */
  getRecentPurchases: async () => {
    const { data, error } = await supabase
      .from("purchases")
      .select(`
        id,
        total_amount,
        purchase_date,
        status,
        supplier:suppliers(name)
      `)
      .order("created_at", { ascending: false })
      .limit(5);
    if (error) throw error;
    return data ?? [];
  },

  /**
   * Fetch monthly revenue data for the Revenue chart.
   * Aggregates completed sales grouped by month for the last 6 months.
   */
  getMonthlyRevenue: async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const { data, error } = await supabase
      .from("sales")
      .select("total_amount, sale_date")
      .eq("status", "completed")
      .gte("sale_date", sixMonthsAgo.toISOString().split("T")[0]);

    if (error) throw error;

    // Group by month client-side (avoids needing a Postgres aggregate function)
    const monthMap: Record<string, number> = {};
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    (data ?? []).forEach((sale) => {
      const d = new Date(sale.sale_date);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      monthMap[key] = (monthMap[key] ?? 0) + Number(sale.total_amount);
    });

    // Build ordered array for the last 6 months
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      result.push({ month: months[d.getMonth()], revenue: monthMap[key] ?? 0 });
    }
    return result;
  },

  /**
   * Fetch monthly sales count for the Sales chart.
   */
  getMonthlySalesCount: async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const { data, error } = await supabase
      .from("sales")
      .select("sale_date, status")
      .gte("sale_date", sixMonthsAgo.toISOString().split("T")[0]);

    if (error) throw error;

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const countMap: Record<string, { completed: number; pending: number }> = {};

    (data ?? []).forEach((sale) => {
      const d = new Date(sale.sale_date);
      const key = months[d.getMonth()];
      if (!countMap[key]) countMap[key] = { completed: 0, pending: 0 };
      if (sale.status === "completed") countMap[key].completed++;
      else if (sale.status === "pending") countMap[key].pending++;
    });

    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = months[d.getMonth()];
      result.push({
        month:     key,
        completed: countMap[key]?.completed ?? 0,
        pending:   countMap[key]?.pending   ?? 0,
      });
    }
    return result;
  },
};
