import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const rawUrl    = import.meta.env.VITE_SUPABASE_URL     as string | undefined;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// A valid placeholder URL (Supabase v2 validates the URL format on createClient)
const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.placeholder";

// Check if the value looks like a real Supabase project URL
const isRealUrl = (url: string | undefined): url is string => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
};

const supabaseUrl    = isRealUrl(rawUrl) ? rawUrl : PLACEHOLDER_URL;
const supabaseAnonKey = (rawAnonKey && rawAnonKey.startsWith("eyJ")) ? rawAnonKey : PLACEHOLDER_KEY;

if (!isRealUrl(rawUrl) || !rawAnonKey?.startsWith("eyJ")) {
  console.warn(
    "⚠️  Supabase credentials not configured.\n" +
    "Open .env.local and set:\n" +
    "  VITE_SUPABASE_URL=https://your-project.supabase.co\n" +
    "  VITE_SUPABASE_ANON_KEY=eyJ...\n" +
    "Get them from: https://app.supabase.com → Project Settings → API\n" +
    "Auth features will show UI but API calls will fail until configured."
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
 *
 * ⚠️ When VITE_SUPABASE_URL is not set (dev mode), a placeholder URL is used
 * so the app renders correctly. Auth operations will fail gracefully.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Store session in localStorage (default)
    persistSession: true,
    // Auto-refresh the access token before it expires
    autoRefreshToken: true,
    // Detect session from URL hash (for OAuth flows)
    detectSessionInUrl: true,
  },
});

/** True when real Supabase credentials are configured. */
export const isSupabaseConfigured = isRealUrl(rawUrl) && !!rawAnonKey?.startsWith("eyJ");
