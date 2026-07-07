/**
 * Supabase project configuration — table names, function names.
 * Use these constants when calling supabase.from() to avoid typos.
 */

export const SUPABASE_TABLES = {
  USERS:          "users",
  PRODUCTS:       "products",
  CUSTOMERS:      "customers",
  SUPPLIERS:      "suppliers",
  PURCHASES:      "purchases",
  PURCHASE_ITEMS: "purchase_items",
  SALES:          "sales",
  SALE_ITEMS:     "sale_items",
} as const;

export const SUPABASE_FUNCTIONS = {
  GET_DASHBOARD_STATS:     "get_dashboard_stats",
  GENERATE_INVOICE_NUMBER: "generate_invoice_number",
  GET_LOW_STOCK_PRODUCTS:  "get_low_stock_products",
} as const;

export type SupabaseTable = typeof SUPABASE_TABLES[keyof typeof SUPABASE_TABLES];
