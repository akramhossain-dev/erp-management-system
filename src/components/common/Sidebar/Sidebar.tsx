/**
 * Sidebar — collapsible navigation sidebar for the ERP dashboard.
 *
 * Features:
 * - Fixed-position, full-height
 * - 260px expanded / 72px collapsed with smooth transition
 * - Active route highlighting
 * - Hover tooltips when collapsed (via title attribute)
 * - Responsive: hidden on mobile (mobile uses drawer in Navbar)
 * - Collapse toggle button at bottom
 */
import { NavLink, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/constants";
import {
  DashboardIcon,
  ProductsIcon,
  CustomersIcon,
  SuppliersIcon,
  PurchasesIcon,
  SalesIcon,
  ReportsIcon,
  ChevronLeftIcon,
} from "@/components/common/NavIcons";

// ─── Nav Item Config ──────────────────────────────────────────────────────────

interface NavItem {
  label:   string;
  to:      string;
  icon:    React.ReactNode;
  exact?:  boolean;
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", to: ROUTES.DASHBOARD, icon: <DashboardIcon />, exact: true },
    ],
  },
  {
    title: "Inventory",
    items: [
      { label: "Products",  to: ROUTES.PRODUCTS,  icon: <ProductsIcon />  },
      { label: "Customers", to: ROUTES.CUSTOMERS, icon: <CustomersIcon /> },
      { label: "Suppliers", to: ROUTES.SUPPLIERS, icon: <SuppliersIcon /> },
    ],
  },
  {
    title: "Transactions",
    items: [
      { label: "Purchases", to: ROUTES.PURCHASES, icon: <PurchasesIcon /> },
      { label: "Sales",     to: ROUTES.SALES,     icon: <SalesIcon />     },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Reports", to: ROUTES.REPORTS, icon: <ReportsIcon /> },
    ],
  },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export const SIDEBAR_WIDTH           = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

interface SidebarProps {
  collapsed:   boolean;
  onToggle:    () => void;
  /** Optional: controlled via mobile drawer */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const width = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <>
      {/* Sidebar panel */}
      <aside
        id="sidebar"
        style={{ width }}
        className={cn(
          "fixed top-0 left-0 h-full z-50 flex-shrink-0",
          "transition-all duration-300 ease-in-out",
          // Hidden on mobile — mobile nav is in header
          "hidden lg:block",
        )}
        aria-label="Main navigation"
      >
        <div
          className="h-full flex flex-col"
          style={{
            background:  "var(--bg-surface-200)",
            borderRight: "1px solid var(--border-subtle)",
          }}
        >
          {/* ── Brand ─────────────────────────────────────────────────────── */}
          <div
            className="flex items-center gap-3 px-4 flex-shrink-0 overflow-hidden"
            style={{ height: 64, borderBottom: "1px solid var(--border-subtle)" }}
          >
            {/* Logo mark */}
            <div
              className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                boxShadow:  "0 0 12px rgba(59,130,246,0.3)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>

            {/* Brand name — hidden when collapsed */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ width: collapsed ? 0 : "auto", opacity: collapsed ? 0 : 1 }}
            >
              <span className="text-h4 text-text-primary whitespace-nowrap font-semibold">
                ERP System
              </span>
              <p className="text-caption text-text-muted whitespace-nowrap">Management</p>
            </div>
          </div>

          {/* ── Navigation ────────────────────────────────────────────────── */}
          <nav className="flex-1 py-3 px-2 overflow-y-auto overflow-x-hidden" aria-label="Sidebar navigation">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="mb-1">
                {/* Group label — hidden when collapsed */}
                {!collapsed && (
                  <p className="text-caption text-text-muted px-3 py-2 uppercase tracking-widest font-medium">
                    {group.title}
                  </p>
                )}
                {collapsed && <div className="py-2 border-b border-white/5 mx-2 mb-1" />}

                {group.items.map((item) => {
                  // Active state: exact match for dashboard, prefix match for others
                  const isActive = item.exact
                    ? location.pathname === item.to
                    : location.pathname.startsWith(item.to);

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5",
                        "text-body-sm font-medium",
                        "transition-all duration-150 group",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                        isActive
                          ? "text-primary-400"
                          : "text-text-tertiary hover:text-text-secondary",
                      )}
                      style={{
                        background: isActive
                          ? "rgba(59,130,246,0.1)"
                          : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                        }
                      }}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                          style={{ background: "var(--primary-500)" }}
                          aria-hidden="true"
                        />
                      )}

                      {/* Icon */}
                      <span className="flex-shrink-0" aria-hidden="true">
                        {item.icon}
                      </span>

                      {/* Label — hidden when collapsed */}
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* ── Collapse Toggle ────────────────────────────────────────────── */}
          <div
            className="p-3 flex-shrink-0"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <button
              id="sidebar-collapse-btn"
              onClick={onToggle}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "w-full flex items-center justify-center p-2 rounded-xl",
                "text-text-muted hover:text-text-secondary",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              )}
              style={{ background: "transparent" }}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeftIcon
                size={18}
                className={collapsed ? "rotate-180 transition-transform duration-300" : "transition-transform duration-300"}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
