/**
 * App-wide constants: status enums, pagination defaults, query keys.
 */

// ─── Status Values ────────────────────────────────────────────────────────────

export const PURCHASE_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const SALE_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// ─── Query Stale Times (milliseconds) ────────────────────────────────────────

export const STALE_TIMES = {
  DASHBOARD: 30 * 1000,          // 30 seconds
  PRODUCTS: 5 * 60 * 1000,       // 5 minutes
  CUSTOMERS: 10 * 60 * 1000,     // 10 minutes
  SUPPLIERS: 10 * 60 * 1000,     // 10 minutes
  PURCHASES: 2 * 60 * 1000,      // 2 minutes
  SALES: 2 * 60 * 1000,          // 2 minutes
  REPORTS: 1 * 60 * 1000,        // 1 minute
} as const;

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  DASHBOARD: ["dashboard"],
  PRODUCTS: ["products"],
  CUSTOMERS: ["customers"],
  SUPPLIERS: ["suppliers"],
  PURCHASES: ["purchases"],
  SALES: ["sales"],
  REPORTS: ["reports"],
} as const;

// ─── Routes ──────────────────────────────────────────────────────────────────

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PRODUCTS: "/products",
  PRODUCTS_NEW: "/products/new",
  PRODUCTS_EDIT: (id: string) => `/products/${id}/edit`,
  CUSTOMERS: "/customers",
  CUSTOMERS_NEW: "/customers/new",
  CUSTOMERS_EDIT: (id: string) => `/customers/${id}/edit`,
  SUPPLIERS: "/suppliers",
  SUPPLIERS_NEW: "/suppliers/new",
  SUPPLIERS_EDIT: (id: string) => `/suppliers/${id}/edit`,
  PURCHASES: "/purchases",
  PURCHASES_NEW: "/purchases/new",
  PURCHASES_DETAIL: (id: string) => `/purchases/${id}`,
  SALES: "/sales",
  SALES_NEW: "/sales/new",
  SALES_DETAIL: (id: string) => `/sales/${id}`,
  SALES_INVOICE: (id: string) => `/sales/${id}/invoice`,
  REPORTS: "/reports",
  REPORTS_PRODUCTS: "/reports/products",
  REPORTS_CUSTOMERS: "/reports/customers",
  REPORTS_SUPPLIERS: "/reports/suppliers",
  REPORTS_PURCHASES: "/reports/purchases",
  REPORTS_SALES: "/reports/sales",
} as const;

// ─── App Config ───────────────────────────────────────────────────────────────

export const APP_NAME = "ERP Management System";
export const APP_VERSION = "1.0.0";
