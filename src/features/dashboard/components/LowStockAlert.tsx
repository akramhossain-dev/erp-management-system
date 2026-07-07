/**
 * LowStockAlert — table of products with stock at or below minimum.
 * Shows a warning badge and links to the Products page.
 */
import { Link } from "react-router-dom";
import { useLowStockProducts } from "@/features/dashboard/hooks/useDashboardStats";
import { ROUTES } from "@/utils/constants";

function SkeletonRows() {
  return (
    <>
      {[1,2,3].map((i) => (
        <tr key={i}>
          <td className="py-3 pr-4"><div className="skeleton h-4 w-32 rounded" /></td>
          <td className="py-3 pr-4"><div className="skeleton h-4 w-12 rounded" /></td>
          <td className="py-3"><div className="skeleton h-5 w-16 rounded-full" /></td>
        </tr>
      ))}
    </>
  );
}

export function LowStockAlert() {
  const { data, isLoading } = useLowStockProducts();
  const hasItems = (data?.length ?? 0) > 0;

  return (
    <div className="card-glass p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}
            aria-hidden="true"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <h2 className="text-h4 text-text-primary font-semibold">Low Stock Alert</h2>
            <p className="text-caption text-text-muted">Products below minimum quantity</p>
          </div>
        </div>
        {hasItems && (
          <Link
            to={ROUTES.PRODUCTS}
            className="text-caption text-primary-400 hover:text-primary-300 transition-colors"
          >
            View all →
          </Link>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-body-sm min-w-[320px]">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <th className="text-left text-caption text-text-muted pb-2 pr-4 font-medium">Product</th>
              <th className="text-left text-caption text-text-muted pb-2 pr-4 font-medium">Stock</th>
              <th className="text-left text-caption text-text-muted pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonRows />
            ) : !hasItems ? (
              <tr>
                <td colSpan={3} className="py-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
                      aria-hidden="true"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success-400)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <p className="text-body-sm text-text-secondary font-medium">All products adequately stocked</p>
                    <p className="text-caption text-text-muted">No inventory alerts at this time.</p>
                  </div>
                </td>
              </tr>
            ) : (
              (data ?? []).map((product) => (
                <tr
                  key={product.id}
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  className="last:border-0"
                >
                  <td className="py-3 pr-4">
                    <span className="text-text-primary font-medium truncate block max-w-[160px]">
                      {product.name}
                    </span>
                    <span className="text-caption text-text-muted">{product.sku}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-text-primary font-semibold">{product.stock_quantity}</span>
                    <span className="text-text-muted"> / {product.min_stock_level} min</span>
                  </td>
                  <td className="py-3">
                    <span
                      className="status-badge"
                      style={product.stock_quantity === 0
                        ? { background: "rgba(244,63,94,0.1)", color: "var(--danger-400)", border: "1px solid rgba(244,63,94,0.2)" }
                        : { background: "rgba(245,158,11,0.1)", color: "var(--warning-400)", border: "1px solid rgba(245,158,11,0.2)" }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: product.stock_quantity === 0 ? "var(--danger-400)" : "var(--warning-400)" }}
                        aria-hidden="true"
                      />
                      {product.stock_quantity === 0 ? "Out of Stock" : "Low Stock"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
