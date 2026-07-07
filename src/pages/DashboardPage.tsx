/**
 * DashboardPage — Phase 3 placeholder.
 *
 * Shows authenticated user info and a functional logout button.
 * Full dashboard will be built in Phase 4.
 */
import { useAuth } from "@/features/auth";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
  const { user, logout, isMutating } = useAuth();

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-h1 text-text-primary font-bold">Dashboard</h1>
        <p className="text-body text-text-secondary mt-1">
          Welcome back, {user?.user_metadata?.full_name ?? user?.email ?? "User"}!
        </p>
      </div>

      {/* Auth info card */}
      <div className="card-glass p-6 flex flex-col gap-4">
        <h2 className="text-h4 text-text-primary font-semibold flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-primary-400">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Session Information
        </h2>
        <div className="grid gap-3">
          <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <span className="text-body-sm text-text-tertiary">User ID</span>
            <code className="text-caption font-mono text-text-secondary bg-bg-surface-400 px-2 py-0.5 rounded">
              {user?.id?.substring(0, 16)}…
            </code>
          </div>
          <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <span className="text-body-sm text-text-tertiary">Email</span>
            <span className="text-body-sm text-text-primary">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <span className="text-body-sm text-text-tertiary">Full Name</span>
            <span className="text-body-sm text-text-primary">
              {user?.user_metadata?.full_name ?? "—"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-body-sm text-text-tertiary">Auth Status</span>
            <span className="flex items-center gap-1.5 text-success-400 text-body-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" aria-hidden="true" />
              Authenticated
            </span>
          </div>
        </div>
      </div>

      {/* Phase notice */}
      <div
        className="p-4 rounded-xl flex items-start gap-3"
        style={{
          background: "rgba(59,130,246,0.06)",
          border: "1px solid rgba(59,130,246,0.12)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <p className="text-body-sm text-text-secondary font-medium">Phase 3 Complete</p>
          <p className="text-caption text-text-muted mt-0.5">
            Authentication is working. The full dashboard with ERP modules will be built in Phase 4.
          </p>
        </div>
      </div>

      {/* Logout */}
      <div>
        <Button
          id="logout-btn"
          variant="outline"
          onClick={logout}
          disabled={isMutating}
          className="flex items-center gap-2"
          style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
        >
          {isMutating ? (
            <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" aria-hidden="true" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          )}
          Sign out
        </Button>
      </div>
    </div>
  );
}
