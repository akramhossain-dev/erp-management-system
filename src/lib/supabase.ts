import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️  Supabase environment variables are not set.\n" +
    "Please copy .env.example to .env.local and fill in your credentials.\n" +
    "Get them from: https://app.supabase.com → Project Settings → API"
  );
}

/**
 * Typed Supabase client instance.
 *
 * The generic Database type parameter enables full type-safety for:
 *   - supabase.from("products").select() → returns Product[]
 *   - supabase.rpc("get_dashboard_stats") → returns DashboardStats
 *
 * Use this client in ALL service modules and hooks.
 * The client handles session management and token refresh automatically.
 */
export const supabase = createClient<Database>(
  supabaseUrl     || "https://placeholder.supabase.co",
  supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzUzMTk4NSwiZXhwIjoxOTI5MTA3OTg1fQ.placeholder",
  {
    auth: {
      // Store session in localStorage (default)
      persistSession: true,
      // Auto-refresh the access token before it expires
      autoRefreshToken: true,
      // Detect session from URL hash (for OAuth flows)
      detectSessionInUrl: true,
    },
  }
);
