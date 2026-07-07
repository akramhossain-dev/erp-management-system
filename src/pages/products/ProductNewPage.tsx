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

export function ProductNewPage() {
  const { mutate: createProduct, isPending } = useCreateProduct();

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
          Fill in the details below to add a new product to your inventory.
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
