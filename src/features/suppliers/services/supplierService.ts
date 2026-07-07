/**
 * supplierService.ts — Supabase CRUD operations for the suppliers table.
 */
import { supabase } from "@/lib/supabase";
import type { Supplier } from "@/types/entities";
import type { SupplierFormValues, SupplierFilterValues } from "@/features/suppliers/schemas/supplierSchemas";
import type { Database } from "@/types/database.types";

type SupplierUpdate = Database["public"]["Tables"]["suppliers"]["Update"];

export interface GetSuppliersOptions {
  filters?: SupplierFilterValues;
  page?:    number;
  pageSize?: number;
}

export interface SuppliersResult {
  data:  Supplier[];
  count: number;
}

export const supplierService = {
  /**
   * Get suppliers list with optional search and pagination.
   */
  getSuppliers: async ({
    filters = {},
    page    = 1,
    pageSize = 10,
  }: GetSuppliersOptions = {}): Promise<SuppliersResult> => {
    const from = (page - 1) * pageSize;
    const to   = from + pageSize - 1;

    let query = supabase
      .from("suppliers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filters.search?.trim()) {
      const term = filters.search.trim();
      query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: (data ?? []) as Supplier[],
      count: count ?? 0,
    };
  },

  /**
   * Get a single supplier by ID.
   */
  getSupplierById: async (id: string): Promise<Supplier> => {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Supplier;
  },

  /**
   * Create a new supplier.
   */
  createSupplier: async (
    values: SupplierFormValues,
    userId: string
  ): Promise<Supplier> => {
    const { data, error } = await supabase
      .from("suppliers")
      .insert({
        user_id: userId,
        name:    values.name.trim(),
        email:   values.email?.trim() || null,
        phone:   values.phone?.trim() || null,
        address: values.address?.trim() || null,
        notes:   values.notes?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Supplier;
  },

  /**
   * Update an existing supplier.
   */
  updateSupplier: async (
    id: string,
    values: Partial<SupplierFormValues>
  ): Promise<Supplier> => {
    const updatePayload: SupplierUpdate = {};

    if (values.name    !== undefined) updatePayload.name    = values.name.trim();
    if (values.email   !== undefined) updatePayload.email   = values.email?.trim() || null;
    if (values.phone   !== undefined) updatePayload.phone   = values.phone?.trim() || null;
    if (values.address !== undefined) updatePayload.address = values.address?.trim() || null;
    if (values.notes   !== undefined) updatePayload.notes   = values.notes?.trim() || null;

    const { data, error } = await supabase
      .from("suppliers")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Supplier;
  },

  /**
   * Delete a supplier.
   */
  deleteSupplier: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("suppliers")
      .delete()
      .eq("id", id);

    if (error) {
      if (error.code === "23503") {
        throw new Error(
          "Cannot delete this supplier because they are associated with transaction records (purchases)."
        );
      }
      throw error;
    }
  },
};
