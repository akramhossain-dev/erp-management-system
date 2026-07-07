/**
 * useCustomers.ts — TanStack Query hooks for fetching the customers list.
 */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { customerService } from "@/features/customers/services/customerService";
import { useAuthContext } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { STALE_TIMES } from "@/utils/constants";
import type { CustomerFilterValues } from "@/features/customers/schemas/customerSchemas";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const CUSTOMER_QUERY_KEYS = {
  all:    ["customers"] as const,
  lists:  () => [...CUSTOMER_QUERY_KEYS.all, "list"] as const,
  list:   (f: object, page: number) => [...CUSTOMER_QUERY_KEYS.lists(), f, page] as const,
  detail: (id: string) => [...CUSTOMER_QUERY_KEYS.all, "detail", id] as const,
};

// ─── Filters state ────────────────────────────────────────────────────────────

export interface UseCustomersFilters {
  search: string;
}

const DEFAULT_FILTERS: UseCustomersFilters = {
  search: "",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCustomers(pageSize = 10) {
  const { isAuthenticated } = useAuthContext();
  const [page,    setPage]    = useState(1);
  const [filters, setFilters] = useState<UseCustomersFilters>(DEFAULT_FILTERS);

  // Debounce search input
  const debouncedSearch = useDebounce(filters.search, 350);

  const filterValues: CustomerFilterValues = {
    search: debouncedSearch,
  };

  const query = useQuery({
    queryKey:  CUSTOMER_QUERY_KEYS.list(filterValues, page),
    queryFn:   () => customerService.getCustomers({ filters: filterValues, page, pageSize }),
    staleTime: STALE_TIMES.CUSTOMERS,
    enabled:   isAuthenticated,
    placeholderData: (prev) => prev,
  });

  const updateFilters = (updates: Partial<UseCustomersFilters>) => {
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
    customers:   query.data?.data ?? [],
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

// ─── Single customer hook ─────────────────────────────────────────────────────

export function useCustomer(id: string | undefined) {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey:  CUSTOMER_QUERY_KEYS.detail(id ?? ""),
    queryFn:   () => customerService.getCustomerById(id!),
    enabled:   isAuthenticated && !!id,
    staleTime: STALE_TIMES.CUSTOMERS,
  });
}
