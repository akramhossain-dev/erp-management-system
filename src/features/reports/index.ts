/**
 * reports feature — public API barrel exports.
 */

// Components
export { ReportFilters } from "./components/ReportFilters";
export { ReportTable }   from "./components/ReportTable";
export { ReportSummaryCards } from "./components/ReportSummaryCards";
export { ProductReportView }  from "./components/ProductReportView";
export { CustomerReportView } from "./components/CustomerReportView";
export { SupplierReportView } from "./components/SupplierReportView";
export { PurchaseReportView } from "./components/PurchaseReportView";
export { SalesReportView }    from "./components/SalesReportView";

// Hook
export { useReport, REPORT_QUERY_KEYS } from "./hooks/useReport";
export type { ReportType, ReportFiltersState } from "./hooks/useReport";

// Service
export { reportService } from "./services/reportService";
export type {
  ProductReportRow,
  CustomerReportRow,
  SupplierReportRow,
  PurchaseReportRow,
  SalesReportRow,
} from "./services/reportService";
