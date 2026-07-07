/**
 * RecentActivity — Combined feed of recent sales and purchases.
 * Shows the last 5 transactions from each, sorted by date.
 */
import { useRecentSales, useRecentPurchases } from "@/features/dashboard/hooks/useDashboardStats";
import { formatCurrency } from "@/utils/formatters";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  completed: { bg: "rgba(16,185,129,0.12)",  text: "var(--success-400)", label: "Completed" },
  pending:   { bg: "rgba(245,158,11,0.12)",  text: "var(--warning-400)", label: "Pending"   },
  cancelled: { bg: "rgba(239,68,68,0.12)",   text: "var(--danger-400)",  label: "Cancelled" },
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  return (
    <span
      className="text-caption font-medium px-2 py-0.5 rounded-full"
      style={{ background: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function ActivitySkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1,2,3,4,5].map((i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <div className="skeleton w-9 h-9 rounded-xl flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="skeleton h-4 w-36 rounded" />
            <div className="skeleton h-3 w-24 rounded" />
          </div>
          <div className="skeleton h-4 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

// ─── Format helpers ───────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatAmount(amount: number): string {
  return formatCurrency(amount);
}

// ─── Activity item type ───────────────────────────────────────────────────────

interface ActivityItem {
  id:        string;
  type:      "sale" | "purchase";
  label:     string;
  subLabel:  string;
  amount:    number;
  date:      string;
  status:    string;
}

// ─── Icon components ──────────────────────────────────────────────────────────

function SaleIcon() {
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.2)" }}
      aria-hidden="true"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    </div>
  );
}

function PurchaseIcon() {
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}
      aria-hidden="true"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RecentActivity() {
  const { data: sales,     isLoading: salesLoading     } = useRecentSales();
  const { data: purchases, isLoading: purchasesLoading } = useRecentPurchases();

  const isLoading = salesLoading || purchasesLoading;

  // Merge and sort by date descending
  const items: ActivityItem[] = [
    ...(sales ?? []).map((s) => ({
      id:       s.id,
      type:     "sale" as const,
      label:    s.invoice_number ?? `Sale #${s.id.slice(0,8)}`,
      subLabel: (s.customer as { name?: string } | null)?.name ?? "Unknown customer",
      amount:   Number(s.total_amount),
      date:     s.sale_date,
      status:   s.status,
    })),
    ...(purchases ?? []).map((p) => ({
      id:       p.id,
      type:     "purchase" as const,
      label:    `Purchase #${p.id.slice(0,8)}`,
      subLabel: (p.supplier as { name?: string } | null)?.name ?? "Unknown supplier",
      amount:   Number(p.total_amount),
      date:     p.purchase_date,
      status:   p.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
   .slice(0, 8);

  const isEmpty = !isLoading && items.length === 0;

  return (
    <div className="card-glass p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h4 text-text-primary font-semibold">Recent Activity</h2>
          <p className="text-caption text-text-muted mt-0.5">Latest sales & purchases</p>
        </div>
        {!isLoading && items.length > 0 && (
          <span className="text-caption text-text-muted">
            {items.length} transactions
          </span>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <ActivitySkeleton />
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(100,116,139,0.1)" }}
            aria-hidden="true"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </div>
          <p className="text-body-sm text-text-muted">No recent activity yet</p>
          <p className="text-caption text-text-muted">Transactions will appear here once you add sales or purchases.</p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y" style={{ borderColor: "var(--border-subtle)" }} role="list">
          {items.map((item) => (
            <li key={`${item.type}-${item.id}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              {/* Icon */}
              {item.type === "sale" ? <SaleIcon /> : <PurchaseIcon />}

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-body-sm text-text-primary font-medium truncate">{item.label}</p>
                <p className="text-caption text-text-muted truncate">{item.subLabel}</p>
              </div>

              {/* Right side */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-body-sm font-semibold text-text-primary">
                  {formatAmount(item.amount)}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-caption text-text-muted">{formatDate(item.date)}</span>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
