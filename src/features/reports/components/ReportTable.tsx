/**
 * ReportTable.tsx — Premium data table for report views.
 * Features: loading skeleton, empty state, totals row, hover effects.
 */
import { cn } from "@/lib/utils";

export interface ReportColumnConfig<T> {
  header:     string;
  render:     (row: T) => React.ReactNode;
  className?: string;
  totalKey?:  keyof T;
}

interface ReportTableProps<T> {
  data:           T[];
  columns:        ReportColumnConfig<T>[];
  isLoading:      boolean;
  summaryLabel?:  string;
  className?:     string;
}

export function ReportTable<T>({
  data,
  columns,
  isLoading,
  summaryLabel = "Total",
  className,
}: ReportTableProps<T>) {
  const hasTotals = columns.some((col) => col.totalKey !== undefined);

  const columnTotals = columns.map((col) => {
    if (!col.totalKey) return null;
    return data.reduce((sum, row) => {
      const val = Number(row[col.totalKey!]);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  });

  const isCurrencyKey = (key?: keyof T) =>
    key === "total_amount" ||
    key === "total_spent" ||
    key === "total_supplied_val" ||
    key === "inventory_value";

  return (
    <div
      className={cn(className)}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse" }}
          aria-label="Report results"
        >
          {/* Head */}
          <thead>
            <tr
              style={{
                background: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {columns.map((col, i) => (
                <th
                  key={i}
                  scope="col"
                  className={col.className}
                  style={{
                    padding: "12px 18px",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "rgba(100,116,139,0.8)",
                    whiteSpace: "nowrap",
                    textAlign: "left",
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, rIdx) => (
                <tr
                  key={rIdx}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className={col.className}
                      style={{ padding: "14px 18px" }}
                    >
                      <div
                        style={{
                          height: 14,
                          width: cIdx === 0 ? "60%" : "40%",
                          borderRadius: 6,
                          background: "rgba(255,255,255,0.06)",
                          animation: "pulse 1.5s ease-in-out infinite",
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: "64px 24px", textAlign: "center" }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                    aria-hidden="true"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(100,116,139,0.5)" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(148,163,184,0.9)", margin: "0 0 4px" }}>
                    No records found
                  </p>
                  <p style={{ fontSize: 12.5, color: "rgba(100,116,139,0.7)", margin: 0 }}>
                    Try adjusting the filter options above
                  </p>
                </td>
              </tr>
            ) : (
              data.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  style={{
                    borderBottom: rIdx < data.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    transition: "background 150ms",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className={col.className}
                      style={{
                        padding: "13px 18px",
                        fontSize: 13.5,
                        color: "#cbd5e1",
                        textAlign: "left",
                      }}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}

            {/* Totals Row */}
            {!isLoading && data.length > 0 && hasTotals && (
              <tr
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderTop: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                {columns.map((col, i) => {
                  const total = columnTotals[i];
                  const isFirst = i === 0;
                  return (
                    <td
                      key={i}
                      className={col.className}
                      style={{
                        padding: "13px 18px",
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: "#f1f5f9",
                        textAlign: "left",
                      }}
                    >
                      {isFirst ? (
                        <span style={{ color: "rgba(148,163,184,0.8)", fontWeight: 600, fontFamily: "inherit" }}>
                          {summaryLabel}
                        </span>
                      ) : total !== null ? (
                        isCurrencyKey(col.totalKey) ? (
                          `৳${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        ) : (
                          total.toLocaleString()
                        )
                      ) : ""}
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Row count footer */}
      {!isLoading && data.length > 0 && (
        <div
          style={{
            padding: "10px 18px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            fontSize: 12,
            color: "rgba(100,116,139,0.7)",
          }}
        >
          {data.length} record{data.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
