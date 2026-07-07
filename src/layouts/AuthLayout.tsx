import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { ROUTES } from "@/utils/constants";

/**
 * AuthLayout — shell for public authentication pages (/login, /register).
 *
 * Features:
 * - Redirects authenticated users to /dashboard
 * - Centered layout with ambient gradient background
 * - Glass morphism card container for auth forms
 */
export function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Redirect already-authenticated users to dashboard
  if (!isLoading && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(59,130,246,0.4) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[300px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(ellipse, rgba(59,130,246,0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Auth card container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #2563EB)",
              boxShadow: "0 0 24px rgba(59,130,246,0.4)",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <h1 className="text-h2 text-text-primary">ERP Management</h1>
          <p className="text-body-sm text-text-tertiary mt-1">
            Modern Glass ERP System
          </p>
        </div>

        {/* Auth form area — rendered by child routes */}
        <div className="card-glass p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="text-center text-caption text-text-muted mt-6">
          © {new Date().getFullYear()} ERP Management System
        </p>
      </div>
    </div>
  );
}
