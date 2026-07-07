/**
 * SalesForm.tsx — Invoice creation form incorporating customer dropdown,
 * field array for items, and a totals sidebar.
 */
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/constants";
import {
  saleSchema,
  SALES_FORM_DEFAULTS,
  type SaleFormValues,
} from "@/features/sales/schemas/salesSchemas";
import { SalesItemRow } from "./SalesItemRow";
import { SalesSummary } from "./SalesSummary";
import type { Customer, Product } from "@/types/entities";

interface SalesFormProps {
  customers:    Customer[];
  products:     Product[];
  onSubmit:     (values: SaleFormValues) => void;
  isSubmitting: boolean;
}

export function SalesForm({
  customers,
  products,
  onSubmit,
  isSubmitting,
}: SalesFormProps) {
  const methods = useForm<SaleFormValues>({
    resolver:      zodResolver(saleSchema),
    defaultValues: SALES_FORM_DEFAULTS,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const handleAddItem = () => {
    append({ product_id: "", quantity: 1, unit_price: 0 });
  };

  const handleFormSubmit = (values: SaleFormValues) => {
    // Client-side Stock Availability Check
    for (const item of values.items) {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        const available = Number(product.stock_quantity);
        if (item.quantity > available) {
          toast.error("Insufficient stock", {
            description: `Cannot complete sale. Product "${product.name}" only has ${available} items in stock.`,
          });
          return; // Abort submit
        }
      }
    }

    onSubmit(values);
  };

  const selectClass = (hasError: boolean) =>
    cn(
      "w-full h-10 px-3 rounded-xl text-body-sm text-text-primary appearance-none pr-8 cursor-pointer",
      "bg-transparent border focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
      hasError
        ? "border-danger-400/60 focus:ring-danger-400/30"
        : "border-white/10 focus:border-primary-500/60",
    );

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full h-10 px-3 rounded-xl text-body-sm text-text-primary",
      "bg-transparent border focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
      hasError
        ? "border-danger-400/60 focus:ring-danger-400/30"
        : "border-white/10 focus:border-primary-500/60",
    );

  return (
    <FormProvider {...methods}>
      <form
        id="sales-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        aria-label="Create sale invoice form"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Inputs */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Invoice Header details */}
            <div className="card-glass p-6 flex flex-col gap-5">
              <h2 className="text-h4 text-text-primary font-semibold flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }} aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </span>
                Sales Invoice Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Customer select */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="customer_id" className="text-body-sm font-medium text-text-secondary">
                    Customer <span className="text-danger-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="customer_id"
                      {...register("customer_id")}
                      className={selectClass(!!errors.customer_id)}
                      style={{ background: "rgba(255,255,255,0.04)" }}
                      aria-invalid={!!errors.customer_id}
                    >
                      <option value="" style={{ background: "var(--bg-surface-300)" }}>Select customer…</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id} style={{ background: "var(--bg-surface-300)" }}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>
                  {errors.customer_id && (
                    <p role="alert" className="text-caption text-danger-400 mt-1">
                      {errors.customer_id.message}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sale_date" className="text-body-sm font-medium text-text-secondary">
                    Invoice Date <span className="text-danger-400">*</span>
                  </label>
                  <input
                    id="sale_date"
                    type="date"
                    {...register("sale_date")}
                    className={inputClass(!!errors.sale_date)}
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    aria-invalid={!!errors.sale_date}
                  />
                  {errors.sale_date && (
                    <p role="alert" className="text-caption text-danger-400 mt-1">
                      {errors.sale_date.message}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="notes" className="text-body-sm font-medium text-text-secondary">
                    Invoice Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Optional details, billing footnotes, reference codes..."
                    {...register("notes")}
                    className={cn(
                      "w-full px-3 py-2.5 rounded-xl text-body-sm text-text-primary resize-none",
                      "bg-transparent border focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all border-white/10 focus:border-primary-500/60",
                    )}
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  />
                </div>
              </div>
            </div>

            {/* Line items list */}
            <div className="card-glass p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-h4 text-text-primary font-semibold flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }} aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"/>
                      <line x1="8" y1="12" x2="21" y2="12"/>
                      <line x1="8" y1="18" x2="21" y2="18"/>
                      <line x1="3" y1="6" x2="3.01" y2="6"/>
                      <line x1="3" y1="12" x2="3.01" y2="12"/>
                      <line x1="3" y1="18" x2="3.01" y2="18"/>
                    </svg>
                  </span>
                  Invoice Items
                </h2>

                <Button
                  id="add-item-row-btn"
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                  className="h-8 text-caption gap-1.5"
                  style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Item
                </Button>
              </div>

              {/* Rows */}
              <div className="flex flex-col">
                {fields.map((field, index) => (
                  <SalesItemRow
                    key={field.id}
                    index={index}
                    products={products}
                    onRemove={remove}
                    isRemoveDisabled={fields.length === 1}
                  />
                ))}
              </div>

              {errors.items && (
                <p role="alert" className="text-caption text-danger-400 mt-1">
                  {errors.items.message}
                </p>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-end gap-3 lg:hidden">
              <Link to={ROUTES.SALES}>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[140px]"
                style={{
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  color:      "white",
                  border:     "none",
                }}
              >
                Save Sale
              </Button>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <SalesSummary customers={customers} />

            {/* Actions for Desktop */}
            <div className="hidden lg:flex items-center justify-end gap-3">
              <Link to={ROUTES.SALES}>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className="w-24"
                  style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                >
                  Cancel
                </Button>
              </Link>
              <Button
                id="sales-form-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
                style={{
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  color:      "white",
                  border:     "none",
                  boxShadow:  "0 0 20px rgba(16,185,129,0.2)",
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    Saving…
                  </span>
                ) : (
                  "Create Invoice"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
