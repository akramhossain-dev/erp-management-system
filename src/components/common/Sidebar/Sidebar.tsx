/**
 * Sidebar — collapsible navigation sidebar for the ERP dashboard.
 * Fixed position, full height. Main content is offset via marginLeft in DashboardLayout.
 */
import { NavLink, useLocation } from "react-router-dom";
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

// ─── Constants ────────────────────────────────────────────────────────────────

export const SIDEBAR_WIDTH           = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 68;

// ─── Nav Config ───────────────────────────────────────────────────────────────

interface NavItem {
  label:  string;
  to:     string;
  icon:   React.ReactNode;
  exact?: boolean;
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

// ─── Component ────────────────────────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean;
  onToggle:  () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const width = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <aside
      id="sidebar"
      aria-label="Main navigation"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width,
        zIndex: 40,
        transition: "width 300ms ease-in-out",
        overflow: "hidden",
        background: "linear-gradient(180deg, #0c1120 0%, #0e1528 100%)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "2px 0 20px rgba(0,0,0,0.5)",
      }}
      className="hidden lg:flex flex-col"
    >
      {/* ── Brand ────────────────────────────────────────────────────────── */}
      <div
        style={{
          height: 64,
          minHeight: 64,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: collapsed ? "0 18px" : "0 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
          transition: "padding 300ms ease-in-out",
        }}
      >
        {/* Logo icon */}
        <div
          style={{
            width: 34,
            height: 34,
            minWidth: 34,
            borderRadius: 10,
            background: "linear-gradient(135deg, #3B82F6, #1d4ed8)",
            boxShadow: "0 0 14px rgba(59,130,246,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>

        {/* Brand text — hidden when collapsed */}
        <div
          style={{
            overflow: "hidden",
            opacity: collapsed ? 0 : 1,
            maxWidth: collapsed ? 0 : 180,
            transition: "opacity 200ms, max-width 300ms ease-in-out",
            flexShrink: 0,
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", whiteSpace: "nowrap", lineHeight: "1.25" }}>
            ERP System
          </p>
          <p style={{ fontSize: 11, color: "rgba(96,165,250,0.85)", whiteSpace: "nowrap", lineHeight: "1.25", marginTop: 1 }}>
            Management Suite
          </p>
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav
        aria-label="Sidebar navigation"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "10px 8px",
          scrollbarWidth: "none",
        }}
      >
        {NAV_GROUPS.map((group, groupIndex) => (
          <div
            key={group.title}
            style={{ marginBottom: 4, marginTop: groupIndex > 0 ? 16 : 0 }}
          >
            {/* Group label or divider */}
            {!collapsed ? (
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "rgba(100,116,139,0.65)",
                  padding: "4px 10px 6px",
                  margin: 0,
                  userSelect: "none",
                }}
              >
                {group.title}
              </p>
            ) : (
              groupIndex > 0 && (
                <div
                  style={{
                    height: 1,
                    background: "rgba(255,255,255,0.06)",
                    margin: "8px 10px",
                  }}
                />
              )
            )}

            {/* Nav items */}
            {group.items.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    margin: "2px 0",
                    padding: collapsed ? "10px 0" : "9px 10px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    borderRadius: 10,
                    fontSize: 13.5,
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "background 150ms, color 150ms",
                    color: isActive ? "#60a5fa" : "rgba(148,163,184,0.85)",
                    background: isActive ? "rgba(59,130,246,0.1)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                      (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "rgba(148,163,184,0.85)";
                    }
                  }}
                >
                  {/* Active bar indicator */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 3,
                        height: 18,
                        borderRadius: "0 4px 4px 0",
                        background: "#3B82F6",
                        boxShadow: "0 0 8px rgba(59,130,246,0.7)",
                      }}
                    />
                  )}

                  {/* Icon */}
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      transform: isActive ? "scale(1.08)" : "scale(1)",
                      transition: "transform 150ms",
                    }}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  {!collapsed && (
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.label}
                    </span>
                  )}

                  {/* Active dot */}
                  {isActive && !collapsed && (
                    <span
                      aria-hidden="true"
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#60a5fa",
                        boxShadow: "0 0 6px #3B82F6",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Collapse Toggle ──────────────────────────────────────────────── */}
      <div
        style={{
          padding: "10px 8px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
        }}
      >
        <button
          id="sidebar-collapse-btn"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            borderRadius: 10,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "rgba(100,116,139,0.7)",
            transition: "background 150ms, color 150ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
            (e.currentTarget as HTMLElement).style.color = "#94a3b8";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "rgba(100,116,139,0.7)";
          }}
        >
          <ChevronLeftIcon
            size={17}
            className={collapsed ? "rotate-180 transition-transform duration-300" : "transition-transform duration-300"}
          />
        </button>
      </div>
    </aside>
  );
}
