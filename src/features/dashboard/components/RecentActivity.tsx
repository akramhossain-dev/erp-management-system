/**
 * RecentActivity — Premium redesign with timeline-style feed.
 * Shows merged sales + purchases sorted by date, with status badges.
 */
import { useRecentSales, useRecentPurchases } from "@/features/dashboard/hooks/useDashboardStats";
import { formatCurrency } from "@/utils/formatters";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  completed: { bg: "rgba(34,197,94,0.12)",  color: "#4ade80", dot: "#22C55E", label: "Completed" },
  pending:   { bg: "rgba(245,158,11,0.12)", color: "#fbbf24", dot: "#F59E0B", label: "Pending"   },
  cancelled: { bg: "rgba(239,68,68,0.12)",  color: "#f87171", dot: "#EF4444", label: "Cancelled" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

// ─── Activity Type Icon ────────────────────────────────────────────────────────

function TypeIcon({ type }: { type: "sale" | "purchase" }) {
  const isSale = type === "sale";
  return (
    <div
      style={{
        width: 40,
        height: 40,
        minWidth: 40,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isSale
          ? "rgba(6,182,212,0.12)"
          : "rgba(139,92,246,0.12)",
        border: `1px solid ${isSale ? "rgba(6,182,212,0.22)" : "rgba(139,92,246,0.22)"}`,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {isSale ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ActivitySkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "12px 0",
          }}
        >
          <div
            className="skeleton"
            style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0 }}
          />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
            <div className="skeleton" style={{ height: 13, width: "55%", borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 11, width: "35%", borderRadius: 5 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <div className="skeleton" style={{ height: 13, width: 60, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 20, width: 72, borderRadius: 999 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Format helpers ───────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Activity Item ────────────────────────────────────────────────────────────

interface ActivityItem {
  id:       string;
  type:     "sale" | "purchase";
  label:    string;
  subLabel: string;
  amount:   number;
  date:     string;
  status:   string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RecentActivity() {
  const { data: sales,     isLoading: salesLoading     } = useRecentSales();
  const { data: purchases, isLoading: purchasesLoading } = useRecentPurchases();

  const isLoading = salesLoading || purchasesLoading;

  const items: ActivityItem[] = [
    ...(sales ?? []).map((s) => ({
      id:       s.id,
      type:     "sale" as const,
      label:    s.invoice_number ?? `Sale #${s.id.slice(0, 8)}`,
      subLabel: (s.customer as { name?: string } | null)?.name ?? "Unknown customer",
      amount:   Number(s.total_amount),
      date:     s.sale_date,
      status:   s.status,
    })),
    ...(purchases ?? []).map((p) => ({
      id:       p.id,
      type:     "purchase" as const,
      label:    `Purchase #${p.id.slice(0, 8)}`,
      subLabel: (p.supplier as { name?: string } | null)?.name ?? "Unknown supplier",
      amount:   Number(p.total_amount),
      date:     p.purchase_date,
      status:   p.status,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const isEmpty = !isLoading && items.length === 0;

  return (
    <div
      style={{
        background: "var(--glass-bg)",
        border: "1px solid var(--border-default)",
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Card Header ── */}
      <div
        style={{
          padding: "22px 24px 18px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            {/* Icon */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.22)",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </div>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Recent Activity
            </h2>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0, paddingLeft: 42 }}>
            Latest sales &amp; purchases
          </p>
        </div>

        {!isLoading && items.length > 0 && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 11.5,
              fontWeight: 600,
              background: "rgba(59,130,246,0.10)",
              color: "var(--primary-400)",
              border: "1px solid rgba(59,130,246,0.20)",
              flexShrink: 0,
              marginTop: 4,
            }}
          >
            {items.length} transactions
          </span>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "8px 24px 16px", flex: 1 }}>
        {isLoading ? (
          <ActivitySkeleton />
        ) : isEmpty ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 24px",
              gap: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(100,116,139,0.08)",
                border: "1px solid var(--border-subtle)",
              }}
              aria-hidden="true"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", margin: "0 0 4px" }}>
                No recent activity
              </p>
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                Transactions will appear here once you add sales or purchases.
              </p>
            </div>
          </div>
        ) : (
          <ul
            role="list"
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {items.map((item, idx) => (
              <li
                key={`${item.type}-${item.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "11px 0",
                  borderBottom: idx < items.length - 1
                    ? "1px solid var(--border-subtle)"
                    : "none",
                }}
              >
                {/* Type Icon */}
                <TypeIcon type={item.type} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: "0 0 3px",
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "var(--text-muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.subLabel}
                  </p>
                </div>

                {/* Amount + status */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 5,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {formatCurrency(item.amount)}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {formatDate(item.date)}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
