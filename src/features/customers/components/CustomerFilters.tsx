/**
 * CustomerFilters.tsx — search input for the customers list.
 */
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UseCustomersFilters } from "@/features/customers/hooks/useCustomers";

interface CustomerFiltersProps {
  filters:         UseCustomersFilters;
  onUpdateFilters: (updates: Partial<UseCustomersFilters>) => void;
  onReset:         () => void;
  hasActiveFilters: boolean;
}

export function CustomerFilters({
  filters,
  onUpdateFilters,
  onReset,
  hasActiveFilters,
}: CustomerFiltersProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Search input */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <Input
          id="customer-search"
          ref={searchRef}
          type="search"
          placeholder="Search by name, email, or phone…"
          value={filters.search}
          onChange={(e) => onUpdateFilters({ search: e.target.value })}
          className="pl-9 h-9 text-body-sm"
          style={{
            background:   "rgba(255,255,255,0.04)",
            border:       "1px solid var(--border-subtle)",
            borderRadius: "0.75rem",
          }}
          aria-label="Search customers"
          autoComplete="off"
        />
        {filters.search && (
          <button
            onClick={() => {
              onUpdateFilters({ search: "" });
              searchRef.current?.focus();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <Button
          id="customer-filter-reset-btn"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-9 px-3 text-body-sm text-text-muted hover:text-text-secondary gap-1.5"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
          </svg>
          Clear filters
        </Button>
      )}
    </div>
  );
}
