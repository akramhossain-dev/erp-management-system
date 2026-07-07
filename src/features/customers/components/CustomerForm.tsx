/**
 * CustomerForm.tsx — Unified form for creating/editing customers.
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/constants";
import {
  customerSchema,
  CUSTOMER_FORM_DEFAULTS,
  type CustomerFormValues,
} from "@/features/customers/schemas/customerSchemas";
import type { Customer } from "@/types/entities";

// ─── Styled Form Field ────────────────────────────────────────────────────────

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
  className,
}: {
  label:     string;
  htmlFor:   string;
  error?:    string;
  required?: boolean;
  children:  React.ReactNode;
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

// ─── Component ────────────────────────────────────────────────────────────────

interface CustomerFormProps {
  defaultValues?: Customer;
  onSubmit:       (values: CustomerFormValues) => void;
  isSubmitting:   boolean;
  mode:           "create" | "edit";
}

export function CustomerForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  mode,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: defaultValues
      ? {
          name:    defaultValues.name,
          email:   defaultValues.email ?? "",
          phone:   defaultValues.phone ?? "",
          address: defaultValues.address ?? "",
          notes:   defaultValues.notes ?? "",
        }
      : CUSTOMER_FORM_DEFAULTS,
  });

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
      id="customer-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={mode === "create" ? "Create customer form" : "Edit customer form"}
    >
      <div className="flex flex-col gap-6">
        <div className="card-glass p-6 flex flex-col gap-5">
          <h2 className="text-h4 text-text-primary font-semibold flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }} aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
            </span>
            Profile Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <Field label="Customer Name" htmlFor="name" error={errors.name?.message} required className="md:col-span-2">
              <input
                id="name"
                type="text"
                placeholder="e.g. John Doe"
                {...register("name")}
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={!!errors.name}
                className={inputClass(!!errors.name)}
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            </Field>

            {/* Email */}
            <Field label="Email Address" htmlFor="email" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                placeholder="e.g. john@example.com"
                {...register("email")}
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
                className={inputClass(!!errors.email)}
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            </Field>

            {/* Phone */}
            <Field label="Phone Number" htmlFor="phone" error={errors.phone?.message}>
              <input
                id="phone"
                type="text"
                placeholder="e.g. +8801700000000"
                {...register("phone")}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                aria-invalid={!!errors.phone}
                className={inputClass(!!errors.phone)}
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            </Field>

            {/* Address */}
            <Field label="Address" htmlFor="address" error={errors.address?.message} className="md:col-span-2">
              <input
                id="address"
                type="text"
                placeholder="Street address, city, country"
                {...register("address")}
                aria-describedby={errors.address ? "address-error" : undefined}
                aria-invalid={!!errors.address}
                className={inputClass(!!errors.address)}
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            </Field>

            {/* Notes */}
            <Field label="Notes / History" htmlFor="notes" error={errors.notes?.message} className="md:col-span-2">
              <textarea
                id="notes"
                rows={3}
                placeholder="Optional customer notes, special delivery details, etc..."
                {...register("notes")}
                aria-describedby={errors.notes ? "notes-error" : undefined}
                aria-invalid={!!errors.notes}
                className={cn(
                  "w-full px-3 py-2.5 rounded-xl text-body-sm text-text-primary resize-none",
                  "bg-transparent border focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
                  errors.notes
                    ? "border-danger-400/60 focus:ring-danger-400/30"
                    : "border-white/10 focus:border-primary-500/60",
                )}
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            </Field>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link to={ROUTES.CUSTOMERS}>
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
            id="customer-form-submit-btn"
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
                Saving…
              </span>
            ) : mode === "create" ? (
              "Create Customer"
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
