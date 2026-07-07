import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { ROUTES } from "@/utils/constants";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute — guards routes that require authentication.
 *
 * Behavior:
 * - If the session is still loading → render nothing (avoids flash)
 * - If not authenticated → redirect to /login
 * - If authenticated → render children
 *
 * Auth enforcement at the database level is handled by Supabase RLS.
 * This component is a UX-layer defense (not a security guarantee).
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Show nothing while checking session (prevents login page flash)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-base">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-body-sm text-text-tertiary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
