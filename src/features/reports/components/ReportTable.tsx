/**
 * ReportTable.tsx — Dynamic reusable tabular grid for reports.
 *
 * Supports dynamic columns, skeleton loading, empty state, and totals summary row.
 */
import { cn } from "@/lib/utils";

export interface ReportColumnConfig<T> {
  header:     string;
  render:     (row: T) => React.ReactNode;
  className?: string;
  totalKey?:  keyof T; // if provided, aggregates sum of this numeric key
}

interface ReportTableProps<T> {
  data:       T[];
  columns:    ReportColumnConfig<T>[];
  isLoading:  boolean;
  summaryLabel?: string;
}

export function ReportTable<T>({
  data,
  columns,
  isLoading,
  summaryLabel = "Total Summary",
}: ReportTableProps<T>) {
  // Compute column totals if configured
  const hasTotals = columns.some((col) => col.totalKey !== undefined);

  const columnTotals = columns.map((col) => {
    if (!col.totalKey) return null;
    return data.reduce((sum, row) => {
      const val = Number(row[col.totalKey!]);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  });

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{ border: "1px solid var(--border-subtle)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-label="Report results">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-subtle)" }}>
              {columns.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-caption text-text-muted font-semibold uppercase tracking-wider",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, rIndex) => (
                <tr key={rIndex}>
                  {columns.map((col, cIndex) => (
                    <td key={cIndex} className={cn("px-4 py-3.5", col.className)}>
                      <div className="skeleton h-4 w-24 rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty View
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <p className="text-body text-text-secondary font-medium">No records found matching filters.</p>
                  <p className="text-caption text-text-muted mt-1">Try adjusting the filter options above.</p>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((row, rIndex) => (
                <tr key={rIndex} className="hover:bg-white/1 transition-colors">
                  {columns.map((col, cIndex) => (
                    <td key={cIndex} className={cn("px-4 py-3.5 text-body-sm text-text-primary", col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}

            {/* Totals Row */}
            {!isLoading && data.length > 0 && hasTotals && (
              <tr style={{ background: "rgba(255,255,255,0.03)", borderTop: "2px solid var(--border-subtle)" }}>
                {columns.map((col, index) => {
                  const total = columnTotals[index];
                  const isFirst = index === 0;

                  return (
                    <td
                      key={index}
                      className={cn(
                        "px-4 py-3 text-body-sm font-bold text-text-primary font-mono",
                        col.className
                      )}
                    >
                      {isFirst ? (
                        <span className="font-sans font-bold text-text-secondary">{summaryLabel}</span>
                      ) : total !== null ? (
                        col.totalKey === "total_amount" || col.totalKey === "total_spent" || col.totalKey === "total_supplied_val" || col.totalKey === "inventory_value" ? (
                          `৳${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        ) : (
                          total.toLocaleString()
                        )
                      ) : (
                        ""
                      )}
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
