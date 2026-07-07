/**
 * ReportsPage.tsx — Main /reports page.
 *
 * Implements tab layout synced with nested URL paths to display different reports.
 */
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
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

export function ReportsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on sub-route URL path
  const getActiveTab = (): ReportTab => {
    const path = location.pathname;
    if (path.startsWith(ROUTES.REPORTS_SALES))     return "sales";
    if (path.startsWith(ROUTES.REPORTS_PURCHASES)) return "purchases";
    if (path.startsWith(ROUTES.REPORTS_CUSTOMERS)) return "customers";
    if (path.startsWith(ROUTES.REPORTS_SUPPLIERS)) return "suppliers";
    return "products"; // Default
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tab: ReportTab) => {
    switch (tab) {
      case "sales":
        navigate(ROUTES.REPORTS_SALES);
        break;
      case "purchases":
        navigate(ROUTES.REPORTS_PURCHASES);
        break;
      case "customers":
        navigate(ROUTES.REPORTS_CUSTOMERS);
        break;
      case "suppliers":
        navigate(ROUTES.REPORTS_SUPPLIERS);
        break;
      default:
        navigate(ROUTES.REPORTS_PRODUCTS);
        break;
    }
  };

  const TABS: { id: ReportTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "products",
      label: "Inventory Value",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      ),
    },
    {
      id: "sales",
      label: "Sales Revenue",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
    },
    {
      id: "purchases",
      label: "Purchases Cost",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      id: "customers",
      label: "Customer Spending",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
      ),
    },
    {
      id: "suppliers",
      label: "Supplier Supplies",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      ),
    },
  ];

  return (
    <PageContainer variant="wide">
      {/* Page Header */}
      <div>
        <h2 className="text-h2 text-text-primary font-bold">Reports & Analytics</h2>
        <p className="text-body-sm text-text-secondary mt-1">
          Perform accounting aggregations, filter transactions, and export CSV audit reports.
        </p>
      </div>

      {/* Tabs list container */}
      <div className="flex items-center overflow-x-auto pb-1.5 scrollbar-thin border-b" style={{ borderColor: "var(--border-subtle)" }} role="tablist" aria-label="Reports categories">
        <div className="flex gap-1.5">
          {TABS.map((tab) => (
            <button
              id={`tab-btn-${tab.id}`}
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`report-panel-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "flex items-center gap-2 h-9 px-4 rounded-xl text-body-sm font-semibold transition-all flex-shrink-0 cursor-pointer",
                activeTab === tab.id
                  ? "text-primary-400 font-bold"
                  : "text-text-muted hover:text-text-secondary hover:bg-white/5"
              )}
              style={activeTab === tab.id ? { background: "rgba(59,130,246,0.12)" } : {}}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Report Panel Content */}
      <div id={`report-panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-btn-${activeTab}`}>
        {activeTab === "sales" && <SalesReportView />}
        {activeTab === "purchases" && <PurchaseReportView />}
        {activeTab === "customers" && <CustomerReportView />}
        {activeTab === "suppliers" && <SupplierReportView />}
        {activeTab === "products" && <ProductReportView />}
      </div>
    </PageContainer>
  );
}
