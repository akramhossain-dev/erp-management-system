/**
 * useSales.ts — TanStack Query hooks for fetching sales transaction records.
 */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { salesService } from "@/features/sales/services/salesService";
import { useAuthContext } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { STALE_TIMES } from "@/utils/constants";
import type { SalesFilterValues } from "@/features/sales/schemas/salesSchemas";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const SALES_QUERY_KEYS = {
  all:    ["sales"] as const,
  lists:  () => [...SALES_QUERY_KEYS.all, "list"] as const,
  list:   (f: object, page: number) => [...SALES_QUERY_KEYS.lists(), f, page] as const,
  detail: (id: string) => [...SALES_QUERY_KEYS.all, "detail", id] as const,
};

// ─── Filters state ────────────────────────────────────────────────────────────

export interface UseSalesFilters {
  search: string;
}

const DEFAULT_FILTERS: UseSalesFilters = {
  search: "",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSales(pageSize = 10) {
  const { isAuthenticated } = useAuthContext();
  const [page,    setPage]    = useState(1);
  const [filters, setFilters] = useState<UseSalesFilters>(DEFAULT_FILTERS);

  const debouncedSearch = useDebounce(filters.search, 350);

  const filterValues: SalesFilterValues = {
    search: debouncedSearch,
  };

  const query = useQuery({
    queryKey:  SALES_QUERY_KEYS.list(filterValues, page),
    queryFn:   () => salesService.getSales({ filters: filterValues, page, pageSize }),
    staleTime: STALE_TIMES.SALES,
    enabled:   isAuthenticated,
    placeholderData: (prev) => prev,
  });

  const updateFilters = (updates: Partial<UseSalesFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const hasActiveFilters = filters.search !== "";

  return {
    ...query,
    sales:        query.data?.data ?? [],
    totalCount:   query.data?.count ?? 0,
    totalPages:   Math.ceil((query.data?.count ?? 0) / pageSize),

    page,
    pageSize,
    setPage,

    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    debouncedSearch,
  };
}

// ─── Single sale hook ─────────────────────────────────────────────────────────

export function useSale(id: string | undefined) {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey:  SALES_QUERY_KEYS.detail(id ?? ""),
    queryFn:   () => salesService.getSaleById(id!),
    enabled:   isAuthenticated && !!id,
    staleTime: STALE_TIMES.SALES,
  });
}
