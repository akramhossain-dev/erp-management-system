/**
 * ReportsPage.tsx — Main /reports page.
 * Redesigned with premium tab navigation and consistent spacing.
 */
import { useLocation, useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/common";
import { ROUTES } from "@/utils/constants";
import {
  ProductReportView,
  CustomerReportView,
  SupplierReportView,
  PurchaseReportView,
  SalesReportView,
} from "@/features/reports";

type ReportTab = "products" | "customers" | "suppliers" | "purchases" | "sales";

const TABS: { id: ReportTab; label: string; icon: React.ReactNode; color: string }[] = [
  {
    id: "products",
    label: "Inventory",
    color: "#60a5fa",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    ),
  },
  {
    id: "sales",
    label: "Sales",
    color: "#34d399",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    id: "purchases",
    label: "Purchases",
    color: "#f59e0b",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
  {
    id: "customers",
    label: "Customers",
    color: "#a78bfa",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: "suppliers",
    label: "Suppliers",
    color: "#fb923c",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
];

export function ReportsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = (): ReportTab => {
    const path = location.pathname;
    if (path.startsWith(ROUTES.REPORTS_SALES))     return "sales";
    if (path.startsWith(ROUTES.REPORTS_PURCHASES)) return "purchases";
    if (path.startsWith(ROUTES.REPORTS_CUSTOMERS)) return "customers";
    if (path.startsWith(ROUTES.REPORTS_SUPPLIERS)) return "suppliers";
    return "products";
  };

  const activeTab = getActiveTab();
  const activeTabData = TABS.find((t) => t.id === activeTab)!;

  const handleTabClick = (tab: ReportTab) => {
    const routeMap: Record<ReportTab, string> = {
      sales:     ROUTES.REPORTS_SALES,
      purchases: ROUTES.REPORTS_PURCHASES,
      customers: ROUTES.REPORTS_CUSTOMERS,
      suppliers: ROUTES.REPORTS_SUPPLIERS,
      products:  ROUTES.REPORTS_PRODUCTS,
    };
    navigate(routeMap[tab]);
  };

  return (
    <PageContainer variant="wide">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${activeTabData.color}22, ${activeTabData.color}11)`,
              border: `1px solid ${activeTabData.color}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: activeTabData.color,
              transition: "all 300ms ease",
            }}
            aria-hidden="true"
          >
            {activeTabData.icon}
          </div>
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              Reports &amp; Analytics
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "2px 0 0" }}>
              Aggregated insights, transaction history &amp; CSV exports
            </p>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ──────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--glass-bg)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 16,
          padding: "6px",
          display: "flex",
          gap: 4,
          overflowX: "auto",
          scrollbarWidth: "none",
          marginBottom: 28,
          flexShrink: 0,
        }}
        role="tablist"
        aria-label="Report categories"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`report-panel-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 18px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 200ms ease",
                background: isActive ? `linear-gradient(135deg, ${tab.color}22, ${tab.color}0e)` : "transparent",
                color: isActive ? tab.color : "var(--text-tertiary)",
                boxShadow: isActive ? `0 0 0 1px ${tab.color}38` : "none",
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
              <span
                style={{
                  display: "flex",
                  color: isActive ? tab.color : "var(--text-muted)",
                  transition: "color 200ms",
                }}
                aria-hidden="true"
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Report Panel ─────────────────────────────────────────────── */}
      <div
        id={`report-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-btn-${activeTab}`}
      >
        {activeTab === "sales"     && <SalesReportView />}
        {activeTab === "purchases" && <PurchaseReportView />}
        {activeTab === "customers" && <CustomerReportView />}
        {activeTab === "suppliers" && <SupplierReportView />}
        {activeTab === "products"  && <ProductReportView />}
      </div>
    </PageContainer>
  );
}
