/**
 * PurchaseDetails.tsx — Read-only details view of a single purchase invoice.
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ROUTES } from "@/utils/constants";
import type { PurchaseWithItems } from "@/types/entities";

interface PurchaseDetailsProps {
  purchase: PurchaseWithItems;
}

export function PurchaseDetails({ purchase }: PurchaseDetailsProps) {
  return (
    <div className="flex flex-col gap-6">

      {/* Header Panel */}
      <div className="card-glass p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-h3 text-text-primary font-bold">
                PO-{purchase.id.substring(0, 8).toUpperCase()}
              </h2>
              <span
                className="inline-flex items-center text-caption font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  background: purchase.status === "completed" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                  color:      purchase.status === "completed" ? "var(--success-400)" : "var(--warning-400)",
                }}
              >
                {purchase.status.toUpperCase()}
              </span>
            </div>
            <p className="text-body-sm text-text-muted mt-1">
              Recorded on {formatDate(purchase.created_at)}
            </p>
          </div>

          <Link to={ROUTES.PURCHASES}>
            <Button
              variant="outline"
              size="sm"
              style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
            >
              ← Back to Purchases
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Order details and items */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Itemized Table */}
          <div className="card-glass p-6">
            <h3 className="text-h4 text-text-primary font-semibold mb-4">Itemized Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" aria-label="Purchase line items">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
                    <th scope="col" className="pb-3 text-caption font-semibold uppercase tracking-wider">Product</th>
                    <th scope="col" className="pb-3 text-caption font-semibold uppercase tracking-wider text-right">Cost Price</th>
                    <th scope="col" className="pb-3 text-caption font-semibold uppercase tracking-wider text-right">Qty</th>
                    <th scope="col" className="pb-3 text-caption font-semibold uppercase tracking-wider text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                  {purchase.purchase_items?.map((item) => (
                    <tr key={item.id} className="hover:bg-white/1 transition-colors">
                      <td className="py-3.5 pr-3">
                        <div className="flex flex-col">
                          <span className="text-body-sm text-text-primary font-medium">{item.product?.name ?? "Unknown"}</span>
                          <span className="text-caption text-text-muted font-mono">{item.product?.sku}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-right font-mono text-body-sm text-text-secondary">
                        {formatCurrency(Number(item.unit_price))}
                      </td>
                      <td className="py-3.5 text-right font-mono text-body-sm text-text-secondary">
                        {item.quantity.toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right font-mono text-body-sm text-text-primary font-semibold">
                        {formatCurrency(Number(item.total_price))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total invoice sum */}
            <div className="flex justify-end pt-5 mt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-6">
                <span className="text-body-sm text-text-muted">Invoice Total</span>
                <span className="text-h3 text-primary-400 font-bold font-mono">
                  {formatCurrency(Number(purchase.total_amount))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Supplier and Transaction details */}
        <div className="flex flex-col gap-6">
          <div className="card-glass p-6 flex flex-col gap-4">
            <h3 className="text-h4 text-text-primary font-semibold">Supplier Information</h3>
            <div className="w-full h-px bg-white/10" aria-hidden="true" />
            {purchase.supplier ? (
              <div className="flex flex-col gap-2">
                <p className="text-body text-text-primary font-semibold">{purchase.supplier.name}</p>
                {purchase.supplier.email && (
                  <p className="text-body-sm text-text-secondary">{purchase.supplier.email}</p>
                )}
                {purchase.supplier.phone && (
                  <p className="text-body-sm text-text-secondary font-mono">{purchase.supplier.phone}</p>
                )}
                {purchase.supplier.address && (
                  <p className="text-body-sm text-text-tertiary mt-2">{purchase.supplier.address}</p>
                )}
              </div>
            ) : (
              <p className="text-body-sm text-text-muted">No supplier associated with this order.</p>
            )}
          </div>

          <div className="card-glass p-6 flex flex-col gap-4">
            <h3 className="text-h4 text-text-primary font-semibold">Transaction Info</h3>
            <div className="w-full h-px bg-white/10" aria-hidden="true" />
            <div className="flex flex-col gap-3 text-body-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Purchase Date</span>
                <span className="text-text-secondary font-medium">{formatDate(purchase.purchase_date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Recorded By</span>
                <span className="text-text-secondary font-medium">Me</span>
              </div>
              {purchase.notes && (
                <div className="flex flex-col gap-1.5 mt-2">
                  <span className="text-text-muted">Transaction Notes</span>
                  <p className="text-body-sm text-text-secondary bg-white/2 p-3 rounded-lg border border-white/5 whitespace-pre-wrap">
                    {purchase.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
