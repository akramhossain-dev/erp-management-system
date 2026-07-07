/**
 * Auth service — Supabase authentication methods.
 * Phase 2 implementation.
 */
import { supabase } from "@/lib/supabase";

export const authService = {
  /**
   * Sign in with email and password.
   * Phase 2: implement full login flow.
   */
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Register a new user.
   * Phase 2: implement full registration flow.
   */
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign out the current user.
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current session.
   */
  getSession: () => supabase.auth.getSession(),

  /**
   * Get the current user.
   */
  getUser: () => supabase.auth.getUser(),
};
