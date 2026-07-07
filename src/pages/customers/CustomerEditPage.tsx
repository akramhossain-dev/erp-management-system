/**
 * CustomerEditPage.tsx — /customers/:id/edit
 */
import { useParams, Link, Navigate } from "react-router-dom";
import { CustomerForm } from "@/features/customers";
import { useCustomer, useUpdateCustomer } from "@/features/customers";
import { ROUTES } from "@/utils/constants";

function EditPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex flex-col gap-2">
        <div className="skeleton h-4 w-40 rounded" />
        <div className="skeleton h-8 w-56 rounded-lg" />
      </div>
      <div className="card-glass p-6 flex flex-col gap-4">
        <div className="skeleton h-6 w-48 rounded" />
        <div className="skeleton h-10 w-full rounded-xl" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function CustomerEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading, isError } = useCustomer(id);
  const { mutate: updateCustomer, isPending } = useUpdateCustomer(id ?? "");

  if (!id) return <Navigate to={ROUTES.CUSTOMERS} replace />;
  if (isLoading) return <EditPageSkeleton />;
  if (isError || !customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-body text-text-secondary">Customer profile not found or failed to load.</p>
        <Link
          to={ROUTES.CUSTOMERS}
          className="text-body-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          ← Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-caption text-text-muted">
        <Link to={ROUTES.CUSTOMERS} className="hover:text-text-secondary transition-colors">
          Customers
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className="text-text-secondary truncate max-w-[200px]">{customer.name}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className="text-text-secondary">Edit</span>
      </nav>

      {/* Page Header */}
      <div>
        <h2 className="text-h2 text-text-primary font-bold">Edit Customer</h2>
        <p className="text-body-sm text-text-secondary mt-1">
          Update the profile details of this customer.
        </p>
      </div>

      {/* Form */}
      <CustomerForm
        mode="edit"
        defaultValues={customer}
        onSubmit={updateCustomer}
        isSubmitting={isPending}
      />
    </div>
  );
}
