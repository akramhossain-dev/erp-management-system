/**
 * CustomersPage.tsx — /customers
 *
 * Phase 10: Uses standardized PageHeader component.
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader, PageContainer } from "@/components/common";
import { ROUTES } from "@/utils/constants";
import {
  useCustomers,
  CustomerFilters,
  CustomerTable,
} from "@/features/customers";

export function CustomersPage() {
  const {
    customers,
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
  } = useCustomers(10);

  return (
    <PageContainer variant="wide">
      {/* Header */}
      <PageHeader
        title="Customers"
        description="Manage customer relationships, contact details, and transaction history."
        count={totalCount}
        countColor="blue"
        isLoading={isLoading}
        actions={
          <Link to={ROUTES.CUSTOMERS_NEW}>
            <Button
              id="add-customer-btn"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                color:      "white",
                border:     "none",
                boxShadow:  "0 0 20px rgba(59,130,246,0.2)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mr-1.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Customer
            </Button>
          </Link>
        }
      />

      {/* Active filter notice */}
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
            Found <span className="font-semibold text-text-primary">{totalCount.toLocaleString()}</span> customers matching your filters
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="card-glass px-5 py-4">
        <CustomerFilters
          filters={filters}
          onUpdateFilters={updateFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Table */}
      <CustomerTable
        customers={customers}
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
