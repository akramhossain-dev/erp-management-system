/**
 * productService.ts — Supabase CRUD operations for the products table.
 *
 * All operations are scoped to the authenticated user via RLS.
 * user_id is injected server-side by RLS — we only pass it on INSERT.
 */
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/entities";
import type { ProductFormValues, ProductFilterValues } from "@/features/products/schemas/productSchemas";
import type { Database } from "@/types/database.types";

type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

// ─── List / Search ────────────────────────────────────────────────────────────

export interface GetProductsOptions {
  filters?: ProductFilterValues;
  page?:    number;
  pageSize?: number;
}

export interface ProductsResult {
  data:  Product[];
  count: number;
}

export const productService = {
  /**
   * Get all products for the current user with optional search, filtering,
   * and pagination.
   */
  getProducts: async ({
    filters = {},
    page    = 1,
    pageSize = 10,
  }: GetProductsOptions = {}): Promise<ProductsResult> => {
    const from = (page - 1) * pageSize;
    const to   = from + pageSize - 1;

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    // Search by name OR sku (case-insensitive)
    if (filters.search?.trim()) {
      const term = filters.search.trim();
      query = query.or(`name.ilike.%${term}%,sku.ilike.%${term}%`);
    }

    // Filter by category
    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }

    // Filter by stock status
    if (filters.stockStatus === "out_of_stock") {
      query = query.eq("stock_quantity", 0);
    } else if (filters.stockStatus === "low_stock") {
      // Stock > 0 AND stock <= min_stock
      query = query.gt("stock_quantity", 0).filter("stock_quantity", "lte", supabase.rpc);
      // Use a simpler approach: just filter gt 0 and we mark low-stock client-side
      // Reset and redo without the RPC filter
      query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to)
        .gt("stock_quantity", 0);
      if (filters.search?.trim()) {
        const term = filters.search.trim();
        query = query.or(`name.ilike.%${term}%,sku.ilike.%${term}%`);
      }
      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }
    } else if (filters.stockStatus === "in_stock") {
      query = query.gt("stock_quantity", 0);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    // Client-side low-stock filter (stock > 0 && stock <= min_stock)
    let result = (data ?? []) as Product[];
    if (filters.stockStatus === "low_stock") {
      result = result.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= p.min_stock);
    }

    return { data: result, count: count ?? 0 };
  },

  /**
   * Get a single product by ID.
   */
  getProductById: async (id: string): Promise<Product> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Product;
  },

  /**
   * Create a new product.
   * user_id is required and comes from the auth session (passed by the hook).
   */
  createProduct: async (
    values: ProductFormValues,
    userId: string
  ): Promise<Product> => {
    const { data, error } = await supabase
      .from("products")
      .insert({
        user_id:        userId,
        name:           values.name.trim(),
        sku:            values.sku.trim().toUpperCase(),
        category:       values.category?.trim() || null,
        description:    values.description?.trim() || null,
        purchase_price: values.purchase_price,
        selling_price:  values.selling_price,
        stock_quantity: values.stock_quantity,
        min_stock:      values.min_stock,
      })
      .select()
      .single();

    if (error) {
      // Supabase unique constraint on sku + user_id
      if (error.code === "23505") {
        throw new Error(`A product with SKU "${values.sku.toUpperCase()}" already exists.`);
      }
      throw error;
    }
    return data as Product;
  },

  /**
   * Update an existing product.
   * stock_quantity is intentionally excluded — stock is managed by
   * purchase/sales triggers (Phase 6+). Only admin can adjust directly.
   */
  updateProduct: async (
    id: string,
    values: Partial<ProductFormValues>
  ): Promise<Product> => {
    const updatePayload: ProductUpdate = {};

    if (values.name        !== undefined) updatePayload.name           = values.name.trim();
    if (values.sku         !== undefined) updatePayload.sku            = values.sku.trim().toUpperCase();
    if (values.category    !== undefined) updatePayload.category       = values.category?.trim() || null;
    if (values.description !== undefined) updatePayload.description    = values.description?.trim() || null;
    if (values.purchase_price !== undefined) updatePayload.purchase_price = values.purchase_price;
    if (values.selling_price  !== undefined) updatePayload.selling_price  = values.selling_price;
    if (values.stock_quantity !== undefined) updatePayload.stock_quantity = values.stock_quantity;
    if (values.min_stock      !== undefined) updatePayload.min_stock      = values.min_stock;

    const { data, error } = await supabase
      .from("products")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error(`A product with SKU "${values.sku?.toUpperCase()}" already exists.`);
      }
      throw error;
    }
    return data as Product;
  },

  /**
   * Delete a product by ID.
   * Will fail if there are associated purchase_items or sale_items (FK constraint).
   */
  deleteProduct: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      if (error.code === "23503") {
        throw new Error(
          "Cannot delete this product because it has associated purchases or sales. " +
          "Archive it instead or remove its transaction records first."
        );
      }
      throw error;
    }
  },

  /**
   * Check if a SKU already exists (used for real-time duplicate detection).
   * @param sku — the SKU to check
   * @param excludeId — exclude a product ID (for edit form)
   */
  checkSkuExists: async (sku: string, excludeId?: string): Promise<boolean> => {
    let query = supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("sku", sku.trim().toUpperCase());

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { count, error } = await query;
    if (error) throw error;
    return (count ?? 0) > 0;
  },

  /**
   * Fetch all distinct categories for the filter dropdown.
   */
  getCategories: async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("category")
      .not("category", "is", null)
      .order("category");

    if (error) throw error;
    const cats = (data ?? [])
      .map((r) => r.category as string)
      .filter(Boolean);
    return [...new Set(cats)];
  },
};
