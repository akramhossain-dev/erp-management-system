/**
 * Domain entity interfaces for the ERP Management System.
 *
 * These types are derived from the database Row types but are used
 * throughout the application layer (components, hooks, services).
 *
 * They mirror the exact column names from the PostgreSQL schema.
 */

import type { Tables, TransactionStatus } from "./database.types";

// ─── Core Entity Aliases ──────────────────────────────────────────────────────
// These map directly to Supabase table rows.

export type User           = Tables<"users">;
export type Product        = Tables<"products">;
export type Customer       = Tables<"customers">;
export type Supplier       = Tables<"suppliers">;
export type Purchase       = Tables<"purchases">;
export type PurchaseItem   = Tables<"purchase_items">;
export type Sale           = Tables<"sales">;
export type SaleItem       = Tables<"sale_items">;

// Re-export status type for convenience
export type { TransactionStatus };

// ─── Enriched / Joined Entity Types ───────────────────────────────────────────
// These are what the UI actually renders — rows joined with related data.

/** Purchase with its supplier name included (avoids a separate fetch) */
export interface PurchaseWithSupplier extends Purchase {
  supplier: Pick<Supplier, "id" | "name" | "email" | "phone" | "address">;
}

/** Purchase with all its line items and their products */
export interface PurchaseWithItems extends PurchaseWithSupplier {
  purchase_items: Array<
    PurchaseItem & {
      product: Pick<Product, "id" | "name" | "sku" | "category">;
    }
  >;
}

/** Sale with its customer name included */
export interface SaleWithCustomer extends Sale {
  customer: Pick<Customer, "id" | "name" | "email" | "phone" | "address">;
}

/** Sale with all its line items and their products */
export interface SaleWithItems extends SaleWithCustomer {
  sale_items: Array<
    SaleItem & {
      product: Pick<Product, "id" | "name" | "sku" | "category">;
    }
  >;
}

// ─── Dashboard Types ──────────────────────────────────────────────────────────

/** KPI data returned by the get_dashboard_stats() RPC function */
export interface DashboardStats {
  total_products:  number;
  total_customers: number;
  total_suppliers: number;
  total_purchases: number;
  total_sales:     number;
  total_revenue:   number;
}

/** Low stock product summary returned by get_low_stock_products() */
export interface LowStockProduct {
  id:              string;
  name:            string;
  sku:             string;
  category:        string | null;
  stock_quantity:  number;
  min_stock_level: number;
  selling_price:   number;
}

// ─── Form Input Types ─────────────────────────────────────────────────────────
// Used with React Hook Form. user_id is injected by the service layer.

export type ProductFormInput = {
  name:           string;
  sku:            string;
  description?:   string;
  category?:      string;
  purchase_price: number;
  selling_price:  number;
  stock_quantity?: number;
  min_stock?:     number;
};

export type CustomerFormInput = {
  name:     string;
  email?:   string;
  phone?:   string;
  address?: string;
  notes?:   string;
};

export type SupplierFormInput = {
  name:     string;
  email?:   string;
  phone?:   string;
  address?: string;
  notes?:   string;
};

export type PurchaseItemInput = {
  product_id:  string;
  quantity:    number;
  unit_price:  number;
};

export type PurchaseFormInput = {
  supplier_id:   string;
  purchase_date: string;
  notes?:        string;
  items:         PurchaseItemInput[];
};

export type SaleItemInput = {
  product_id: string;
  quantity:   number;
  unit_price: number;
};

export type SaleFormInput = {
  customer_id: string;
  sale_date:   string;
  notes?:      string;
  items:       SaleItemInput[];
};
