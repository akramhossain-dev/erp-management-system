/**
 * RevenueChart — Area chart showing monthly revenue for the last 6 months.
 * Uses Recharts with custom ERP dark theme styling.
 */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMonthlyRevenue } from "@/features/dashboard/hooks/useDashboardStats";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="h-64 flex flex-col gap-3 justify-end px-2">
      <div className="flex items-end gap-2 h-full">
        {[40, 65, 55, 80, 70, 100].map((h, i) => (
          <div
            key={i}
            className="skeleton flex-1 rounded-t-lg"
            style={{ height: `${h}%` }}
          />
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
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl text-body-sm"
      style={{
        background:  "var(--bg-surface-300)",
        border:      "1px solid var(--border-default)",
        boxShadow:   "var(--shadow-lg)",
        color:       "var(--text-primary)",
      }}
    >
      <p className="text-text-muted text-caption mb-1">{label}</p>
      <p className="font-semibold text-primary-400">
        ${(payload[0].value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RevenueChart() {
  const { data, isLoading } = useMonthlyRevenue();

  return (
    <div className="card-glass p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-h4 text-text-primary font-semibold">Revenue Overview</h2>
          <p className="text-caption text-text-muted mt-0.5">Last 6 months (completed sales)</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: "#3B82F6" }} aria-hidden="true" />
          <span className="text-caption text-text-tertiary">Revenue</span>
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data ?? []} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.0}  />
                </linearGradient>
              </defs>

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
                tickFormatter={(v) => v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`}
                width={52}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "rgba(59,130,246,0.2)", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                dot={{ r: 4, fill: "#3B82F6", stroke: "#1d4ed8", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#60a5fa", stroke: "#3B82F6", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
