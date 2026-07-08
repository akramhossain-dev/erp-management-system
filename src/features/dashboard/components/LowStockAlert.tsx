/**
 * LowStockAlert — Premium redesign with progress-bar style stock indicator.
 * Shows products below minimum stock level with visual urgency indicators.
 */
import { Link } from "react-router-dom";
import { useLowStockProducts } from "@/features/dashboard/hooks/useDashboardStats";
import { ROUTES } from "@/utils/constants";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {[1, 2, 3].map((i) => (
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
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <div className="skeleton" style={{ height: 13, width: "45%", borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 20, width: 70, borderRadius: 999 }} />
            </div>
            <div className="skeleton" style={{ height: 6, width: "100%", borderRadius: 999 }} />
            <div className="skeleton" style={{ height: 11, width: "35%", borderRadius: 5 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Stock Progress Bar ────────────────────────────────────────────────────────

function StockBar({ current, min }: { current: number; min: number }) {
  const isOut = current === 0;
  const pct   = min > 0 ? Math.min((current / (min * 2)) * 100, 100) : 0;
  const color = isOut ? "#EF4444" : "#F59E0B";
  const bg    = isOut ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)";

  return (
    <div
      aria-hidden="true"
      style={{
        height: 5,
        borderRadius: 999,
        background: "var(--border-subtle)",
        overflow: "hidden",
        marginTop: 6,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          borderRadius: 999,
          background: isOut ? "#EF4444" : "#F59E0B",
          transition: "width 500ms ease",
          boxShadow: isOut
            ? "0 0 6px rgba(239,68,68,0.5)"
            : "0 0 6px rgba(245,158,11,0.5)",
        }}
      />
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StockBadge({ outOfStock }: { outOfStock: boolean }) {
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
        background: outOfStock ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
        color: outOfStock ? "#f87171" : "#fbbf24",
        whiteSpace: "nowrap",
        border: `1px solid ${outOfStock ? "rgba(239,68,68,0.22)" : "rgba(245,158,11,0.22)"}`,
        flexShrink: 0,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: outOfStock ? "#EF4444" : "#F59E0B",
        }}
      />
      {outOfStock ? "Out of Stock" : "Low Stock"}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LowStockAlert() {
  const { data, isLoading } = useLowStockProducts();
  const hasItems = (data?.length ?? 0) > 0;

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
            {/* Warning icon */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.25)",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
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
              Low Stock Alert
            </h2>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0, paddingLeft: 42 }}>
            Products below minimum quantity
          </p>
        </div>

        {hasItems && (
          <Link
            to={ROUTES.PRODUCTS}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 11.5,
              fontWeight: 600,
              background: "rgba(245,158,11,0.10)",
              color: "#fbbf24",
              border: "1px solid rgba(245,158,11,0.20)",
              textDecoration: "none",
              flexShrink: 0,
              marginTop: 4,
              transition: "background 150ms, border-color 150ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(245,158,11,0.18)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.36)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(245,158,11,0.10)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.20)";
            }}
          >
            View all →
          </Link>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "8px 24px 16px", flex: 1 }}>
        {isLoading ? (
          <SkeletonRows />
        ) : !hasItems ? (
          /* All stocked — healthy state */
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
                background: "rgba(34,197,94,0.10)",
                border: "1px solid rgba(34,197,94,0.22)",
              }}
              aria-hidden="true"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", margin: "0 0 4px" }}>
                All products adequately stocked
              </p>
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                No inventory alerts at this time.
              </p>
            </div>
          </div>
        ) : (
          /* Products list */
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
            {(data ?? []).map((product, idx) => {
              const isOut = product.stock_quantity === 0;
              return (
                <li
                  key={product.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "11px 0",
                    borderBottom: idx < (data?.length ?? 0) - 1
                      ? "1px solid var(--border-subtle)"
                      : "none",
                  }}
                >
                  {/* Product icon */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      minWidth: 40,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isOut
                        ? "rgba(239,68,68,0.10)"
                        : "rgba(245,158,11,0.10)",
                      border: `1px solid ${isOut ? "rgba(239,68,68,0.22)" : "rgba(245,158,11,0.22)"}`,
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isOut ? "#f87171" : "#fbbf24"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                      <line x1="12" y1="22.08" x2="12" y2="12"/>
                    </svg>
                  </div>

                  {/* Info + bar */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Top row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                        marginBottom: 2,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {product.name}
                        </p>
                      </div>
                      <StockBadge outOfStock={isOut} />
                    </div>

                    {/* Progress bar */}
                    <StockBar
                      current={product.stock_quantity}
                      min={product.min_stock_level}
                    />

                    {/* Stock count */}
                    <p
                      style={{
                        margin: "5px 0 0",
                        fontSize: 11.5,
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: isOut ? "#f87171" : "#fbbf24",
                        }}
                      >
                        {product.stock_quantity}
                      </span>
                      <span>in stock · min {product.min_stock_level}</span>
                      {product.sku && (
                        <>
                          <span style={{ opacity: 0.4 }}>·</span>
                          <span style={{ fontFamily: "monospace", fontSize: 11 }}>
                            {product.sku}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
