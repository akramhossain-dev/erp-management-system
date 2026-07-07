import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { ROUTES } from "@/utils/constants";

/**
 * AuthLayout — shell for public authentication pages (/login, /register).
 *
 * Features:
 * - Redirects authenticated users to /dashboard
 * - Rich ambient gradient background with floating orbs
 * - Glass morphism card container for auth forms
 * - Animated brand logo
 */
export function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Redirect already-authenticated users to dashboard
  if (!isLoading && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 relative overflow-hidden">

      {/* ── Ambient Background ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Top center primary blob */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.18]"
          style={{
            background: "radial-gradient(ellipse, rgba(59,130,246,0.5) 0%, transparent 65%)",
          }}
        />
        {/* Bottom-right accent blob */}
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full opacity-[0.10]"
          style={{
            background: "radial-gradient(ellipse, rgba(124,58,237,0.4) 0%, transparent 70%)",
          }}
        />
        {/* Bottom-left subtle blob */}
        <div
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(ellipse, rgba(59,130,246,0.4) 0%, transparent 70%)",
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Auth Card ────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">

        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          {/* Animated logo */}
          <div className="relative mb-5">
            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-2xl animate-pulse-ring"
              style={{
                background: "transparent",
                border:     "2px solid rgba(59,130,246,0.35)",
                transform:  "scale(1.15)",
              }}
              aria-hidden="true"
            />
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
              style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #1d4ed8 100%)",
                boxShadow:  "0 0 30px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
          </div>

          <h1 className="text-h2 text-text-primary font-bold tracking-tight">ERP Management</h1>
          <p className="text-body-sm text-text-tertiary mt-1.5">
            Modern Glass ERP System
          </p>
        </div>

        {/* Auth form area — rendered by child routes */}
        <div className="auth-card-premium p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="text-center text-caption text-text-muted mt-6">
          © {new Date().getFullYear()} ERP Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
