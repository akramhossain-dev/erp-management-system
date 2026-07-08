/**
 * MobileDrawer — slide-in overlay drawer for mobile sidebar navigation.
 * Shown when the hamburger button in Navbar is tapped.
 * Contains the same nav items as the desktop Sidebar.
 */
import { useEffect } from "react";
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
} from "@/components/common/NavIcons";

const NAV_GROUPS = [
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

interface MobileDrawerProps {
  open:    boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const location = useLocation();

  // Close on route change
  useEffect(() => { onClose(); }, [location.pathname]);

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Trap scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else       document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden",
          "transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        style={{ zIndex: 49 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed top-0 left-0 h-full flex flex-col lg:hidden",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          zIndex: 50,
          width: "min(300px, 85vw)",
          background: "linear-gradient(180deg, var(--bg-surface-100) 0%, var(--bg-base) 100%)",
          borderRight: "1px solid var(--border-subtle)",
          boxShadow: "6px 0 36px rgba(0,0,0,0.65)",
        }}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{
            height: 64,
            padding: "0 20px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Logo icon */}
            <div
              style={{
                width: 36,
                height: 36,
                minWidth: 36,
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
            {/* Brand text */}
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", lineHeight: "1.25", margin: 0 }}>
                ERP System
              </p>
              <p style={{ fontSize: 11, color: "var(--primary-400)", lineHeight: "1.25", marginTop: 1, opacity: 0.85 }}>
                Management Suite
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              border: "1px solid var(--border-default)",
              background: "var(--glass-bg)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-tertiary)",
              flexShrink: 0,
              transition: "background 150ms, color 150ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--glass-bg-hover)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--glass-bg)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── Navigation ─────────────────────────────────────────────── */}
        <nav
          aria-label="Mobile navigation"
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "12px 10px 24px",
            scrollbarWidth: "none",
          }}
        >
          {NAV_GROUPS.map((group, groupIdx) => (
            <div key={group.title} style={{ marginBottom: 4, marginTop: groupIdx > 0 ? 20 : 0 }}>
              {/* Group label */}
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                  opacity: 0.75,
                  padding: "4px 12px 6px",
                  margin: 0,
                  userSelect: "none",
                }}
              >
                {group.title}
              </p>

              {/* Items */}
              {group.items.map((item) => {
                const isActive = (item as { exact?: boolean }).exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    aria-current={isActive ? "page" : undefined}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      margin: "2px 0",
                      padding: "10px 14px 10px 16px",
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "background 150ms, color 150ms",
                      color: isActive ? "var(--primary-400)" : "var(--text-tertiary)",
                      background: isActive ? "var(--accent-soft)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = "var(--glass-bg-hover)";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
                      }
                    }}
                  >
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
                          background: "var(--primary-500)",
                          boxShadow: "var(--glow-primary)",
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
                    <span style={{ flex: 1 }}>{item.label}</span>

                    {/* Active dot */}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "var(--primary-400)",
                          boxShadow: "0 0 6px var(--primary-500)",
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
      </div>
    </>
  );
}
