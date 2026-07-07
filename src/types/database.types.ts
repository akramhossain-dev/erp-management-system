/**
 * Supabase Database Types — ERP Management System
 *
 * Phase 2: Updated to reflect the actual PostgreSQL schema.
 * This file mirrors what `supabase gen types typescript` would produce.
 *
 * After applying supabase/migrations/000_master_migration.sql, run:
 *   npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
 * to get fully auto-generated types with exact Supabase column names.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Status Enums ─────────────────────────────────────────────────────────────

export type TransactionStatus = "pending" | "completed" | "cancelled";

// ─── Database Interface ───────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {

      // ── users ──────────────────────────────────────────────────────────────
      users: {
        Row: {
          id:         string;
          full_name:  string;
          email:      string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id:         string;     // must match auth.users.id
          full_name?: string;
          email:      string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?:         string;
          full_name?:  string;
          email?:      string;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // ── products ───────────────────────────────────────────────────────────
      products: {
        Row: {
          id:               string;
          user_id:          string;
          name:             string;
          sku:              string;
          description:      string | null;
          category:         string | null;
          purchase_price:   number;
          selling_price:    number;
          stock_quantity:   number;
          min_stock:        number;
          created_at:       string;
          updated_at:       string;
        };
        Insert: {
          id?:              string;
          user_id:          string;
          name:             string;
          sku:              string;
          description?:     string | null;
          category?:        string | null;
          purchase_price?:  number;
          selling_price?:   number;
          stock_quantity?:  number;
          min_stock?:       number;
          created_at?:      string;
          updated_at?:      string;
        };
        Update: {
          id?:              string;
          user_id?:         string;
          name?:            string;
          sku?:             string;
          description?:     string | null;
          category?:        string | null;
          purchase_price?:  number;
          selling_price?:   number;
          stock_quantity?:  number;
          min_stock?:       number;
          updated_at?:      string;
        };
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // ── customers ──────────────────────────────────────────────────────────
      customers: {
        Row: {
          id:         string;
          user_id:    string;
          name:       string;
          email:      string | null;
          phone:      string | null;
          address:    string | null;
          notes:      string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?:        string;
          user_id:    string;
          name:       string;
          email?:     string | null;
          phone?:     string | null;
          address?:   string | null;
          notes?:     string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?:        string;
          user_id?:   string;
          name?:      string;
          email?:     string | null;
          phone?:     string | null;
          address?:   string | null;
          notes?:     string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // ── suppliers ──────────────────────────────────────────────────────────
      suppliers: {
        Row: {
          id:         string;
          user_id:    string;
          name:       string;
          email:      string | null;
          phone:      string | null;
          address:    string | null;
          notes:      string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?:        string;
          user_id:    string;
          name:       string;
          email?:     string | null;
          phone?:     string | null;
          address?:   string | null;
          notes?:     string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?:        string;
          user_id?:   string;
          name?:      string;
          email?:     string | null;
          phone?:     string | null;
          address?:   string | null;
          notes?:     string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "suppliers_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // ── purchases ──────────────────────────────────────────────────────────
      purchases: {
        Row: {
          id:            string;
          user_id:       string;
          supplier_id:   string;
          status:        TransactionStatus;
          total_amount:  number;
          purchase_date: string;
          notes:         string | null;
          created_at:    string;
          updated_at:    string;
        };
        Insert: {
          id?:            string;
          user_id:        string;
          supplier_id:    string;
          status?:        TransactionStatus;
          total_amount?:  number;
          purchase_date?: string;
          notes?:         string | null;
          created_at?:    string;
          updated_at?:    string;
        };
        Update: {
          id?:            string;
          user_id?:       string;
          supplier_id?:   string;
          status?:        TransactionStatus;
          total_amount?:  number;
          purchase_date?: string;
          notes?:         string | null;
          updated_at?:    string;
        };
        Relationships: [
          {
            foreignKeyName: "purchases_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "purchases_supplier_id_fkey";
            columns: ["supplier_id"];
            referencedRelation: "suppliers";
            referencedColumns: ["id"];
          }
        ];
      };

      // ── purchase_items ─────────────────────────────────────────────────────
      purchase_items: {
        Row: {
          id:          string;
          purchase_id: string;
          product_id:  string;
          quantity:    number;
          unit_price:  number;
          total_price: number;
          created_at:  string;
        };
        Insert: {
          id?:         string;
          purchase_id: string;
          product_id:  string;
          quantity:    number;
          unit_price:  number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?:         string;
          purchase_id?: string;
          product_id?:  string;
          quantity?:    number;
          unit_price?:  number;
          total_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "purchase_items_purchase_id_fkey";
            columns: ["purchase_id"];
            referencedRelation: "purchases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "purchase_items_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };

      // ── sales ──────────────────────────────────────────────────────────────
      sales: {
        Row: {
          id:             string;
          user_id:        string;
          customer_id:    string;
          invoice_number: string;
          status:         TransactionStatus;
          total_amount:   number;
          sale_date:      string;
          notes:          string | null;
          created_at:     string;
          updated_at:     string;
        };
        Insert: {
          id?:             string;
          user_id:         string;
          customer_id:     string;
          invoice_number:  string;
          status?:         TransactionStatus;
          total_amount?:   number;
          sale_date?:      string;
          notes?:          string | null;
          created_at?:     string;
          updated_at?:     string;
        };
        Update: {
          id?:             string;
          user_id?:        string;
          customer_id?:    string;
          invoice_number?: string;
          status?:         TransactionStatus;
          total_amount?:   number;
          sale_date?:      string;
          notes?:          string | null;
          updated_at?:     string;
        };
        Relationships: [
          {
            foreignKeyName: "sales_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sales_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customers";
            referencedColumns: ["id"];
          }
        ];
      };

      // ── sale_items ─────────────────────────────────────────────────────────
      sale_items: {
        Row: {
          id:          string;
          sale_id:     string;
          product_id:  string;
          quantity:    number;
          unit_price:  number;
          total_price: number;
          created_at:  string;
        };
        Insert: {
          id?:         string;
          sale_id:     string;
          product_id:  string;
          quantity:    number;
          unit_price:  number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?:         string;
          sale_id?:    string;
          product_id?: string;
          quantity?:   number;
          unit_price?: number;
          total_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "sale_items_sale_id_fkey";
            columns: ["sale_id"];
            referencedRelation: "sales";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sale_items_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };

    };

    // ── Views ────────────────────────────────────────────────────────────────
    Views: Record<string, never>;

    // ── Functions ────────────────────────────────────────────────────────────
    Functions: {
      get_dashboard_stats: {
        Args: Record<string, never>;
        Returns: Array<{
          total_products:  number;
          total_customers: number;
          total_suppliers: number;
          total_purchases: number;
          total_sales:     number;
          total_revenue:   number;
        }>;
      };
      generate_invoice_number: {
        Args: Record<string, never>;
        Returns: string;
      };
      get_low_stock_products: {
        Args: Record<string, never>;
        Returns: Array<{
          id:             string;
          name:           string;
          sku:            string;
          category:       string | null;
          stock_quantity: number;
          min_stock:      number;
          selling_price:  number;
        }>;
      };
    };

    // ── Enums ─────────────────────────────────────────────────────────────────
    Enums: {
      transaction_status: TransactionStatus;
    };
  };
}

// ─── Convenience Row Type Aliases ─────────────────────────────────────────────

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
