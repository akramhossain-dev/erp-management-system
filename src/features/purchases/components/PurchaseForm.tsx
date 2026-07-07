/**
 * PurchaseForm.tsx — Purchase creation form incorporating supplier dropdown,
 * field array for multiple items, and a totals sidebar.
 */
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/constants";
import {
  purchaseSchema,
  PURCHASE_FORM_DEFAULTS,
  type PurchaseFormValues,
} from "@/features/purchases/schemas/purchaseSchemas";
import { PurchaseItemRow } from "./PurchaseItemRow";
import { PurchaseSummary } from "./PurchaseSummary";
import type { Supplier, Product } from "@/types/entities";

interface PurchaseFormProps {
  suppliers:    Supplier[];
  products:     Product[];
  onSubmit:     (values: PurchaseFormValues) => void;
  isSubmitting: boolean;
}

export function PurchaseForm({
  suppliers,
  products,
  onSubmit,
  isSubmitting,
}: PurchaseFormProps) {
  const methods = useForm<PurchaseFormValues>({
    resolver:      zodResolver(purchaseSchema),
    defaultValues: PURCHASE_FORM_DEFAULTS,
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

  const selectClass = (hasError: boolean) =>
    cn(
      "w-full h-10 pl-5 pr-11 rounded-xl text-body text-text-primary appearance-none cursor-pointer",
      "bg-transparent border focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
      hasError
        ? "border-danger-400/60 focus:ring-danger-400/30"
        : "border-white/10 focus:border-primary-500/60",
    );

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full h-10 px-5 rounded-xl text-body text-text-primary",
      "bg-transparent border focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
      hasError
        ? "border-danger-400/60 focus:ring-danger-400/30"
        : "border-white/10 focus:border-primary-500/60",
    );

  return (
    <FormProvider {...methods}>
      <form
        id="purchase-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Create purchase order form"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ── Left: Form inputs ────────────────────────────────────────── */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Header info */}
            <div className="card-glass p-6 flex flex-col gap-5">
              <h2 className="text-h4 text-text-primary font-semibold flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }} aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                </span>
                Purchase Order Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Supplier dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="supplier_id" className="text-body-sm font-medium text-text-secondary">
                    Supplier <span className="text-danger-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="supplier_id"
                      {...register("supplier_id")}
                      className={selectClass(!!errors.supplier_id)}
                      style={{ background: "rgba(255,255,255,0.04)" }}
                      aria-invalid={!!errors.supplier_id}
                    >
                      <option value="" style={{ background: "var(--bg-surface-300)" }}>Select supplier…</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id} style={{ background: "var(--bg-surface-300)" }}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>
                  {errors.supplier_id && (
                    <p role="alert" className="text-caption text-danger-400 mt-1">
                      {errors.supplier_id.message}
                    </p>
                  )}
                </div>

                {/* Purchase Date */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="purchase_date" className="text-body-sm font-medium text-text-secondary">
                    Purchase Date <span className="text-danger-400">*</span>
                  </label>
                  <input
                    id="purchase_date"
                    type="date"
                    {...register("purchase_date")}
                    className={inputClass(!!errors.purchase_date)}
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    aria-invalid={!!errors.purchase_date}
                  />
                  {errors.purchase_date && (
                    <p role="alert" className="text-caption text-danger-400 mt-1">
                      {errors.purchase_date.message}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="notes" className="text-body-sm font-medium text-text-secondary">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Optional purchase details, reference numbers, etc..."
                    {...register("notes")}
                    className={cn(
                      "w-full px-5 py-3 rounded-xl text-body text-text-primary resize-none",
                      "bg-transparent border focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all border-white/10 focus:border-primary-500/60",
                    )}
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  />
                </div>
              </div>
            </div>

            {/* Line items section */}
            <div className="card-glass p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-h4 text-text-primary font-semibold flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }} aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </span>
                  Purchase Items
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

              {/* Items Grid */}
              <div className="flex flex-col">
                {fields.map((field, index) => (
                  <PurchaseItemRow
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

            {/* Cancel & Save button */}
            <div className="flex items-center justify-end gap-3 lg:hidden">
              <Link to={ROUTES.PURCHASES}>
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
                  background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                  color:      "white",
                  border:     "none",
                }}
              >
                Save Purchase
              </Button>
            </div>
          </div>

          {/* ── Right: Order summary ────────────────────────────────────────── */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <PurchaseSummary suppliers={suppliers} />

            {/* Form actions for desktop */}
            <div className="hidden lg:flex items-center justify-end gap-3">
              <Link to={ROUTES.PURCHASES}>
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
                id="purchase-form-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                  color:      "white",
                  border:     "none",
                  boxShadow:  "0 0 20px rgba(59,130,246,0.2)",
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    Saving…
                  </span>
                ) : (
                  "Create Purchase"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
