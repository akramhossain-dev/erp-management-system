import { Outlet } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";

/**
 * DashboardLayout — shell for all protected dashboard pages.
 *
 * Structure:
 * - Fixed sidebar (260px, collapsible to 72px)
 * - Main content area (flex-grow)
 *
 * NOTE: The sidebar UI and navbar UI will be built in a later phase.
 * This phase only establishes the structural layout foundation.
 *
 * Phase 2+ will add:
 * - Sidebar with navigation items
 * - Top navbar with breadcrumbs and user menu
 * - Mobile drawer for sidebar
 */
export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(
    "erp-sidebar-collapsed",
    false
  );

  const sidebarWidth = sidebarCollapsed ? 72 : 260;

  return (
    <div className="flex min-h-screen bg-bg-base">
      {/* ── Sidebar Shell ────────────────────────────────────────────────── */}
      <aside
        id="sidebar"
        style={{ width: sidebarWidth }}
        className="fixed top-0 left-0 h-full z-50 flex-shrink-0 transition-all duration-300 ease-in-out"
        aria-label="Main navigation"
      >
        <div
          className="h-full flex flex-col"
          style={{
            background: "var(--bg-surface-200)",
            borderRight: "1px solid var(--border-subtle)",
          }}
        >
          {/* Logo / Brand header */}
          <div
            className="flex items-center gap-3 px-4 flex-shrink-0"
            style={{
              height: 64,
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                boxShadow: "0 0 12px rgba(59,130,246,0.3)",
              }}
            >
              <svg
                width="16"
                height="16"
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
            {!sidebarCollapsed && (
              <span
                className="text-h4 text-text-primary truncate"
                style={{ transition: "opacity 150ms ease" }}
              >
                ERP System
              </span>
            )}
          </div>

          {/* Navigation — will be built in Phase 2 */}
          <nav className="flex-1 p-2 overflow-y-auto" aria-label="Sidebar navigation">
            <div className="flex flex-col gap-1">
              {/* Navigation items placeholder — Phase 2 */}
              {!sidebarCollapsed && (
                <p className="text-caption text-text-muted px-3 pt-3 pb-1 uppercase tracking-widest">
                  Navigation
                </p>
              )}
              <div className="px-2 py-1.5 text-body-sm text-text-muted text-center">
                Phase 2
              </div>
            </div>
          </nav>

          {/* Collapse toggle */}
          <div
            className="p-3 flex-shrink-0"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <button
              id="sidebar-collapse-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center p-2 rounded-lg text-text-tertiary hover:text-text-primary transition-colors duration-150"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: sidebarCollapsed ? "rotate(180deg)" : "none",
                  transition: "transform 300ms ease",
                }}
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ─────────────────────────────────────────────── */}
      <main
        className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Top navbar shell — will be built in Phase 2 */}
        <header
          id="top-navbar"
          className="sticky top-0 z-40 flex items-center px-6 flex-shrink-0"
          style={{
            height: 64,
            background: "rgba(13, 17, 23, 0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div className="flex-1" />
          <p className="text-caption text-text-muted">Phase 2 — Navbar</p>
        </header>

        {/* Page content — rendered by child routes */}
        <div className="flex-1 p-6 page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
