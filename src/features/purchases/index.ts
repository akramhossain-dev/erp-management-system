/**
 * purchases feature — public API barrel exports.
 */

// Components
export { PurchaseTable }   from "./components/PurchaseTable";
export { PurchaseForm }    from "./components/PurchaseForm";
export { PurchaseItemRow } from "./components/PurchaseItemRow";
export { PurchaseDetails } from "./components/PurchaseDetails";
export { PurchaseSummary } from "./components/PurchaseSummary";

// Hooks
export { usePurchases, usePurchase, PURCHASE_QUERY_KEYS } from "./hooks/usePurchases";
export { useCreatePurchase, useDeletePurchase }            from "./hooks/usePurchaseMutations";

// Services
export { purchaseService } from "./services/purchaseService";

// Schemas
export {
  purchaseSchema,
  PURCHASE_FORM_DEFAULTS,
  type PurchaseFormValues,
} from "./schemas/purchaseSchemas";
