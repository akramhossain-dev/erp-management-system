/**
 * Domain entity interfaces.
 * These match the planned database schema from DATABASE.md.
 */

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  created_at: string;
}

// ─── Products ────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  user_id: string;
  name: string;
  sku: string;
  description?: string;
  category?: string;
  price: number;
  stock_qty: number;
  min_stock_qty?: number;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = Omit<Product, "id" | "user_id" | "created_at" | "updated_at">;
export type ProductUpdate = Partial<ProductInsert>;

// ─── Customers ───────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export type CustomerInsert = Omit<Customer, "id" | "user_id" | "created_at" | "updated_at">;
export type CustomerUpdate = Partial<CustomerInsert>;

// ─── Suppliers ───────────────────────────────────────────────────────────────

export interface Supplier {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export type SupplierInsert = Omit<Supplier, "id" | "user_id" | "created_at" | "updated_at">;
export type SupplierUpdate = Partial<SupplierInsert>;

// ─── Purchases ───────────────────────────────────────────────────────────────

export type PurchaseStatus = "pending" | "completed" | "cancelled";

export interface Purchase {
  id: string;
  user_id: string;
  supplier_id: string;
  status: PurchaseStatus;
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  supplier?: Supplier;
  items?: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  // Relations
  product?: Product;
}

// ─── Sales ───────────────────────────────────────────────────────────────────

export type SaleStatus = "pending" | "completed" | "cancelled";

export interface Sale {
  id: string;
  user_id: string;
  customer_id: string;
  status: SaleStatus;
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  customer?: Customer;
  items?: SaleItem[];
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  // Relations
  product?: Product;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  total_products: number;
  total_customers: number;
  total_suppliers: number;
  total_purchases: number;
  total_sales: number;
  total_revenue: number;
}
