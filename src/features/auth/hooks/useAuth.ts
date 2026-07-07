/**
 * useAuth — composable hook for authentication mutations.
 *
 * Provides:
 *   - Current auth state (from AuthContext)
 *   - login()    → sign in with email + password
 *   - register() → create account + auto sign in
 *   - logout()   → sign out current user
 *
 * All mutations return { success, error } for clean UI handling.
 * Errors are mapped to user-friendly messages via getAuthErrorMessage().
 *
 * @example
 * const { user, isAuthenticated, login, register, logout, isLoading } = useAuth();
 */
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthError } from "@supabase/supabase-js";
import { useAuthContext } from "@/context/AuthContext";
import { authService, getAuthErrorMessage } from "@/features/auth/services/authService";
import { ROUTES } from "@/utils/constants";
import type { LoginFormValues, RegisterFormValues } from "@/features/auth/schemas/authSchemas";

// ─── Return Type ──────────────────────────────────────────────────────────────

interface UseAuthReturn {
  // ── State (from AuthContext) ──────────────────────────────────────────────
  user:            ReturnType<typeof useAuthContext>["user"];
  session:         ReturnType<typeof useAuthContext>["session"];
  isAuthenticated: boolean;
  isLoading:       boolean;

  // ── Mutation state ────────────────────────────────────────────────────────
  /** True while any auth mutation is in-flight */
  isMutating: boolean;

  // ── Actions ───────────────────────────────────────────────────────────────
  login:    (values: LoginFormValues)    => Promise<AuthResult>;
  register: (values: RegisterFormValues) => Promise<AuthResult>;
  logout:   () => Promise<void>;
}

interface AuthResult {
  success: boolean;
  error?:  string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): UseAuthReturn {
  const { user, session, isAuthenticated, isLoading, logout: contextLogout } = useAuthContext();
  const navigate    = useNavigate();
  const [isMutating, setIsMutating] = useState(false);

  // ── Login ─────────────────────────────────────────────────────────────────

  const login = useCallback(async (values: LoginFormValues): Promise<AuthResult> => {
    setIsMutating(true);
    try {
      await authService.signIn(values.email, values.password);
      // AuthContext.onAuthStateChange will fire SIGNED_IN and update state.
      // Navigation happens after state settles.
      navigate(ROUTES.DASHBOARD, { replace: true });
      return { success: true };
    } catch (err) {
      const message = getAuthErrorMessage(err as AuthError);
      return { success: false, error: message };
    } finally {
      setIsMutating(false);
    }
  }, [navigate]);

  // ── Register ──────────────────────────────────────────────────────────────

  const register = useCallback(async (values: RegisterFormValues): Promise<AuthResult> => {
    setIsMutating(true);
    try {
      const data = await authService.signUp(
        values.email,
        values.password,
        values.full_name,
      );

      // Supabase may require email confirmation depending on project settings.
      // If the user is returned with a session, they're auto-confirmed.
      // If not (identities array is empty), they need to confirm their email.
      const needsConfirmation =
        data.user && data.user.identities && data.user.identities.length === 0;

      if (needsConfirmation) {
        return {
          success: true,
          error: "CHECK_EMAIL", // Caller interprets this as "show email confirmation message"
        };
      }

      // Auto-confirmed: session exists — navigate to dashboard
      if (data.session) {
        navigate(ROUTES.DASHBOARD, { replace: true });
      }

      return { success: true };
    } catch (err) {
      const message = getAuthErrorMessage(err as AuthError);
      return { success: false, error: message };
    } finally {
      setIsMutating(false);
    }
  }, [navigate]);

  // ── Logout ────────────────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    setIsMutating(true);
    try {
      await contextLogout();
      navigate(ROUTES.LOGIN, { replace: true });
    } finally {
      setIsMutating(false);
    }
  }, [contextLogout, navigate]);

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    isMutating,
    login,
    register,
    logout,
  };
}
