/**
 * Dashboard feature — public API barrel exports.
 */

// Components
export { DashboardStats }  from "./components/DashboardStats";
export { RevenueChart }    from "./components/RevenueChart";
export { SalesChart }      from "./components/SalesChart";
export { RecentActivity }  from "./components/RecentActivity";
export { LowStockAlert }   from "./components/LowStockAlert";

// Hooks
export {
  useDashboardStats,
  useRecentSales,
  useRecentPurchases,
  useMonthlyRevenue,
  useMonthlySalesCount,
  useLowStockProducts,
} from "./hooks/useDashboardStats";

// Service
export { dashboardService } from "./services/dashboardService";
