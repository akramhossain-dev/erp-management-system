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
          transition: "margin-left 300ms ease-in-out, width 300ms ease-in-out, max-width 300ms ease-in-out",
          width: `calc(100% - ${mainOffset}px)`,
          maxWidth: `calc(100% - ${mainOffset}px)`,
        }}
      >
        {/* Sticky top navbar */}
        <Navbar
          onMobileMenuToggle={() => setMobileOpen((o) => !o)}
          height={NAVBAR_HEIGHT}
        />

        {/* Page content area */}
        <main
          className="flex-1 w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 pb-16 sm:pb-20 lg:pb-24 box-border overflow-x-hidden"
          style={{
            minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
