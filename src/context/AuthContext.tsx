import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { authService } from "@/features/auth/services/authService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** The currently authenticated user, or null. */
  user: User | null;
  /** The current Supabase session, or null. */
  session: Session | null;
  /** True while the initial session is being verified. */
  isLoading: boolean;
  /** Convenience flag: true when a user is signed in. */
  isAuthenticated: boolean;
  /** Sign out the current user and clear the session. */
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
AuthContext.displayName = "AuthContext";

// ─── Provider ─────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider — single source of truth for authentication state.
 *
 * Responsibilities:
 * - Reads the initial session on mount
 * - Subscribes to onAuthStateChange to react to login/logout/refresh
 * - Exposes `logout()` action to children via context
 *
 * Auth mutations (signIn, signUp) live in:
 *   src/features/auth/hooks/useAuth.ts
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser]       = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Read the persisted session from localStorage immediately
    authService.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // 2. Subscribe to all auth events (sign in, sign out, token refresh, etc.)
    const unsubscribe = authService.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Stable logout reference — safe to use as a dependency in useEffect
  const logout = useCallback(async () => {
    await authService.signOut();
    // onAuthStateChange will fire SIGNED_OUT and clear user/session state
  }, []);

  const value: AuthContextValue = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useAuthContext — access auth state from any component.
 *
 * Throws if used outside <AuthProvider> to catch wiring mistakes early.
 *
 * @example
 * const { user, isAuthenticated, logout } = useAuthContext();
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuthContext must be used inside <AuthProvider>.\n" +
      "Make sure <AuthProvider> wraps your component tree in src/App.tsx."
    );
  }
  return context;
}
