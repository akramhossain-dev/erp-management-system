/**
 * customers feature — public API barrel exports.
 */

// Components
export { CustomerTable }   from "./components/CustomerTable";
export { CustomerForm }    from "./components/CustomerForm";
export { CustomerFilters } from "./components/CustomerFilters";
export { CustomerDetails } from "./components/CustomerDetails";

// Hooks
export { useCustomers, useCustomer, CUSTOMER_QUERY_KEYS } from "./hooks/useCustomers";
export { useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from "./hooks/useCustomerMutations";

// Services
export { customerService } from "./services/customerService";

// Schemas
export {
  customerSchema,
  CUSTOMER_FORM_DEFAULTS,
  type CustomerFormValues,
} from "./schemas/customerSchemas";
