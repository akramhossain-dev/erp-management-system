/**
 * useProducts — TanStack Query hook for fetching the products list.
 *
 * Supports search, filtering by category/stock status, and pagination.
 * Query key includes all filters so results are cached per filter combination.
 */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { productService } from "@/features/products/services/productService";
import { useAuthContext } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { STALE_TIMES } from "@/utils/constants";
import type { ProductFilterValues } from "@/features/products/schemas/productSchemas";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const PRODUCT_QUERY_KEYS = {
  all:       ["products"] as const,
  lists:     () => [...PRODUCT_QUERY_KEYS.all, "list"] as const,
  list:      (f: object, page: number) => [...PRODUCT_QUERY_KEYS.lists(), f, page] as const,
  detail:    (id: string) => [...PRODUCT_QUERY_KEYS.all, "detail", id] as const,
  categories: () => [...PRODUCT_QUERY_KEYS.all, "categories"] as const,
};

// ─── Filters state ────────────────────────────────────────────────────────────

export interface UseProductsFilters {
  search:      string;
  category:    string;
  stockStatus: "all" | "in_stock" | "low_stock" | "out_of_stock";
}

const DEFAULT_FILTERS: UseProductsFilters = {
  search:      "",
  category:    "all",
  stockStatus: "all",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProducts(pageSize = 10) {
  const { isAuthenticated } = useAuthContext();
  const [page,    setPage]    = useState(1);
  const [filters, setFilters] = useState<UseProductsFilters>(DEFAULT_FILTERS);

  // Debounce search input so we don't fire on every keystroke
  const debouncedSearch = useDebounce(filters.search, 350);

  const filterValues: ProductFilterValues = {
    search:      debouncedSearch,
    category:    filters.category === "all" ? undefined : filters.category,
    stockStatus: filters.stockStatus,
  };

  const query = useQuery({
    queryKey:  PRODUCT_QUERY_KEYS.list(filterValues, page),
    queryFn:   () => productService.getProducts({ filters: filterValues, page, pageSize }),
    staleTime: STALE_TIMES.PRODUCTS,
    enabled:   isAuthenticated,
    placeholderData: (prev) => prev, // Keep previous data while fetching (no flash)
  });

  // Reset to page 1 when filters change
  const updateFilters = (updates: Partial<UseProductsFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "all" ||
    filters.stockStatus !== "all";

  return {
    // Query state
    ...query,
    products:     query.data?.data ?? [],
    totalCount:   query.data?.count ?? 0,
    totalPages:   Math.ceil((query.data?.count ?? 0) / pageSize),

    // Pagination
    page,
    pageSize,
    setPage,

    // Filters
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    debouncedSearch,
  };
}

// ─── Single product hook ──────────────────────────────────────────────────────

export function useProduct(id: string | undefined) {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id ?? ""),
    queryFn:  () => productService.getProductById(id!),
    enabled:  isAuthenticated && !!id,
    staleTime: STALE_TIMES.PRODUCTS,
  });
}

// ─── Categories hook ──────────────────────────────────────────────────────────

export function useProductCategories() {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey:  PRODUCT_QUERY_KEYS.categories(),
    queryFn:   productService.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled:   isAuthenticated,
  });
}
