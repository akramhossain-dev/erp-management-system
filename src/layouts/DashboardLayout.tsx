/**
 * DashboardLayout — shell for all protected ERP dashboard pages.
 *
 * Structure:
 * ┌─────────────────────────────────────────────┐
 * │  Sidebar (260px / 72px collapsed)  │  Main  │
 * │  - Brand                           │  ──────│
 * │  - Navigation groups               │  Navbar│
 * │  - Collapse toggle                 │  ──────│
 * │                                    │  Page  │
 * │                                    │  Outlet│
 * └─────────────────────────────────────────────┘
 *
 * Responsive:
 * - lg+: Fixed sidebar visible
 * - <lg: Sidebar hidden, hamburger opens MobileDrawer
 */
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Sidebar, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from "@/components/common/Sidebar";
import { MobileDrawer } from "@/components/common/Sidebar/MobileDrawer";
import { Navbar } from "@/components/common/Navbar";

const NAVBAR_HEIGHT = 64;

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(
    "erp-sidebar-collapsed",
    false
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <div className="flex min-h-screen bg-bg-base">
      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c: boolean) => !c)}
      />

      {/* ── Mobile Drawer ─────────────────────────────────────────────────── */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main
        className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{
          // Desktop: offset by sidebar width
          marginLeft: `max(0px, ${sidebarWidth}px)`,
        }}
      >
        {/* Navbar */}
        <Navbar
          onMobileMenuToggle={() => setMobileOpen((o) => !o)}
          height={NAVBAR_HEIGHT}
        />

        {/* Page content */}
        <div className="flex-1 p-6 page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
