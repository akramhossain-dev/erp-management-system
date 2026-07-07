/**
 * useDashboardStats — TanStack Query hooks for all dashboard data.
 *
 * Exports individual hooks so components can subscribe to only what they need.
 */
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/features/dashboard/services/dashboardService";
import { QUERY_KEYS, STALE_TIMES } from "@/utils/constants";
import { useAuthContext } from "@/context/AuthContext";

// ─── KPI Stats ────────────────────────────────────────────────────────────────

export function useDashboardStats() {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn:  dashboardService.getStats,
    staleTime: STALE_TIMES.DASHBOARD,
    enabled:   isAuthenticated,
    // Return safe defaults while loading
    placeholderData: {
      total_products:  0,
      total_customers: 0,
      total_suppliers: 0,
      total_purchases: 0,
      total_sales:     0,
      total_revenue:   0,
    },
  });
}

// ─── Recent Activity ──────────────────────────────────────────────────────────

export function useRecentSales() {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: [...QUERY_KEYS.SALES, "recent"],
    queryFn:  dashboardService.getRecentSales,
    staleTime: STALE_TIMES.SALES,
    enabled:   isAuthenticated,
  });
}

export function useRecentPurchases() {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: [...QUERY_KEYS.PURCHASES, "recent"],
    queryFn:  dashboardService.getRecentPurchases,
    staleTime: STALE_TIMES.PURCHASES,
    enabled:   isAuthenticated,
  });
}

// ─── Charts ───────────────────────────────────────────────────────────────────

export function useMonthlyRevenue() {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS, "monthly-revenue"],
    queryFn:  dashboardService.getMonthlyRevenue,
    staleTime: STALE_TIMES.REPORTS,
    enabled:   isAuthenticated,
  });
}

export function useMonthlySalesCount() {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS, "monthly-sales-count"],
    queryFn:  dashboardService.getMonthlySalesCount,
    staleTime: STALE_TIMES.REPORTS,
    enabled:   isAuthenticated,
  });
}

// ─── Low Stock ────────────────────────────────────────────────────────────────

export function useLowStockProducts() {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, "low-stock"],
    queryFn:  dashboardService.getLowStockProducts,
    staleTime: STALE_TIMES.PRODUCTS,
    enabled:   isAuthenticated,
  });
}
