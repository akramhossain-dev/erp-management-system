/**
 * usePurchases.ts — TanStack Query hooks for fetching purchases data.
 */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { purchaseService } from "@/features/purchases/services/purchaseService";
import { useAuthContext } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { STALE_TIMES } from "@/utils/constants";
import type { PurchaseFilterValues } from "@/features/purchases/schemas/purchaseSchemas";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const PURCHASE_QUERY_KEYS = {
  all:    ["purchases"] as const,
  lists:  () => [...PURCHASE_QUERY_KEYS.all, "list"] as const,
  list:   (f: object, page: number) => [...PURCHASE_QUERY_KEYS.lists(), f, page] as const,
  detail: (id: string) => [...PURCHASE_QUERY_KEYS.all, "detail", id] as const,
};

// ─── Filters state ────────────────────────────────────────────────────────────

export interface UsePurchasesFilters {
  search: string;
}

const DEFAULT_FILTERS: UsePurchasesFilters = {
  search: "",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePurchases(pageSize = 10) {
  const { isAuthenticated } = useAuthContext();
  const [page,    setPage]    = useState(1);
  const [filters, setFilters] = useState<UsePurchasesFilters>(DEFAULT_FILTERS);

  const debouncedSearch = useDebounce(filters.search, 350);

  const filterValues: PurchaseFilterValues = {
    search: debouncedSearch,
  };

  const query = useQuery({
    queryKey:  PURCHASE_QUERY_KEYS.list(filterValues, page),
    queryFn:   () => purchaseService.getPurchases({ filters: filterValues, page, pageSize }),
    staleTime: STALE_TIMES.PURCHASES,
    enabled:   isAuthenticated,
    placeholderData: (prev) => prev,
  });

  const updateFilters = (updates: Partial<UsePurchasesFilters>) => {
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
    purchases:    query.data?.data ?? [],
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

// ─── Single purchase hook ─────────────────────────────────────────────────────

export function usePurchase(id: string | undefined) {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey:  PURCHASE_QUERY_KEYS.detail(id ?? ""),
    queryFn:   () => purchaseService.getPurchaseById(id!),
    enabled:   isAuthenticated && !!id,
    staleTime: STALE_TIMES.PURCHASES,
  });
}
