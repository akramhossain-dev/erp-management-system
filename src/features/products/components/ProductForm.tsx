/**
 * ProductForm — React Hook Form + Zod form for creating and editing products.
 *
 * Modes:
 * - Create: empty defaults, calls useCreateProduct
 * - Edit: prefilled with existing product, calls useUpdateProduct
 *
 * Features:
 * - Field-level validation with Zod
 * - Number inputs that properly parse float/int
 * - SKU auto-uppercase on blur
 * - Profit margin calculation preview
 * - Loading state on submit
 * - Cancel → navigate back to /products
 */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/constants";
import {
  productSchema,
  PRODUCT_FORM_DEFAULTS,
  PRODUCT_CATEGORIES,
  type ProductFormValues,
} from "@/features/products/schemas/productSchemas";
import type { Product } from "@/types/entities";

// ─── Styled Form Field ────────────────────────────────────────────────────────

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
  hint,
  className,
}: {
  label:     string;
  htmlFor:   string;
  error?:    string;
  required?: boolean;
  children:  React.ReactNode;
  hint?:     string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-body-sm font-medium text-text-secondary"
      >
        {label}
        {required && <span className="ml-1 text-danger-400" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-caption text-text-muted">{hint}</p>
      )}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-caption text-danger-400 flex items-center gap-1.5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Number input ─────────────────────────────────────────────────────────────

function NumberInput({
  id,
  value,
  onChange,
  min = 0,
  step = 1,
  placeholder,
  prefix,
  error,
  disabled,
}: {
  id:          string;
  value:       number;
  onChange:    (v: number) => void;
  min?:        number;
  step?:       number | string;
  placeholder?: string;
  prefix?:     string;
  error?:      string;
  disabled?:   boolean;
}) {
  return (
    <div className="relative">
      {prefix && (
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-body-sm text-text-muted pointer-events-none"
          aria-hidden="true"
        >
          {prefix}
        </span>
      )}
      <input
        id={id}
        type="number"
        min={min}
        step={step}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const val = step === 1 || step === "1"
            ? parseInt(e.target.value, 10)
            : parseFloat(e.target.value);
          onChange(isNaN(val) ? 0 : val);
        }}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={cn(
          "w-full h-10 rounded-xl text-body-sm text-text-primary",
          "bg-transparent border focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
          prefix ? "pl-8" : "pl-3",
          "pr-3",
          error ? "border-danger-400/60 focus:ring-danger-400/30" : "border-white/10 focus:border-primary-500/60",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        )}
        style={{ background: "rgba(255,255,255,0.04)" }}
      />
    </div>
  );
}

// ─── Profit margin preview ────────────────────────────────────────────────────

