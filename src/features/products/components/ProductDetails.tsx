/**
 * ProductDetails — read-only view card for a single product's full details.
 *
 * Shown in the product edit page header or a future detail modal.
 */
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, formatRelativeTime } from "@/utils/formatters";
import { ROUTES } from "@/utils/constants";
import type { Product } from "@/types/entities";

// ─── Detail row ───────────────────────────────────────────────────────────────

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label:  string;
  value:  React.ReactNode;
  mono?:  boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <span className="text-body-sm text-text-muted">{label}</span>
      <span className={`text-body-sm text-text-primary font-medium text-right ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Stock indicator ──────────────────────────────────────────────────────────

function StockIndicator({ qty, minStock }: { qty: number; minStock: number }) {
  const pct = minStock > 0 ? Math.min((qty / (minStock * 3)) * 100, 100) : 100;

  const color = qty === 0
    ? "var(--danger-500)"
    : qty <= minStock
      ? "var(--warning-500)"
      : "var(--success-500)";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-body-sm text-text-muted">Current Stock</span>
        <span className="text-h4 text-text-primary font-bold font-mono">{qty.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
          role="progressbar"
          aria-valuenow={qty}
          aria-valuemin={0}
          aria-valuemax={minStock * 3}
          aria-label={`Stock level: ${qty} units`}
        />
      </div>
      <p className="text-caption text-text-muted">
        Minimum level: <span className="font-medium text-text-secondary">{minStock.toLocaleString()}</span> units
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ProductDetailsProps {
  product:   Product;
  /** Show action buttons (Edit, Back) */
  showActions?: boolean;
}

export function ProductDetails({ product, showActions = true }: ProductDetailsProps) {
  const margin = Number(product.selling_price) > 0
    ? ((Number(product.selling_price) - Number(product.purchase_price)) / Number(product.selling_price)) * 100
    : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Header card */}
      <div className="card-glass p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 text-text-primary font-bold">{product.name}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <code className="text-caption font-mono text-text-tertiary bg-bg-surface-400 px-2 py-0.5 rounded">
                {product.sku}
              </code>
              {product.category && (
                <Badge
                  variant="outline"
                  className="text-caption font-normal"
                  style={{ borderColor: "var(--border-default)", color: "var(--text-tertiary)" }}
                >
                  {product.category}
                </Badge>
              )}
            </div>
            {product.description && (
              <p className="text-body-sm text-text-secondary mt-2 max-w-2xl">
                {product.description}
              </p>
            )}
          </div>

          {showActions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to={ROUTES.PRODUCTS}>
                <Button
                  variant="outline"
                  size="sm"
                  style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                >
                  ← Back
                </Button>
              </Link>
              <Link to={ROUTES.PRODUCTS_EDIT(product.id)}>
                <Button
                  size="sm"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                    color:      "white",
                    border:     "none",
                  }}
                >
                  Edit Product
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pricing Details */}
        <div className="card-glass p-6 flex flex-col gap-4 lg:col-span-2">
          <h3 className="text-h4 text-text-primary font-semibold">Pricing Details</h3>
          <div>
            <DetailRow
              label="Purchase Price (Cost)"
              value={formatCurrency(Number(product.purchase_price))}
              mono
            />
            <DetailRow
              label="Selling Price"
              value={formatCurrency(Number(product.selling_price))}
              mono
            />
            <DetailRow
              label="Gross Profit"
              value={
                <span style={{ color: Number(product.selling_price) >= Number(product.purchase_price) ? "var(--success-400)" : "var(--danger-400)" }}>
                  {formatCurrency(Number(product.selling_price) - Number(product.purchase_price))}
                </span>
              }
              mono
            />
            <DetailRow
              label="Profit Margin"
              value={
                <span style={{ color: margin >= 0 ? "var(--success-400)" : "var(--danger-400)" }}>
                  {margin.toFixed(1)}%
                </span>
              }
            />
            <DetailRow label="Created" value={formatDate(product.created_at)} />
            <DetailRow label="Last Updated" value={formatRelativeTime(product.updated_at)} />
          </div>
        </div>

        {/* Inventory */}
        <div className="card-glass p-6 flex flex-col gap-4">
          <h3 className="text-h4 text-text-primary font-semibold">Inventory</h3>
          <StockIndicator
            qty={Number(product.stock_quantity)}
            minStock={Number(product.min_stock)}
          />
        </div>
      </div>
    </div>
  );
}
