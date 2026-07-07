/**
 * useReport.ts — TanStack Query wrapper hook for loading ERP reports data.
 */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { reportService } from "@/features/reports/services/reportService";
import { useAuthContext } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";

export type ReportType = "products" | "customers" | "suppliers" | "purchases" | "sales";

export interface ReportFiltersState {
  search:     string;
  category:   string;
  supplierId: string;
  customerId: string;
  dateFrom:   string;
  dateTo:     string;
}

const DEFAULT_FILTERS: ReportFiltersState = {
  search:     "",
  category:   "",
  supplierId: "",
  customerId: "",
  dateFrom:   "",
  dateTo:     "",
};

export const REPORT_QUERY_KEYS = {
  all:   ["reports"] as const,
  type:  (type: ReportType) => [...REPORT_QUERY_KEYS.all, type] as const,
  query: (type: ReportType, filters: object) => [...REPORT_QUERY_KEYS.type(type), filters] as const,
};

export function useReport(reportType: ReportType) {
  const { isAuthenticated } = useAuthContext();
  const [filters, setFilters] = useState<ReportFiltersState>(DEFAULT_FILTERS);

  const debouncedSearch = useDebounce(filters.search, 300);

  const queryFilters = {
    ...filters,
    search: debouncedSearch,
  };

  const query = useQuery({
    queryKey: REPORT_QUERY_KEYS.query(reportType, queryFilters),
    queryFn: async () => {
      switch (reportType) {
        case "products":
          return reportService.getProductReport();
        case "customers":
          return reportService.getCustomerReport();
        case "suppliers":
          return reportService.getSupplierReport();
        case "purchases":
          return reportService.getPurchaseReport({
            dateFrom:   filters.dateFrom || undefined,
            dateTo:     filters.dateTo || undefined,
            supplierId: filters.supplierId || undefined,
          });
        case "sales":
          return reportService.getSalesReport({
            dateFrom:   filters.dateFrom || undefined,
            dateTo:     filters.dateTo || undefined,
            customerId: filters.customerId || undefined,
          });
        default:
          throw new Error("Invalid report type requested");
      }
    },
    enabled:   isAuthenticated,
    staleTime: 60 * 1000, // 1 minute cache
  });

  const updateFilters = (updates: Partial<ReportFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return {
    ...query,
    reportData: query.data ?? [],
    filters,
    updateFilters,
    resetFilters,
  };
}
