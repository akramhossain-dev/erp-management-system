/**
 * ReportFilters.tsx — Universal report filter selectors panel.
 *
 * Automatically displays different selectors (date ranges, suppliers, categories)
 * depending on the active ReportType tab.
 */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReportType, ReportFiltersState } from "@/features/reports/hooks/useReport";
import type { Customer, Supplier } from "@/types/entities";

interface ReportFiltersProps {
  reportType:      ReportType;
  filters:         ReportFiltersState;
  onUpdateFilters: (updates: Partial<ReportFiltersState>) => void;
  onReset:         () => void;
  customers?:      Customer[];
  suppliers?:      Supplier[];
  categories?:     string[];
}

export function ReportFilters({
  reportType,
  filters,
  onUpdateFilters,
  onReset,
  customers  = [],
  suppliers  = [],
  categories = [],
}: ReportFiltersProps) {

  const selectClass = cn(
    "h-10 pl-5 pr-11 rounded-xl text-body text-text-primary appearance-none bg-transparent border border-white/10 focus:border-primary-500/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all cursor-pointer",
  );

  const inputClass = cn(
    "h-10 px-5 rounded-xl text-body text-text-primary bg-transparent border border-white/10 focus:border-primary-500/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
  );

  const showSearch     = reportType === "products" || reportType === "customers" || reportType === "suppliers";
  const showCategory   = reportType === "products";
  const showSupplier   = reportType === "purchases";
  const showCustomer   = reportType === "sales";
  const showDateRange  = reportType === "purchases" || reportType === "sales";

  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "" ||
    filters.supplierId !== "" ||
    filters.customerId !== "" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:flex-wrap">

      {/* Text Search */}
      {showSearch && (
        <div className="flex flex-col gap-1.5 min-w-[200px] max-w-xs flex-1">
          <label htmlFor="report-search-term" className="text-caption text-text-muted font-medium">Search</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <Input
              id="report-search-term"
              type="search"
              placeholder="Type to search…"
              value={filters.search}
              onChange={(e) => onUpdateFilters({ search: e.target.value })}
              className="h-10 text-body"
              style={{ paddingLeft: "2.75rem", paddingRight: "1.25rem", background: "rgba(255,255,255,0.04)" }}
              autoComplete="off"
            />
          </div>
        </div>
      )}

      {/* Category selector */}
      {showCategory && (
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <label htmlFor="report-category" className="text-caption text-text-muted font-medium">Category</label>
          <div className="relative">
            <select
              id="report-category"
              value={filters.category}
              onChange={(e) => onUpdateFilters({ category: e.target.value })}
              className={cn(selectClass, "w-full")}
              style={{ paddingLeft: "1.25rem", paddingRight: "2.75rem", background: "rgba(255,255,255,0.04)" }}
            >
              <option value="" style={{ background: "var(--bg-surface-300)" }}>All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} style={{ background: "var(--bg-surface-300)" }}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Supplier selector */}
      {showSupplier && (
        <div className="flex flex-col gap-1.5 min-w-[180px]">
          <label htmlFor="report-supplier" className="text-caption text-text-muted font-medium">Supplier</label>
          <div className="relative">
            <select
              id="report-supplier"
              value={filters.supplierId}
              onChange={(e) => onUpdateFilters({ supplierId: e.target.value })}
              className={cn(selectClass, "w-full")}
              style={{ paddingLeft: "1.25rem", paddingRight: "2.75rem", background: "rgba(255,255,255,0.04)" }}
            >
              <option value="" style={{ background: "var(--bg-surface-300)" }}>All Suppliers</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id} style={{ background: "var(--bg-surface-300)" }}>
                  {s.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Customer selector */}
      {showCustomer && (
        <div className="flex flex-col gap-1.5 min-w-[180px]">
          <label htmlFor="report-customer" className="text-caption text-text-muted font-medium">Customer</label>
          <div className="relative">
            <select
              id="report-customer"
              value={filters.customerId}
              onChange={(e) => onUpdateFilters({ customerId: e.target.value })}
              className={cn(selectClass, "w-full")}
              style={{ paddingLeft: "1.25rem", paddingRight: "2.75rem", background: "rgba(255,255,255,0.04)" }}
            >
              <option value="" style={{ background: "var(--bg-surface-300)" }}>All Customers</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id} style={{ background: "var(--bg-surface-300)" }}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Date Ranges */}
      {showDateRange && (
        <>
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <label htmlFor="dateFrom" className="text-caption text-text-muted font-medium">From Date</label>
            <input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onUpdateFilters({ dateFrom: e.target.value })}
              className={cn(inputClass, "w-full")}
              style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", background: "rgba(255,255,255,0.04)" }}
            />
          </div>
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <label htmlFor="dateTo" className="text-caption text-text-muted font-medium">To Date</label>
            <input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => onUpdateFilters({ dateTo: e.target.value })}
              className={cn(inputClass, "w-full")}
              style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", background: "rgba(255,255,255,0.04)" }}
            />
          </div>
        </>
      )}

      {/* Reset control */}
      {hasActiveFilters && (
        <Button
          id="report-filter-reset-btn"
          variant="ghost"
          onClick={onReset}
          className="h-10 px-4 text-body text-text-muted hover:text-text-secondary gap-1.5 mt-4 sm:mt-0"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
          </svg>
          Reset Filters
        </Button>
      )}
    </div>
  );
}
