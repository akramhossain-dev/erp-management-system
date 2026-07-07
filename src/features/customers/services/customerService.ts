/**
 * customerService.ts — Supabase CRUD operations for the customers table.
 *
 * All operations are scoped to the authenticated user via Supabase RLS.
 */
import { supabase } from "@/lib/supabase";
import type { Customer } from "@/types/entities";
import type { CustomerFormValues, CustomerFilterValues } from "@/features/customers/schemas/customerSchemas";
import type { Database } from "@/types/database.types";

type CustomerUpdate = Database["public"]["Tables"]["customers"]["Update"];

export interface GetCustomersOptions {
  filters?: CustomerFilterValues;
  page?:    number;
  pageSize?: number;
}

export interface CustomersResult {
  data:  Customer[];
  count: number;
}

export const customerService = {
  /**
   * Get customers list with optional search and pagination.
   */
  getCustomers: async ({
    filters = {},
    page    = 1,
    pageSize = 10,
  }: GetCustomersOptions = {}): Promise<CustomersResult> => {
    const from = (page - 1) * pageSize;
    const to   = from + pageSize - 1;

    let query = supabase
      .from("customers")
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
      data: (data ?? []) as Customer[],
      count: count ?? 0,
    };
  },

  /**
   * Get a single customer by ID.
   */
  getCustomerById: async (id: string): Promise<Customer> => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Customer;
  },

  /**
   * Create a new customer.
   */
  createCustomer: async (
    values: CustomerFormValues,
    userId: string
  ): Promise<Customer> => {
    const { data, error } = await supabase
      .from("customers")
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
    return data as Customer;
  },

  /**
   * Update an existing customer.
   */
  updateCustomer: async (
    id: string,
    values: Partial<CustomerFormValues>
  ): Promise<Customer> => {
    const updatePayload: CustomerUpdate = {};

    if (values.name    !== undefined) updatePayload.name    = values.name.trim();
    if (values.email   !== undefined) updatePayload.email   = values.email?.trim() || null;
    if (values.phone   !== undefined) updatePayload.phone   = values.phone?.trim() || null;
    if (values.address !== undefined) updatePayload.address = values.address?.trim() || null;
    if (values.notes   !== undefined) updatePayload.notes   = values.notes?.trim() || null;

    const { data, error } = await supabase
      .from("customers")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Customer;
  },

  /**
   * Delete a customer.
   */
  deleteCustomer: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) {
      if (error.code === "23503") {
        throw new Error(
          "Cannot delete this customer because they are associated with transaction records (sales)."
        );
      }
      throw error;
    }
  },
};
