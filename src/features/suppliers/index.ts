/**
 * suppliers feature — public API barrel exports.
 */

// Components
export { SupplierTable }   from "./components/SupplierTable";
export { SupplierForm }    from "./components/SupplierForm";
export { SupplierFilters } from "./components/SupplierFilters";
export { SupplierDetails } from "./components/SupplierDetails";

// Hooks
export { useSuppliers, useSupplier, SUPPLIER_QUERY_KEYS } from "./hooks/useSuppliers";
export { useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from "./hooks/useSupplierMutations";

// Services
export { supplierService } from "./services/supplierService";

// Schemas
export {
  supplierSchema,
  SUPPLIER_FORM_DEFAULTS,
  type SupplierFormValues,
} from "./schemas/supplierSchemas";
