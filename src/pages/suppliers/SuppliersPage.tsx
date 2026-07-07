/**
 * SuppliersPage.tsx — /suppliers
 *
 * Phase 10: Uses standardized PageHeader component.
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader, PageContainer } from "@/components/common";
import { ROUTES } from "@/utils/constants";
import {
  useSuppliers,
  SupplierFilters,
  SupplierTable,
} from "@/features/suppliers";

export function SuppliersPage() {
  const {
    suppliers,
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
  } = useSuppliers(10);

  return (
    <PageContainer variant="wide">
      {/* Header */}
      <PageHeader
        title="Suppliers"
        description="Manage product manufacturers, distributors, and supply chain contacts."
        count={totalCount}
        countColor="amber"
        isLoading={isLoading}
        actions={
          <Link to={ROUTES.SUPPLIERS_NEW}>
            <Button
              id="add-supplier-btn"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color:      "white",
                border:     "none",
                boxShadow:  "0 0 20px rgba(245,158,11,0.2)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mr-1.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Supplier
            </Button>
          </Link>
        }
      />

      {/* Stats / active filter notification */}
      {!isLoading && hasActiveFilters && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-body-sm"
          style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}
          role="status"
          aria-live="polite"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span className="text-text-secondary">
            Found <span className="font-semibold text-text-primary">{totalCount.toLocaleString()}</span> suppliers matching your filters
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="card-glass px-5 py-4">
        <SupplierFilters
          filters={filters}
          onUpdateFilters={updateFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Table */}
      <SupplierTable
        suppliers={suppliers}
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
    </PageContainer>
  );
}
