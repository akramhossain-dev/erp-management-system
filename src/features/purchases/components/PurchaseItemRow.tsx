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
    "w-full h-10 px-3 rounded-xl text-body-sm text-text-primary appearance-none pr-8 cursor-pointer",
    "bg-transparent border border-white/10 focus:border-primary-500/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
  );

  const inputClass = cn(
    "w-full h-10 px-3 rounded-xl text-body-sm text-text-primary",
    "bg-transparent border border-white/10 focus:border-primary-500/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 rounded-xl border border-white/5 bg-white/1 mb-3">
      {/* Product Selection */}
      <div className="md:col-span-5 flex flex-col gap-1.5">
        <label className="text-caption text-text-secondary font-medium">Product</label>
        <div className="relative">
          <select
            id={`items-${index}-product`}
            {...register(`items.${index}.product_id`)}
            onChange={(e) => handleProductChange(e.target.value)}
            className={selectClass}
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <option value="" style={{ background: "var(--bg-surface-300)" }}>Choose product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id} style={{ background: "var(--bg-surface-300)" }}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Unit Cost */}
      <div className="md:col-span-3 flex flex-col gap-1.5">
        <label className="text-caption text-text-secondary font-medium">Cost Price</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body-sm text-text-muted" aria-hidden="true">৳</span>
          <input
            id={`items-${index}-price`}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
            className={cn(inputClass, "pl-7")}
            style={{ background: "rgba(255,255,255,0.04)" }}
          />
        </div>
      </div>

      {/* Quantity */}
      <div className="md:col-span-2 flex flex-col gap-1.5">
        <label className="text-caption text-text-secondary font-medium">Qty</label>
        <input
          id={`items-${index}-qty`}
          type="number"
          min="1"
          placeholder="1"
          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
          className={inputClass}
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
      </div>

      {/* Subtotal & Action */}
      <div className="md:col-span-2 flex items-center justify-between gap-3 pt-4 md:pt-0">
        <div className="flex flex-col gap-1">
          <span className="text-caption text-text-muted md:hidden">Subtotal</span>
          <span className="text-body-sm text-text-primary font-mono font-semibold">
            ৳{subtotal.toFixed(2)}
          </span>
        </div>

        <Button
          id={`items-${index}-remove`}
          type="button"
          variant="ghost"
          size="sm"
          disabled={isRemoveDisabled}
          onClick={() => onRemove(index)}
          className="text-text-muted hover:text-danger-400 hover:bg-danger-400/10 h-9 w-9 p-0 rounded-xl"
          aria-label="Remove item"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
          </svg>
        </Button>
      </div>
    </div>
  );
}
