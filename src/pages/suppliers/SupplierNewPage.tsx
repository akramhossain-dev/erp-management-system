/**
 * SupplierNewPage.tsx — /suppliers/new
 */
import { Link } from "react-router-dom";
import { SupplierForm } from "@/features/suppliers";
import { useCreateSupplier } from "@/features/suppliers";
import { ROUTES } from "@/utils/constants";

export function SupplierNewPage() {
  const { mutate: createSupplier, isPending } = useCreateSupplier();

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-caption text-text-muted">
        <Link to={ROUTES.SUPPLIERS} className="hover:text-text-secondary transition-colors">
          Suppliers
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className="text-text-secondary">New Supplier</span>
      </nav>

      {/* Page Header */}
      <div>
        <h2 className="text-h2 text-text-primary font-bold">Add New Supplier</h2>
        <p className="text-body-sm text-text-secondary mt-1">
          Register a new supply provider.
        </p>
      </div>

      {/* Form */}
      <SupplierForm
        mode="create"
        onSubmit={createSupplier}
        isSubmitting={isPending}
      />
    </div>
  );
}
