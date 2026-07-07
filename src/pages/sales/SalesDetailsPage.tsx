/**
 * SalesDetailsPage.tsx — /sales/:id
 */
import { useParams, Link, Navigate } from "react-router-dom";
import { SalesDetails } from "@/features/sales";
import { useSale } from "@/features/sales";
import { ROUTES } from "@/utils/constants";

function DetailsPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="skeleton h-4 w-40 rounded" />
          <div className="skeleton h-8 w-56 rounded-lg" />
        </div>
      </div>
      <div className="card-glass p-6 flex flex-col gap-4">
        <div className="skeleton h-6 w-32 rounded" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function SalesDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: sale, isLoading, isError } = useSale(id);

  if (!id) return <Navigate to={ROUTES.SALES} replace />;
  if (isLoading) return <DetailsPageSkeleton />;
  if (isError || !sale) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-body text-text-secondary">Sales invoice not found or failed to load.</p>
        <Link
          to={ROUTES.SALES}
          className="text-body-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          ← Back to Sales
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* Breadcrumb (Hidden during print) */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-caption text-text-muted print:hidden">
        <Link to={ROUTES.SALES} className="hover:text-text-secondary transition-colors">
          Sales Invoices
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className="text-text-secondary truncate max-w-[200px]">
          {sale.invoice_number}
        </span>
      </nav>

      {/* Details Container */}
      <SalesDetails sale={sale} />
    </div>
  );
}
