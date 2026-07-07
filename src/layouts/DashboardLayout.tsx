/**
 * DashboardLayout — shell for all protected ERP dashboard pages.
 *
 * Layout: Sidebar is position:fixed. Main content uses marginLeft
 * matching sidebar width on desktop, 0 on mobile (via useMediaQuery).
 */
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Sidebar, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from "@/components/common/Sidebar";
import { MobileDrawer } from "@/components/common/Sidebar/MobileDrawer";
import { Navbar } from "@/components/common/Navbar";

const NAVBAR_HEIGHT = 64;

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(
    "erp-sidebar-collapsed",
    false,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDesktop   = useMediaQuery("(min-width: 1024px)");
  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  const mainOffset   = isDesktop ? sidebarWidth : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e17" }}>
      {/* Fixed sidebar — visible only on lg+ screens */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c: boolean) => !c)}
      />

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main wrapper — pushed right of sidebar on desktop */}
      <div
        style={{
          marginLeft: mainOffset,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 300ms ease-in-out",
        }}
      >
        {/* Sticky top navbar */}
        <Navbar
          onMobileMenuToggle={() => setMobileOpen((o) => !o)}
          height={NAVBAR_HEIGHT}
        />

        {/* Page content area */}
        <main
          style={{
            flex: 1,
            padding: "28px",
            minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
