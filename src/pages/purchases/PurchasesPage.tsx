/**
 * PurchasesPage.tsx — /purchases
 *
 * Phase 10: Uses standardized PageHeader component.
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/utils/constants";
import {
  usePurchases,
  PurchaseTable,
} from "@/features/purchases";

export function PurchasesPage() {
  const {
    purchases,
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
  } = usePurchases(10);

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* Header */}
      <PageHeader
        title="Purchases"
        description="Record product purchases from suppliers and track stock increases."
        count={totalCount}
        countColor="purple"
        isLoading={isLoading}
        actions={
          <Link to={ROUTES.PURCHASES_NEW}>
            <Button
              id="record-purchase-btn"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                color:      "white",
                border:     "none",
                boxShadow:  "0 0 20px rgba(139,92,246,0.2)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mr-1.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Record Purchase
            </Button>
          </Link>
        }
      />

      {/* Filter bar */}
      <div className="card-glass px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <Input
            id="purchase-search"
            type="search"
            placeholder="Search notes…"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-9 h-9 text-body-sm"
            style={{
              background:   "rgba(255,255,255,0.04)",
              border:       "1px solid var(--border-subtle)",
              borderRadius: "0.75rem",
            }}
            aria-label="Search purchases"
            autoComplete="off"
          />
        </div>
        {hasActiveFilters && (
          <Button
            id="purchase-filter-reset-btn"
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-9 px-3 text-body-sm text-text-muted hover:text-text-secondary gap-1.5"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
            </svg>
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <PurchaseTable
        purchases={purchases}
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
