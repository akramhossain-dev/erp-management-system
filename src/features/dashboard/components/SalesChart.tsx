/**
 * SalesChart — Bar chart showing completed vs pending sales per month.
 * Uses Recharts with custom ERP dark theme styling.
 */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMonthlySalesCount } from "@/features/dashboard/hooks/useDashboardStats";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="h-56 flex flex-col gap-3 justify-end px-2">
      <div className="flex items-end gap-4 h-full">
        {[60, 40, 80, 55, 70, 45].map((h, i) => (
          <div key={i} className="flex-1 flex gap-1 items-end">
            <div className="skeleton flex-1 rounded-t-sm" style={{ height: `${h}%` }} />
            <div className="skeleton flex-1 rounded-t-sm" style={{ height: `${h * 0.6}%` }} />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {["Jan","Feb","Mar","Apr","May","Jun"].map((m) => (
          <div key={m} className="skeleton h-3 w-6 rounded" />
        ))}
      </div>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2.5 rounded-xl text-body-sm"
      style={{
        background: "var(--bg-surface-300)",
        border:     "1px solid var(--border-default)",
        boxShadow:  "var(--shadow-lg)",
        color:      "var(--text-primary)",
        minWidth:   "130px",
      }}
    >
      <p className="text-text-muted text-caption mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: entry.color }} />
            <span className="text-text-secondary capitalize">{entry.name}</span>
          </span>
          <span className="font-semibold" style={{ color: entry.color }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Custom Legend ────────────────────────────────────────────────────────────

function CustomLegend({ payload }: { payload?: { value: string; color: string }[] }) {
  return (
    <div className="flex items-center justify-end gap-4 mt-1">
      {(payload ?? []).map((entry) => (
        <span key={entry.value} className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: entry.color }} aria-hidden="true" />
          <span className="text-caption text-text-tertiary capitalize">{entry.value}</span>
        </span>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SalesChart() {
  const { data, isLoading } = useMonthlySalesCount();

  const isEmpty = !isLoading && (!data || data.length === 0 || data.every((d) => d.completed === 0 && d.pending === 0));

  return (
    <div className="card-glass p-6 flex flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="text-h4 text-text-primary font-semibold">Sales Activity</h2>
        <p className="text-caption text-text-muted mt-0.5">Completed vs pending orders — last 6 months</p>
      </div>

      {/* Chart */}
      {isLoading ? (
        <ChartSkeleton />
      ) : isEmpty ? (
        <div className="h-56 flex flex-col items-center justify-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}
            aria-hidden="true"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/>
              <rect x="7" y="10" width="3" height="7" rx="1"/>
              <rect x="13" y="6" width="3" height="11" rx="1"/>
              <rect x="17" y="12" width="3" height="5" rx="1"/>
            </svg>
          </div>
          <p className="text-body-sm text-text-secondary font-medium">No transactions found</p>
          <p className="text-caption text-text-muted text-center max-w-[240px]">
            Your completed and pending monthly sales volumes will appear here.
          </p>
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data ?? []}
              barCategoryGap="30%"
              barGap={3}
              margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                horizontal
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                dy={8}
              />
              <YAxis
                tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                dx={-4}
                allowDecimals={false}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Legend content={<CustomLegend />} />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="pending"   fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
