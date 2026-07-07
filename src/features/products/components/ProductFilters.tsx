/**
 * ProductFilters — search + filter bar for the product list.
 *
 * Features:
 * - Debounced text search (name or SKU)
 * - Category dropdown (dynamic from DB + predefined)
 * - Stock status filter (all / in stock / low stock / out of stock)
 * - Active filter count badge
 * - One-click reset
 */
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/features/products/schemas/productSchemas";
import type { UseProductsFilters } from "@/features/products/hooks/useProducts";

// ─── Stock status options ─────────────────────────────────────────────────────

const STOCK_OPTIONS = [
  { value: "all",           label: "All Stock" },
  { value: "in_stock",      label: "In Stock"  },
  { value: "low_stock",     label: "Low Stock" },
  { value: "out_of_stock",  label: "Out of Stock" },
] as const;

// ─── Filter chip ──────────────────────────────────────────────────────────────

function FilterSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder,
  id,
}: {
  value:       T;
  onChange:    (v: T) => void;
  options:     { value: T; label: string }[];
  placeholder: string;
  id:          string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(
          "h-9 pl-3 pr-8 rounded-xl text-body-sm appearance-none cursor-pointer w-full",
          "bg-transparent border focus:outline-none focus:ring-2 focus:ring-primary-500/50",
          "text-text-secondary",
        )}
        style={{
          background:  "rgba(255,255,255,0.04)",
          border:      "1px solid var(--border-subtle)",
          color:       value !== options[0].value ? "var(--text-primary)" : "var(--text-tertiary)",
        }}
        aria-label={placeholder}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            style={{ background: "var(--bg-surface-300)", color: "var(--text-primary)" }}
          >
            {opt.label}
          </option>
        ))}
      </select>
      {/* Chevron icon */}
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ProductFiltersProps {
  filters:         UseProductsFilters;
  onUpdateFilters: (updates: Partial<UseProductsFilters>) => void;
  onReset:         () => void;
  hasActiveFilters: boolean;
  /** Dynamic categories from DB */
  dbCategories?:   string[];
}

export function ProductFilters({
  filters,
  onUpdateFilters,
  onReset,
  hasActiveFilters,
  dbCategories = [],
}: ProductFiltersProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  // Merge DB categories with predefined categories (deduplicated)
  const allCategories = [...new Set([...dbCategories, ...PRODUCT_CATEGORIES])].sort();
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...allCategories.map((c) => ({ value: c, label: c })),
  ] as { value: string; label: string }[];

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
          id="product-search"
          ref={searchRef}
          type="search"
          placeholder="Search by name or SKU…"
          value={filters.search}
          onChange={(e) => onUpdateFilters({ search: e.target.value })}
          className="pl-9 h-9 text-body-sm"
          style={{
            background:   "rgba(255,255,255,0.04)",
            border:       "1px solid var(--border-subtle)",
            borderRadius: "0.75rem",
          }}
          aria-label="Search products"
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

      {/* Category filter */}
      <div className="w-full sm:w-44">
        <FilterSelect
          id="product-category-filter"
          value={filters.category}
          onChange={(v) => onUpdateFilters({ category: v })}
          options={categoryOptions}
          placeholder="All Categories"
        />
      </div>

      {/* Stock status filter */}
      <div className="w-full sm:w-44">
        <FilterSelect
          id="product-stock-filter"
          value={filters.stockStatus}
          onChange={(v) =>
            onUpdateFilters({ stockStatus: v as UseProductsFilters["stockStatus"] })
          }
          options={STOCK_OPTIONS as unknown as { value: string; label: string }[]}
          placeholder="All Stock"
        />
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <Button
          id="product-filter-reset-btn"
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
