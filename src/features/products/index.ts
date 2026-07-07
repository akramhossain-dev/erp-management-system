/**
 * products feature — public API barrel exports.
 */

// Components
export { ProductTable }   from "./components/ProductTable";
export { ProductForm }    from "./components/ProductForm";
export { ProductFilters } from "./components/ProductFilters";
export { ProductDetails } from "./components/ProductDetails";

// Hooks
export { useProducts, useProduct, useProductCategories, PRODUCT_QUERY_KEYS } from "./hooks/useProducts";
export { useCreateProduct, useUpdateProduct, useDeleteProduct }               from "./hooks/useProductMutations";

// Services
export { productService } from "./services/productService";

// Schemas
export {
  productSchema,
  PRODUCT_FORM_DEFAULTS,
  PRODUCT_CATEGORIES,
  type ProductFormValues,
  type ProductFilterValues,
} from "./schemas/productSchemas";
