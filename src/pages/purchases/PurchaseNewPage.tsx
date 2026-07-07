/**
 * PurchaseNewPage.tsx — /purchases/new
 */
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/common";
import { PurchaseForm } from "@/features/purchases";
import { useCreatePurchase } from "@/features/purchases";
import { useSuppliers } from "@/features/suppliers";
import { useProducts } from "@/features/products";
import { ROUTES } from "@/utils/constants";

export function PurchaseNewPage() {
  const { mutate: createPurchase, isPending } = useCreatePurchase();

  // Load suppliers and products (high page size to get full lists for form selects)
  const { suppliers, isLoading: isSuppliersLoading } = useSuppliers(1000);
  const { products, isLoading: isProductsLoading } = useProducts(1000);

  const isLoading = isSuppliersLoading || isProductsLoading;

  if (isLoading) {
    return (
      <PageContainer variant="wide">
        <div className="skeleton h-4 w-40 rounded" />
        <div className="skeleton h-8 w-56 rounded-lg" />
        <div className="card-glass p-6 flex flex-col gap-4">
          <div className="skeleton h-6 w-32 rounded" />
          <div className="skeleton h-10 w-full rounded-xl" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="wide">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-caption text-text-muted">
        <Link to={ROUTES.PURCHASES} className="hover:text-text-secondary transition-colors">
          Purchases
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className="text-text-secondary">Record Purchase</span>
      </nav>

      {/* Page Header */}
      <div>
        <h2 className="text-h2 text-text-primary font-bold">Record Purchase Order</h2>
        <p className="text-body-sm text-text-secondary mt-1">
          Record inventory purchases from manufacturers or distributors to increase product stock.
        </p>
      </div>

      {/* Form */}
      <PurchaseForm
        suppliers={suppliers}
        products={products}
        onSubmit={createPurchase}
        isSubmitting={isPending}
      />
    </PageContainer>
  );
}
