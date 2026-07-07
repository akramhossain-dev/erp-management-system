/**
 * ProductsPage — /products
 *
 * The main product management page:
 * - Header with count badge and "Add Product" button
 * - ProductFilters bar
 * - ProductTable with pagination
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/utils/constants";
import {
  useProducts,
  useProductCategories,
  ProductFilters,
  ProductTable,
} from "@/features/products";

export function ProductsPage() {
  const {
    products,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    page,
    pageSize,
    setPage,
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
  } = useProducts(10);

  const { data: dbCategories } = useProductCategories();

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-h2 text-text-primary font-bold">Products</h2>
            {!isLoading && (
              <span
                className="text-caption font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: "rgba(59,130,246,0.12)", color: "var(--primary-400)" }}
              >
                {totalCount.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-body-sm text-text-secondary mt-1">
            Manage your product inventory
          </p>
        </div>

        <Link to={ROUTES.PRODUCTS_NEW}>
          <Button
            id="add-product-btn"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #2563EB)",
              color:      "white",
              border:     "none",
              boxShadow:  "0 0 20px rgba(59,130,246,0.2)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mr-1.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Product
          </Button>
        </Link>
      </div>

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      {!isLoading && hasActiveFilters && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-body-sm"
          style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}
          role="status"
          aria-live="polite"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span className="text-text-secondary">
            Found <span className="font-semibold text-text-primary">{totalCount.toLocaleString()}</span> products matching your filters
          </span>
        </div>
      )}

      {/* ── Filters ───────────────────────────────────────────────────── */}
      <div className="card-glass px-5 py-4">
        <ProductFilters
          filters={filters}
          onUpdateFilters={updateFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
          dbCategories={dbCategories ?? []}
        />
      </div>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <ProductTable
        products={products}
        isLoading={isLoading}
        isFetching={isFetching}
        totalCount={totalCount}
        totalPages={totalPages}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={resetFilters}
      />
    </div>
  );
}
