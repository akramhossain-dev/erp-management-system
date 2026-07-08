/**
 * DashboardPage — Premium ERP dashboard overview.
 * Redesigned with hero greeting, quick-actions, and polished section layout.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthContext";
import { PageContainer } from "@/components/common";
import {
  DashboardStats,
  RevenueChart,
  SalesChart,
  RecentActivity,
  LowStockAlert,
} from "@/features/dashboard";
import { QUERY_KEYS, ROUTES } from "@/utils/constants";

// ─── Quick Action Item ─────────────────────────────────────────────────────────

interface QuickAction {
  id: string;
  label: string;
  sub: string;
  to: string;
  color: string;
  icon: React.ReactNode;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "new-sale",
    label: "New Sale",
    sub: "Create invoice",
    to: ROUTES.SALES_NEW,
    color: "#22C55E",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    id: "new-purchase",
    label: "New Purchase",
    sub: "Record order",
    to: ROUTES.PURCHASES_NEW,
    color: "#F59E0B",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
  {
    id: "add-product",
    label: "Add Product",
    sub: "Manage inventory",
    to: ROUTES.PRODUCTS_NEW,
    color: "#3B82F6",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    id: "view-reports",
    label: "Reports",
    sub: "Analytics & export",
    to: ROUTES.REPORTS,
    color: "#A78BFA",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

// ─── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 20,
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: 0,
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: 12.5,
              color: "var(--text-muted)",
              margin: "3px 0 0",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

// ─── Refresh Button ────────────────────────────────────────────────────────────

function RefreshButton({ onRefresh, spinning }: { onRefresh: () => void; spinning: boolean }) {
  return (
    <button
      id="dashboard-refresh-btn"
      onClick={onRefresh}
      aria-label="Refresh dashboard data"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        height: 36,
        padding: "0 14px",
        borderRadius: 10,
        border: "1px solid var(--border-default)",
        background: "var(--glass-bg)",
        color: "var(--text-tertiary)",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 150ms ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
        (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
        (e.currentTarget as HTMLElement).style.background = "var(--glass-bg-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
        (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
        (e.currentTarget as HTMLElement).style.background = "var(--glass-bg)";
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{
          transition: "transform 600ms ease",
          transform: spinning ? "rotate(360deg)" : "rotate(0deg)",
        }}
      >
        <path d="M23 4v6h-6" />
        <path d="M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
        <path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
      Refresh
    </button>
  );
}

// ─── Quick Actions ─────────────────────────────────────────────────────────────

function QuickActions() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12,
      }}
    >
      {QUICK_ACTIONS.map((action) => (
        <Link
          key={action.id}
          to={action.to}
          id={`quick-action-${action.id}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            borderRadius: 14,
            background: "var(--glass-bg)",
            border: "1px solid var(--border-default)",
            textDecoration: "none",
            transition: "all 200ms ease",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = `${action.color}12`;
            el.style.borderColor = `${action.color}40`;
            el.style.transform = "translateY(-2px)";
            el.style.boxShadow = `0 8px 24px ${action.color}18`;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "var(--glass-bg)";
            el.style.borderColor = "var(--border-default)";
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "none";
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 38,
              height: 38,
              minWidth: 38,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${action.color}18`,
              border: `1px solid ${action.color}28`,
              color: action.color,
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {action.icon}
          </div>
          {/* Text */}
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 13.5,
                fontWeight: 600,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
              }}
            >
              {action.label}
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 11.5,
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
              }}
            >
              {action.sub}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { user }    = useAuthContext();
  const queryClient = useQueryClient();
  const [spinning, setSpinning] = useState(false);

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "User";

  const now      = new Date();
  const hour     = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateStr  = now.toLocaleDateString("en-US", {
    weekday: "long",
    month:   "long",
    day:     "numeric",
    year:    "numeric",
  });

  const handleRefresh = () => {
    setSpinning(true);
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SALES });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPORTS });
    setTimeout(() => setSpinning(false), 800);
  };

  return (
    <PageContainer variant="wide">

      {/* ── Hero Header ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          borderRadius: 20,
          padding: "28px 32px",
          marginBottom: 28,
          overflow: "hidden",
          background: "linear-gradient(135deg, rgba(59,130,246,0.10) 0%, rgba(17,24,39,0.72) 60%, rgba(139,92,246,0.07) 100%)",
          border: "1px solid var(--border-default)",
        }}
      >
        {/* Ambient orbs */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -30,
            left: -20,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            {/* Greeting tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 999,
                background: "rgba(59,130,246,0.14)",
                border: "1px solid rgba(59,130,246,0.28)",
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 13 }} role="img" aria-label="wave">👋</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--primary-400)",
                  letterSpacing: "0.04em",
                }}
              >
                {greeting}
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(22px, 3vw, 30px)",
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: "0 0 6px",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Welcome back, {firstName}!
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              {dateStr} · Here's what's happening in your business
            </p>
          </div>

          <RefreshButton onRefresh={handleRefresh} spinning={spinning} />
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <SectionHeader
          title="Quick Actions"
          subtitle="Jump to common tasks"
        />
        <QuickActions />
      </div>

      {/* ── KPI Grid ─────────────────────────────────────────────────────── */}
      <section aria-label="KPI metrics" style={{ marginBottom: 32 }}>
        <SectionHeader
          title="Key Metrics"
          subtitle="Business performance at a glance"
        />
        <DashboardStats />
      </section>

      {/* ── Charts Row ───────────────────────────────────────────────────── */}
      <section aria-label="Revenue and sales charts" style={{ marginBottom: 32 }}>
        <SectionHeader
          title="Revenue & Sales"
          subtitle="Last 6 months activity"
          action={
            <Link
              to={ROUTES.REPORTS}
              style={{
                fontSize: 12.5,
                color: "var(--primary-400)",
                textDecoration: "none",
                fontWeight: 500,
                opacity: 0.85,
                transition: "opacity 150ms",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
            >
              Full reports →
            </Link>
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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
        <SectionHeader
          title="Activity & Alerts"
          subtitle="Recent transactions and inventory warnings"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          <RecentActivity />
          <LowStockAlert />
        </div>
      </section>

    </PageContainer>
  );
}