function MarginPreview({
  purchasePrice,
  sellingPrice,
}: {
  purchasePrice: number;
  sellingPrice:  number;
}) {
  const margin = sellingPrice > 0 && purchasePrice >= 0
    ? ((sellingPrice - purchasePrice) / sellingPrice) * 100
    : null;
  const profit = sellingPrice - purchasePrice;

  return (
    <div
      className="flex items-center gap-4 p-3 rounded-xl text-caption"
      style={{
        background: "rgba(59,130,246,0.06)",
        border:     "1px solid rgba(59,130,246,0.12)",
      }}
    >
      <div className="flex flex-col">
        <span className="text-text-muted">Gross Profit</span>
        <span
          className="font-semibold text-body-sm"
          style={{ color: profit >= 0 ? "var(--success-400)" : "var(--danger-400)" }}
        >
          ৳{profit.toFixed(2)}
        </span>
      </div>
      {margin !== null && (
        <div className="flex flex-col">
          <span className="text-text-muted">Margin</span>
          <span
            className="font-semibold text-body-sm"
            style={{ color: margin >= 0 ? "var(--success-400)" : "var(--danger-400)" }}
          >
            {margin.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

interface ProductFormProps {
  /** Existing product for edit mode (undefined for create) */
  defaultValues?: Product;
  onSubmit:       (values: ProductFormValues) => void;
  isSubmitting:   boolean;
  mode:           "create" | "edit";
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  mode,
}: ProductFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver:      zodResolver(productSchema),
    defaultValues: defaultValues
      ? {
          name:           defaultValues.name,
          sku:            defaultValues.sku,
          category:       defaultValues.category ?? "",
          description:    defaultValues.description ?? "",
          purchase_price: Number(defaultValues.purchase_price),
          selling_price:  Number(defaultValues.selling_price),
          stock_quantity: Number(defaultValues.stock_quantity),
          min_stock:      Number(defaultValues.min_stock),
        }
      : PRODUCT_FORM_DEFAULTS,
  });

  // Watch prices for margin preview
  const purchasePrice = watch("purchase_price") ?? 0;
  const sellingPrice  = watch("selling_price")  ?? 0;

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full h-10 px-3 rounded-xl text-body-sm text-text-primary",
      "bg-transparent border focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
      hasError
        ? "border-danger-400/60 focus:ring-danger-400/30"
        : "border-white/10 focus:border-primary-500/60",
    );

  return (
    <form
      id="product-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={mode === "create" ? "Create product form" : "Edit product form"}
    >
      <div className="flex flex-col gap-6">

        {/* ── Basic Information ──────────────────────────────────────────── */}
        <div
          className="card-glass p-5 sm:p-6 flex flex-col gap-5"
          aria-label="Basic Information"
        >
          <h2 className="text-h4 text-text-primary font-semibold flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }} aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </span>
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <Field label="Product Name" htmlFor="name" error={errors.name?.message} required className="md:col-span-2">
              <input
                id="name"
                type="text"
                placeholder="e.g. Wireless Keyboard"
                {...register("name")}
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={!!errors.name}
                className={inputClass(!!errors.name)}
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            </Field>

            {/* SKU */}
            <Field label="SKU" htmlFor="sku" error={errors.sku?.message} required hint="Auto-uppercased. e.g. WKB-001">
              <input
                id="sku"
                type="text"
                placeholder="e.g. WKB-001"
                {...register("sku")}
                onBlur={(e) => setValue("sku", e.target.value.toUpperCase().trim())}
                aria-describedby={errors.sku ? "sku-error" : undefined}
                aria-invalid={!!errors.sku}
                className={cn(inputClass(!!errors.sku), "font-mono uppercase")}
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            </Field>

            {/* Category */}
            <Field label="Category" htmlFor="category" error={errors.category?.message}>
              <div className="relative">
                <select
                  id="category"
                  {...register("category")}
                  className={cn(
                    inputClass(!!errors.category),
                    "appearance-none pr-8 cursor-pointer",
                  )}
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <option value="" style={{ background: "var(--bg-surface-300)" }}>Select category…</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} style={{ background: "var(--bg-surface-300)" }}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
            </Field>

            {/* Description */}
            <Field label="Description" htmlFor="description" error={errors.description?.message} className="md:col-span-2">
              <textarea
                id="description"
                rows={3}
                placeholder="Optional product description…"
                {...register("description")}
                aria-describedby={errors.description ? "description-error" : undefined}
                aria-invalid={!!errors.description}
                className={cn(
                  "w-full px-3 py-2.5 rounded-xl text-body-sm text-text-primary resize-none",
                  "bg-transparent border focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
                  errors.description
                    ? "border-danger-400/60 focus:ring-danger-400/30"
                    : "border-white/10 focus:border-primary-500/60",
                )}
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            </Field>
          </div>
        </div>

        {/* ── Pricing ────────────────────────────────────────────────────── */}
        <div className="card-glass p-5 sm:p-6 flex flex-col gap-5" aria-label="Pricing">
          <h2 className="text-h4 text-text-primary font-semibold flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }} aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </span>
            Pricing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Purchase Price */}
            <Field label="Purchase Price (Cost)" htmlFor="purchase_price" error={errors.purchase_price?.message} required>
              <Controller
                name="purchase_price"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    id="purchase_price"
                    value={field.value}
                    onChange={field.onChange}
                    step="0.01"
                    min={0}
                    placeholder="0.00"
                    prefix="৳"
                    error={errors.purchase_price?.message}
                  />
                )}
              />
            </Field>

            {/* Selling Price */}
            <Field label="Selling Price" htmlFor="selling_price" error={errors.selling_price?.message} required>
              <Controller
                name="selling_price"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    id="selling_price"
                    value={field.value}
                    onChange={field.onChange}
                    step="0.01"
                    min={0}
                    placeholder="0.00"
                    prefix="৳"
                    error={errors.selling_price?.message}
                  />
                )}
              />
            </Field>
          </div>

          {/* Margin preview */}
          <MarginPreview purchasePrice={purchasePrice} sellingPrice={sellingPrice} />
        </div>

        {/* ── Inventory ──────────────────────────────────────────────────── */}
        <div className="card-glass p-5 sm:p-6 flex flex-col gap-5" aria-label="Inventory">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-h4 text-text-primary font-semibold flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }} aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6"  y1="20" x2="6"  y2="14"/>
                </svg>
              </span>
              Inventory
            </h2>
            {mode === "edit" && (
              <p className="text-caption text-text-muted">
                Stock is also updated automatically via purchase and sales modules.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Stock Quantity */}
            <Field label="Current Stock Quantity" htmlFor="stock_quantity" error={errors.stock_quantity?.message} required>
              <Controller
                name="stock_quantity"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    id="stock_quantity"
                    value={field.value}
                    onChange={field.onChange}
                    step={1}
                    min={0}
                    placeholder="0"
                    error={errors.stock_quantity?.message}
                  />
                )}
              />
            </Field>

            {/* Min Stock */}
            <Field label="Minimum Stock Level" htmlFor="min_stock" error={errors.min_stock?.message} hint="Alert threshold for low-stock warnings">
              <Controller
                name="min_stock"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    id="min_stock"
                    value={field.value}
                    onChange={field.onChange}
                    step={1}
                    min={0}
                    placeholder="0"
                    error={errors.min_stock?.message}
                  />
                )}
              />
            </Field>
          </div>
        </div>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link to={ROUTES.PRODUCTS}>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="min-w-[100px]"
              style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
            >
              Cancel
            </Button>
          </Link>
          <Button
            id="product-form-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="min-w-[140px]"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #2563EB)",
              color:      "white",
              border:     "none",
              boxShadow:  "0 0 20px rgba(59,130,246,0.2)",
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                {mode === "create" ? "Creating…" : "Saving…"}
              </span>
            ) : (
              mode === "create" ? "Create Product" : "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
