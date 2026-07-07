/**
 * sales feature — public API barrel exports.
 */

// Components
export { SalesTable }   from "./components/SalesTable";
export { SalesForm }    from "./components/SalesForm";
export { SalesItemRow } from "./components/SalesItemRow";
export { SalesDetails } from "./components/SalesDetails";
export { SalesSummary } from "./components/SalesSummary";
export { InvoicePreview } from "./components/InvoicePreview";

// Hooks
export { useSales, useSale, SALES_QUERY_KEYS } from "./hooks/useSales";
export { useCreateSale, useDeleteSale }          from "./hooks/useSalesMutations";

// Services
export { salesService } from "./services/salesService";

// Schemas
export {
  saleSchema,
  SALES_FORM_DEFAULTS,
  type SaleFormValues,
} from "./schemas/salesSchemas";
