/**
 * ReportFilters.tsx — Premium filter panel for report views.
 * Redesigned with proper spacing, labeled inputs, and export button.
 */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ReportType, ReportFiltersState } from "@/features/reports/hooks/useReport";
import type { Customer, Supplier } from "@/types/entities";

interface ReportFiltersProps {
  reportType:       ReportType;
  filters:          ReportFiltersState;
  onUpdateFilters:  (updates: Partial<ReportFiltersState>) => void;
  onReset:          () => void;
  customers?:       Customer[];
  suppliers?:       Supplier[];
  categories?:      string[];
  onExport?:        () => void;
  exportDisabled?:  boolean;
}

const selectStyle: React.CSSProperties = {
  height: 42,
  paddingLeft: "1.1rem",
  paddingRight: "2.5rem",
  borderRadius: 10,
  fontSize: 13.5,
  color: "#cbd5e1",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  outline: "none",
  appearance: "none" as const,
  cursor: "pointer",
  width: "100%",
  transition: "border-color 150ms",
};

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "rgba(100,116,139,0.7)",
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
  );
}

function FilterLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        fontSize: 11.5,
        fontWeight: 600,
        color: "rgba(100,116,139,0.85)",
        marginBottom: 6,
        display: "block",
        userSelect: "none",
      }}
    >
      {children}
    </label>
  );
}

export function ReportFilters({
  reportType,
  filters,
  onUpdateFilters,
  onReset,
  customers  = [],
  suppliers  = [],
  categories = [],
  onExport,
  exportDisabled,
}: ReportFiltersProps) {
  const showSearch    = reportType === "products" || reportType === "customers" || reportType === "suppliers";
  const showCategory  = reportType === "products";
  const showSupplier  = reportType === "purchases";
  const showCustomer  = reportType === "sales";
  const showDateRange = reportType === "purchases" || reportType === "sales";

  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "" ||
    filters.supplierId !== "" ||
    filters.customerId !== "" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "20px 22px",
        marginBottom: 20,
      }}
    >
      {/* Filter grid row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "flex-end",
        }}
      >
        {/* Search */}
        {showSearch && (
          <div style={{ flex: "1 1 200px", minWidth: 180, maxWidth: 300 }}>
            <FilterLabel htmlFor="report-search-term">Search</FilterLabel>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "rgba(100,116,139,0.6)",
                }}
                aria-hidden="true"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <Input
                id="report-search-term"
                type="search"
                placeholder="Search…"
                value={filters.search}
                onChange={(e) => onUpdateFilters({ search: e.target.value })}
                autoComplete="off"
                style={{
                  height: 42,
                  paddingLeft: "2.25rem",
                  paddingRight: "1rem",
                  borderRadius: 10,
                  fontSize: 13.5,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>
          </div>
        )}

        {/* Category */}
        {showCategory && (
          <div style={{ flex: "0 1 180px", minWidth: 150 }}>
            <FilterLabel htmlFor="report-category">Category</FilterLabel>
            <SelectWrapper>
              <select
                id="report-category"
                value={filters.category}
                onChange={(e) => onUpdateFilters({ category: e.target.value })}
                style={selectStyle}
              >
                <option value="" style={{ background: "#0e1528" }}>All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} style={{ background: "#0e1528" }}>{cat}</option>
                ))}
              </select>
            </SelectWrapper>
          </div>
        )}

        {/* Supplier */}
        {showSupplier && (
          <div style={{ flex: "0 1 200px", minWidth: 160 }}>
            <FilterLabel htmlFor="report-supplier">Supplier</FilterLabel>
            <SelectWrapper>
              <select
                id="report-supplier"
                value={filters.supplierId}
                onChange={(e) => onUpdateFilters({ supplierId: e.target.value })}
                style={selectStyle}
              >
                <option value="" style={{ background: "#0e1528" }}>All Suppliers</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id} style={{ background: "#0e1528" }}>{s.name}</option>
                ))}
              </select>
            </SelectWrapper>
          </div>
        )}

        {/* Customer */}
        {showCustomer && (
          <div style={{ flex: "0 1 200px", minWidth: 160 }}>
            <FilterLabel htmlFor="report-customer">Customer</FilterLabel>
            <SelectWrapper>
              <select
                id="report-customer"
                value={filters.customerId}
                onChange={(e) => onUpdateFilters({ customerId: e.target.value })}
                style={selectStyle}
              >
                <option value="" style={{ background: "#0e1528" }}>All Customers</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id} style={{ background: "#0e1528" }}>{c.name}</option>
                ))}
              </select>
            </SelectWrapper>
          </div>
        )}

        {/* Date range */}
        {showDateRange && (
          <>
            <div style={{ flex: "0 1 155px", minWidth: 130 }}>
              <FilterLabel htmlFor="dateFrom">From Date</FilterLabel>
              <input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onUpdateFilters({ dateFrom: e.target.value })}
                style={{ ...selectStyle, paddingRight: "0.75rem" }}
              />
            </div>
            <div style={{ flex: "0 1 155px", minWidth: 130 }}>
              <FilterLabel htmlFor="dateTo">To Date</FilterLabel>
              <input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => onUpdateFilters({ dateTo: e.target.value })}
                style={{ ...selectStyle, paddingRight: "0.75rem" }}
              />
            </div>
          </>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginLeft: "auto", flexShrink: 0 }}>
          {hasActiveFilters && (
            <Button
              id="report-filter-reset-btn"
              variant="ghost"
              onClick={onReset}
              style={{
                height: 42,
                padding: "0 14px",
                fontSize: 13,
                color: "rgba(148,163,184,0.8)",
                gap: 6,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
              </svg>
              Clear
            </Button>
          )}
          {onExport && (
            <button
              id="export-csv-btn"
              onClick={onExport}
              disabled={exportDisabled}
              style={{
                height: 42,
                padding: "0 18px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: exportDisabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.06)",
                color: exportDisabled ? "rgba(100,116,139,0.4)" : "#e2e8f0",
                fontSize: 13.5,
                fontWeight: 500,
                cursor: exportDisabled ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "background 150ms, border-color 150ms",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!exportDisabled) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = exportDisabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Export CSV
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
