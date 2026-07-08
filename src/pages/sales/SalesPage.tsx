/**
 * SalesPage.tsx — /sales
 *
 * Phase 10: Uses standardized PageHeader component.
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, PageContainer } from "@/components/common";
import { ROUTES } from "@/utils/constants";
import {
  useSales,
  SalesTable,
} from "@/features/sales";

export function SalesPage() {
  const {
    sales,
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
  } = useSales(10);

  return (
    <PageContainer variant="wide">
      {/* Header */}
      <PageHeader
        title="Sales Invoices"
        description="Create sales invoices, process customer orders, and track revenue."
        count={totalCount}
        countColor="green"
        isLoading={isLoading}
        actions={
          <Link to={ROUTES.SALES_NEW}>
            <Button
              id="create-invoice-btn"
              style={{
                background: "linear-gradient(135deg, #10B981, #059669)",
                color:      "white",
                border:     "none",
                boxShadow:  "0 0 20px rgba(16,185,129,0.2)",
                padding:    "10px 24px",
                height:     "auto",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mr-1.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create Invoice
            </Button>
          </Link>
        }
      />

      {/* Filter bar */}
      <div className="card-glass px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <Input
            id="sales-search"
            type="search"
            placeholder="Search invoice number or notes…"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="h-10 text-body"
            style={{
              paddingLeft:  "2.75rem",
              paddingRight: "1.25rem",
              background:   "rgba(255,255,255,0.04)",
              border:       "1px solid var(--border-subtle)",
              borderRadius: "0.75rem",
            }}
            aria-label="Search invoices"
            autoComplete="off"
          />
        </div>
        {hasActiveFilters && (
          <Button
            id="sales-filter-reset-btn"
            variant="ghost"
            onClick={resetFilters}
            className="h-10 px-4 text-body text-text-muted hover:text-text-secondary gap-1.5"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
            </svg>
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <SalesTable
        sales={sales}
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
