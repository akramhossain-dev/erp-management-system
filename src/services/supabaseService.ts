/**
 * Global Supabase service helpers.
 * Used by feature service modules for common query patterns.
 */

import { supabase } from "@/lib/supabase";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

/**
 * Handle a Supabase response and throw on error.
 * Use this to wrap service calls for consistent error handling.
 */
export async function handleSupabaseResponse<T>(
  response: PostgrestSingleResponse<T>
): Promise<T> {
  if (response.error) {
    throw new Error(response.error.message);
  }
  return response.data as T;
}

/**
 * Get the current user ID from Supabase Auth.
 * Throws if no user is authenticated.
 */
export async function getCurrentUserId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("User is not authenticated.");
  }
  return user.id;
}
