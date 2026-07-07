/**
 * SalesNewPage.tsx — /sales/new
 */
import { Link } from "react-router-dom";
import { SalesForm } from "@/features/sales";
import { useCreateSale } from "@/features/sales";
import { useCustomers } from "@/features/customers";
import { useProducts } from "@/features/products";
import { ROUTES } from "@/utils/constants";

export function SalesNewPage() {
  const { mutate: createSale, isPending } = useCreateSale();

  // Fetch full list of customers and products for form selectors
  const { customers, isLoading: isCustomersLoading } = useCustomers(1000);
  const { products, isLoading: isProductsLoading } = useProducts(1000);

  const isLoading = isCustomersLoading || isProductsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl">
        <div className="skeleton h-4 w-40 rounded" />
        <div className="skeleton h-8 w-56 rounded-lg" />
        <div className="card-glass p-6 flex flex-col gap-4">
          <div className="skeleton h-6 w-32 rounded" />
          <div className="skeleton h-10 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-caption text-text-muted">
        <Link to={ROUTES.SALES} className="hover:text-text-secondary transition-colors">
          Sales Invoices
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className="text-text-secondary">New Invoice</span>
      </nav>

      {/* Page Header */}
      <div>
        <h2 className="text-h2 text-text-primary font-bold">Create Sales Invoice</h2>
        <p className="text-body-sm text-text-secondary mt-1">
          Record a customer sale, check stock levels, and generate printable invoice reports.
        </p>
      </div>

      {/* Form */}
      <SalesForm
        customers={customers}
        products={products}
        onSubmit={createSale}
        isSubmitting={isPending}
      />
    </div>
  );
}
