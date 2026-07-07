/**
 * PurchaseDetailsPage.tsx — /purchases/:id
 */
import { useParams, Link, Navigate } from "react-router-dom";
import { PurchaseDetails } from "@/features/purchases";
import { usePurchase } from "@/features/purchases";
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

export function PurchaseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: purchase, isLoading, isError } = usePurchase(id);

  if (!id) return <Navigate to={ROUTES.PURCHASES} replace />;
  if (isLoading) return <DetailsPageSkeleton />;
  if (isError || !purchase) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-body text-text-secondary">Purchase invoice not found or failed to load.</p>
        <Link
          to={ROUTES.PURCHASES}
          className="text-body-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          ← Back to Purchases
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-caption text-text-muted">
        <Link to={ROUTES.PURCHASES} className="hover:text-text-secondary transition-colors">
          Purchases
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className="text-text-secondary truncate max-w-[200px]">
          PO-{purchase.id.substring(0, 8).toUpperCase()}
        </span>
      </nav>

      {/* Details Card */}
      <PurchaseDetails purchase={purchase} />
    </div>
  );
}
