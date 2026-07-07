/**
 * useSuppliers.ts — TanStack Query hooks for fetching the suppliers list.
 */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supplierService } from "@/features/suppliers/services/supplierService";
import { useAuthContext } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { STALE_TIMES } from "@/utils/constants";
import type { SupplierFilterValues } from "@/features/suppliers/schemas/supplierSchemas";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const SUPPLIER_QUERY_KEYS = {
  all:    ["suppliers"] as const,
  lists:  () => [...SUPPLIER_QUERY_KEYS.all, "list"] as const,
  list:   (f: object, page: number) => [...SUPPLIER_QUERY_KEYS.lists(), f, page] as const,
  detail: (id: string) => [...SUPPLIER_QUERY_KEYS.all, "detail", id] as const,
};

// ─── Filters state ────────────────────────────────────────────────────────────

export interface UseSuppliersFilters {
  search: string;
}

const DEFAULT_FILTERS: UseSuppliersFilters = {
  search: "",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSuppliers(pageSize = 10) {
  const { isAuthenticated } = useAuthContext();
  const [page,    setPage]    = useState(1);
  const [filters, setFilters] = useState<UseSuppliersFilters>(DEFAULT_FILTERS);

  // Debounce search input
  const debouncedSearch = useDebounce(filters.search, 350);

  const filterValues: SupplierFilterValues = {
    search: debouncedSearch,
  };

  const query = useQuery({
    queryKey:  SUPPLIER_QUERY_KEYS.list(filterValues, page),
    queryFn:   () => supplierService.getSuppliers({ filters: filterValues, page, pageSize }),
    staleTime: STALE_TIMES.SUPPLIERS,
    enabled:   isAuthenticated,
    placeholderData: (prev) => prev,
  });

  const updateFilters = (updates: Partial<UseSuppliersFilters>) => {
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
    suppliers:   query.data?.data ?? [],
    totalCount:  query.data?.count ?? 0,
    totalPages:  Math.ceil((query.data?.count ?? 0) / pageSize),

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

// ─── Single supplier hook ─────────────────────────────────────────────────────

export function useSupplier(id: string | undefined) {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey:  SUPPLIER_QUERY_KEYS.detail(id ?? ""),
    queryFn:   () => supplierService.getSupplierById(id!),
    enabled:   isAuthenticated && !!id,
    staleTime: STALE_TIMES.SUPPLIERS,
  });
}
