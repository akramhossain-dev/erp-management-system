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

const NAV_ITEMS = [
  { label: "Dashboard", to: ROUTES.DASHBOARD, icon: <DashboardIcon />, exact: true },
  { label: "Products",  to: ROUTES.PRODUCTS,  icon: <ProductsIcon />  },
  { label: "Customers", to: ROUTES.CUSTOMERS, icon: <CustomersIcon /> },
  { label: "Suppliers", to: ROUTES.SUPPLIERS, icon: <SuppliersIcon /> },
  { label: "Purchases", to: ROUTES.PURCHASES, icon: <PurchasesIcon /> },
  { label: "Sales",     to: ROUTES.SALES,     icon: <SalesIcon />     },
  { label: "Reports",   to: ROUTES.REPORTS,   icon: <ReportsIcon />   },
];

interface MobileDrawerProps {
  open:    boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const location = useLocation();

  // Close on route change
  useEffect(() => { onClose(); }, [location.pathname]);

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
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden",
          "transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed top-0 left-0 h-full w-72 z-50 flex flex-col lg:hidden",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          background:  "var(--bg-surface-200)",
          borderRight: "1px solid var(--border-subtle)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 flex-shrink-0"
          style={{ height: 64, borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
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
            <span className="text-h4 text-text-primary font-semibold">ERP System</span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
            aria-label="Close navigation menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl",
                    "text-body-sm font-medium transition-colors duration-150",
                    isActive
                      ? "text-primary-400 bg-primary-500/10"
                      : "text-text-tertiary hover:text-text-secondary hover:bg-white/4",
                  )}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary-500"
                      aria-hidden="true"
                    />
                  )}
                  <span className="flex-shrink-0" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
