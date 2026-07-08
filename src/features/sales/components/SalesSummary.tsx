/**
 * SalesSummary.tsx — Sidebar component showing totals of the sales form.
 */
import { useFormContext, useWatch } from "react-hook-form";
import type { Customer } from "@/types/entities";

interface SalesSummaryProps {
  customers: Customer[];
}

export function SalesSummary({ customers }: SalesSummaryProps) {
  const { control } = useFormContext();

  const selectedCustomerId = useWatch({ control, name: "customer_id" });
  const items = useWatch({ control, name: "items" }) || [];

  const customer = customers.find((c) => c.id === selectedCustomerId);

  // Compute stats
  const totalItems = items.reduce((sum: number, item: { quantity: number }) => sum + (Number(item?.quantity) || 0), 0);
  const totalAmount = items.reduce(
    (sum: number, item: { quantity: number; unit_price: number }) =>
      sum + ((Number(item?.quantity) || 0) * (Number(item?.unit_price) || 0)),
    0
  );

  return (
    <div className="card-glass p-6 flex flex-col gap-6 sticky top-24">
      <div>
        <h3 className="text-h3 text-text-primary font-semibold">Invoice Summary</h3>
        <p className="text-caption text-text-muted mt-0.5">Aggregates for the sale invoice</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Customer details card if selected */}
        {customer ? (
          <div className="p-3.5 rounded-xl border border-white/5 bg-white/2">
            <span className="text-caption text-text-muted">Customer Details</span>
            <p className="text-body-sm text-text-primary font-semibold mt-1">{customer.name}</p>
            {customer.phone && (
              <p className="text-caption text-text-secondary mt-0.5">{customer.phone}</p>
            )}
            {customer.address && (
              <p className="text-caption text-text-tertiary mt-1 truncate">{customer.address}</p>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-white/10 bg-white/1 flex items-center justify-center text-center">
            <p className="text-caption text-text-muted">No customer selected yet</p>
          </div>
        )}

        {/* Stats */}
        <div className="flex flex-col gap-3 py-2">
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-text-muted">Line Items</span>
            <span className="text-text-secondary font-medium">{items.length} lines</span>
          </div>
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-text-muted">Total Quantity</span>
            <span className="text-text-secondary font-medium">{totalItems.toLocaleString()} units</span>
          </div>
          <div className="w-full h-px bg-white/10 my-1" aria-hidden="true" />
          <div className="flex items-center justify-between">
            <span className="text-body text-text-primary font-semibold">Total Invoice Sum</span>
            <span className="text-h2 text-primary-400 font-bold font-mono">
              ৳{totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
