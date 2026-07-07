/**
 * ProductEditPage — /products/:id/edit
 *
 * Edit an existing product. Loads the product by ID then renders the form
 * with pre-populated values. Shows ProductDetails above the form for context.
 */
import { useParams, Link, Navigate } from "react-router-dom";
import { ProductForm } from "@/features/products";
import { useProduct, useUpdateProduct } from "@/features/products";
import { ROUTES } from "@/utils/constants";

// ─── Skeleton loader for the edit page ───────────────────────────────────────

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
      <div className="card-glass p-6 flex flex-col gap-4">
        <div className="skeleton h-6 w-32 rounded" />
        <div className="grid grid-cols-2 gap-4">
          <div className="skeleton h-10 rounded-xl" />
          <div className="skeleton h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function ProductEditPage() {
  const { id }   = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProduct(id);
  const { mutate: updateProduct, isPending } = useUpdateProduct(id ?? "");

  if (!id) return <Navigate to={ROUTES.PRODUCTS} replace />;
  if (isLoading) return <EditPageSkeleton />;
  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-body text-text-secondary">Product not found or failed to load.</p>
        <Link
          to={ROUTES.PRODUCTS}
          className="text-body-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-caption text-text-muted">
        <Link to={ROUTES.PRODUCTS} className="hover:text-text-secondary transition-colors">
          Products
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className="text-text-secondary truncate max-w-[200px]">{product.name}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className="text-text-secondary">Edit</span>
      </nav>

      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-h2 text-text-primary font-bold">Edit Product</h2>
          <p className="text-body-sm text-text-secondary mt-1">
            Update product information below.
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <ProductForm
        mode="edit"
        defaultValues={product}
        onSubmit={updateProduct}
        isSubmitting={isPending}
      />
    </div>
  );
}
