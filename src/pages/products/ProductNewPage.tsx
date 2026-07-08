/**
 * ProductNewPage — /products/new
 *
 * Create a new product using the ProductForm in "create" mode.
 */
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/common";
import { ProductForm } from "@/features/products";
import { useCreateProduct } from "@/features/products";
import { ROUTES } from "@/utils/constants";

// ─── Skeleton ────────────────────────────────────────────────────────────────

function NewProductSkeleton() {
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
        <div className="skeleton h-20 w-full rounded-xl" />
      </div>
      <div className="card-glass p-6 flex flex-col gap-4">
        <div className="skeleton h-6 w-32 rounded" />
        <div className="grid grid-cols-2 gap-4">
          <div className="skeleton h-10 rounded-xl" />
          <div className="skeleton h-10 rounded-xl" />
        </div>
      </div>
    </PageContainer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function ProductNewPage() {
  const { mutate: createProduct, isPending } = useCreateProduct();

  if (isPending) {
    return <NewProductSkeleton />;
  }

  return (
    <PageContainer variant="narrow">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-caption text-text-muted">
        <Link to={ROUTES.PRODUCTS} className="hover:text-text-secondary transition-colors">
          Products
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className="text-text-secondary">New Product</span>
      </nav>

      {/* Page header */}
      <div>
        <h2 className="text-h2 text-text-primary font-bold">Add New Product</h2>
        <p className="text-body-sm text-text-secondary mt-1">
          Register a new product with pricing, inventory levels, and category details.
        </p>
      </div>

      {/* Form */}
      <ProductForm
        mode="create"
        onSubmit={createProduct}
        isSubmitting={isPending}
      />
    </PageContainer>
  );
}
