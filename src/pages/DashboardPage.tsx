/**
 * DashboardPage — main ERP dashboard overview.
 *
 * Layout:
 * ┌─────────────────────────────────────────────────┐
 * │ Header: greeting + date + refresh button        │
 * │─────────────────────────────────────────────────│
 * │ KPI Grid (6 cards)                              │
 * │─────────────────────────────────────────────────│
 * │ Revenue Chart (2/3) │ Sales Chart (1/3)         │
 * │─────────────────────────────────────────────────│
 * │ Recent Activity (1/2) │ Low Stock Alert (1/2)   │
 * └─────────────────────────────────────────────────┘
 *
 * Phase 10: Enhanced greeting section, better section spacing/labels.
 */
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/common";
import {
  DashboardStats,
  RevenueChart,
  SalesChart,
  RecentActivity,
  LowStockAlert,
} from "@/features/dashboard";
import { QUERY_KEYS } from "@/utils/constants";

// ─── Refresh button ───────────────────────────────────────────────────────────

function RefreshButton({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Button
      id="dashboard-refresh-btn"
      variant="outline"
      size="sm"
      onClick={onRefresh}
      className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-caption font-medium text-text-secondary border-border-subtle hover:text-text-primary hover:bg-white/5 transition-all duration-150"
      style={{
        background: "rgba(255,255,255,0.04)",
      }}
      aria-label="Refresh dashboard data"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M23 4v6h-6" />
        <path d="M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
        <path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
      Refresh
    </Button>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        className="text-caption font-semibold uppercase tracking-[0.08em] text-text-muted"
      >
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { user }      = useAuthContext();
  const queryClient   = useQueryClient();
  const firstName     = user?.user_metadata?.full_name?.split(" ")[0]
                        ?? user?.email?.split("@")[0]
                        ?? "User";

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SALES });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPORTS });
  };

  // Current date for greeting
  const now       = new Date();
  const hour      = now.getHours();
  const greeting  = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateStr   = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <PageContainer variant="wide">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-h2 text-text-primary font-bold tracking-tight">
              {greeting}, {firstName}!
            </h2>
            <span
              className="text-h3 select-none hidden sm:inline"
              role="img"
              aria-label="waving hand"
            >
              👋
            </span>
          </div>
          <p className="text-body-sm text-text-tertiary">{dateStr}</p>
        </div>
        <RefreshButton onRefresh={handleRefresh} />
      </div>

      {/* ── KPI Grid ─────────────────────────────────────────────────────── */}
      <section aria-label="KPI metrics">
        <SectionLabel>Key Metrics</SectionLabel>
        <DashboardStats />
      </section>

      {/* ── Charts Row ───────────────────────────────────────────────────── */}
      <section aria-label="Revenue and sales charts">
        <SectionLabel>Revenue & Sales</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <SalesChart />
          </div>
        </div>
      </section>

      {/* ── Bottom Row ───────────────────────────────────────────────────── */}
      <section aria-label="Recent activity and alerts">
        <SectionLabel>Activity & Alerts</SectionLabel>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RecentActivity />
          <LowStockAlert />
        </div>
      </section>

    </PageContainer>
  );
}
