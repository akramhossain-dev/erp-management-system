/**
 * Auth service — all Supabase authentication operations.
 *
 * This is the single source of truth for auth side-effects.
 * Components and hooks call this service; they never access supabase.auth directly.
 */
import { supabase } from "@/lib/supabase";
import type { AuthError } from "@supabase/supabase-js";

// ─── Error Mapping ────────────────────────────────────────────────────────────

/**
 * Translates Supabase AuthError codes into user-friendly messages.
 * Supabase error messages are technical; we remap them for the UI.
 */
export function getAuthErrorMessage(error: AuthError): string {
  const msg = error.message.toLowerCase();

  // Login errors
  if (msg.includes("invalid login credentials")) {
    return "Invalid email or password. Please try again.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please check your email and confirm your account before signing in.";
  }
  if (msg.includes("too many requests") || error.status === 429) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  // Registration errors
  if (msg.includes("user already registered") || msg.includes("already been registered")) {
    return "An account with this email already exists. Please sign in instead.";
  }
  if (msg.includes("password should be at least")) {
    return "Password must be at least 8 characters long.";
  }
  if (msg.includes("unable to validate email address")) {
    return "Please enter a valid email address.";
  }

  // Network / server errors
  if (error.status === 0 || msg.includes("fetch") || msg.includes("network")) {
    return "Network error. Please check your connection and try again.";
  }
  if (error.status && error.status >= 500) {
    return "Server error. Please try again in a moment.";
  }

  // Fallback — use the original message but capitalise it
  return error.message.charAt(0).toUpperCase() + error.message.slice(1);
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Sign in with email and password.
   * Returns session data on success; throws AuthError on failure.
   */
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Register a new user with email, password, and full name.
   * Passes full_name as metadata so the handle_new_user DB trigger can pick it up.
   */
  signUp: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign out the current user from all devices.
   * Clears the session from localStorage automatically (Supabase handles this).
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current active session.
   * Use this for initial auth check on app load.
   */
  getSession: () => supabase.auth.getSession(),

  /**
   * Get the currently authenticated user.
   * Makes a round-trip to Supabase to verify the JWT is still valid.
   */
  getUser: () => supabase.auth.getUser(),

  /**
   * Subscribe to auth state changes.
   * Use in the AuthProvider to react to SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED events.
   *
   * @returns unsubscribe function — call this in useEffect cleanup
   */
  onAuthStateChange: (
    callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
  ) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return () => subscription.unsubscribe();
  },
};
