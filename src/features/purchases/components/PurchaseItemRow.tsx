/**
 * PurchaseItemRow.tsx — Row within the purchase items form grid.
 *
 * Provides inputs for product selection, unit price, quantity, and subtotal.
 */
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/entities";

interface PurchaseItemRowProps {
  index:     number;
  products:  Product[];
  onRemove:  (index: number) => void;
  isRemoveDisabled: boolean;
}

export function PurchaseItemRow({
  index,
  products,
  onRemove,
  isRemoveDisabled,
}: PurchaseItemRowProps) {
  const { register, control, setValue } = useFormContext();

  // Watch unit price and quantity of this row for real-time subtotal calculation
  const qty   = useWatch({ control, name: `items.${index}.quantity` }) ?? 0;
  const price = useWatch({ control, name: `items.${index}.unit_price` }) ?? 0;
  const subtotal = qty * price;

  const handleProductChange = (productId: string) => {
    // Auto-populate unit price from purchase_price if available
    const product = products.find((p) => p.id === productId);
    if (product) {
      setValue(`items.${index}.unit_price`, Number(product.purchase_price));
    }
  };

  const selectClass = cn(
    "w-full h-12 rounded-xl text-body text-text-primary appearance-none cursor-pointer",
    "bg-transparent border border-white/10 focus:border-primary-500/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
  );

  const inputClass = cn(
    "w-full h-12 rounded-xl text-body text-text-primary",
    "bg-transparent border border-white/10 focus:border-primary-500/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
  );

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end rounded-2xl mb-3"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "1.25rem 1.5rem",
      }}
    >
      {/* Row number badge */}
      <div className="hidden md:flex md:col-span-12 items-center gap-2 mb-1">
        <span
          className="text-caption font-semibold px-2 py-0.5 rounded-md"
          style={{
            background: "rgba(59,130,246,0.12)",
            color: "rgba(96,165,250,0.9)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          Item #{index + 1}
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Product Selection */}
      <div className="md:col-span-5 flex flex-col gap-1.5">
        <label className="text-body-sm text-text-secondary font-medium">Product</label>
        <div className="relative">
          <select
            id={`items-${index}-product`}
            {...register(`items.${index}.product_id`)}
            onChange={(e) => handleProductChange(e.target.value)}
            className={selectClass}
            style={{ background: "rgba(255,255,255,0.04)", paddingLeft: "1.75rem", paddingRight: "2.75rem" }}
          >
            <option value="" style={{ background: "var(--bg-surface-300)" }}>Choose product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id} style={{ background: "var(--bg-surface-300)" }}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Unit Cost */}
      <div className="md:col-span-3 flex flex-col gap-1.5">
        <label className="text-body-sm text-text-secondary font-medium">Cost Price</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body text-text-muted" aria-hidden="true">৳</span>
          <input
            id={`items-${index}-price`}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
            className={cn(inputClass)}
            style={{ paddingLeft: "2.5rem", paddingRight: "1.5rem", background: "rgba(255,255,255,0.04)" }}
          />
        </div>
      </div>

      {/* Quantity */}
      <div className="md:col-span-2 flex flex-col gap-1.5">
        <label className="text-body-sm text-text-secondary font-medium">Qty</label>
        <input
          id={`items-${index}-qty`}
          type="number"
          min="1"
          placeholder="1"
          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
          className={inputClass}
          style={{ background: "rgba(255,255,255,0.04)", paddingLeft: "1.75rem", paddingRight: "1.5rem" }}
        />
      </div>

      {/* Subtotal & Action */}
      <div className="md:col-span-2 flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-caption text-text-muted">Subtotal</span>
          <span
            className="text-body font-mono font-bold"
            style={{ color: subtotal > 0 ? "var(--success-400)" : "var(--text-secondary)" }}
          >
            ৳{subtotal.toFixed(2)}
          </span>
        </div>

        <Button
          id={`items-${index}-remove`}
          type="button"
          variant="ghost"
          disabled={isRemoveDisabled}
          onClick={() => onRemove(index)}
          aria-label="Remove item"
          style={{
            width: "2.5rem",
            height: "2.5rem",
            padding: 0,
            borderRadius: "0.75rem",
            color: "var(--text-muted)",
            flexShrink: 0,
          }}
          className="hover:text-danger-400 hover:bg-danger-400/10 transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
          </svg>
        </Button>
      </div>
    </div>
  );
}
