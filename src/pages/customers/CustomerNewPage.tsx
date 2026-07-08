/**
 * CustomerNewPage.tsx — /customers/new
 *
 * Create a new customer using the CustomerForm in "create" mode.
 */
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/common";
import { CustomerForm } from "@/features/customers";
import { useCreateCustomer } from "@/features/customers";
import { ROUTES } from "@/utils/constants";

// ─── Skeleton ────────────────────────────────────────────────────────────────

function NewCustomerSkeleton() {
  return (
    <PageContainer variant="narrow">
      <div className="flex flex-col gap-2">
        <div className="skeleton h-4 w-40 rounded" />
        <div className="skeleton h-8 w-56 rounded-lg" />
        <div className="skeleton h-4 w-80 rounded" />
      </div>
      <div className="card-glass p-6 flex flex-col gap-4">
        <div className="skeleton h-6 w-48 rounded" />
        <div className="skeleton h-10 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="skeleton h-10 rounded-xl" />
          <div className="skeleton h-10 rounded-xl" />
        </div>
        <div className="skeleton h-10 w-full rounded-xl" />
        <div className="skeleton h-20 w-full rounded-xl" />
      </div>
    </PageContainer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function CustomerNewPage() {
  const { mutate: createCustomer, isPending } = useCreateCustomer();

  if (isPending) {
    return <NewCustomerSkeleton />;
  }

  return (
    <PageContainer variant="narrow">

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-caption text-text-muted">
        <Link to={ROUTES.CUSTOMERS} className="hover:text-text-secondary transition-colors">
          Customers
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className="text-text-secondary">New Customer</span>
      </nav>

      {/* Page Header */}
      <div>
        <h2 className="text-h2 text-text-primary font-bold">Add New Customer</h2>
        <p className="text-body-sm text-text-secondary mt-1">
          Register a new customer profile with contact details for billing and order management.
        </p>
      </div>

      {/* Form */}
      <CustomerForm
        mode="create"
        onSubmit={createCustomer}
        isSubmitting={isPending}
      />
    </PageContainer>
  );
}
