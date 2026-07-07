/**
 * useProductMutations — TanStack Query mutations for product CRUD.
 *
 * Handles create, update, and delete with automatic cache invalidation,
 * success/error notifications via Sonner toast.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { productService } from "@/features/products/services/productService";
import { PRODUCT_QUERY_KEYS } from "@/features/products/hooks/useProducts";
import { useAuthContext } from "@/context/AuthContext";
import { ROUTES, QUERY_KEYS } from "@/utils/constants";
import type { ProductFormValues } from "@/features/products/schemas/productSchemas";

// ─── Invalidation helper ──────────────────────────────────────────────────────

function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return () => {
    // Invalidate product list queries
    queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
    // Also invalidate the dashboard stats so KPI count updates
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
  };
}

// ─── Create Product ───────────────────────────────────────────────────────────

export function useCreateProduct() {
  const { user }        = useAuthContext();
  const navigate        = useNavigate();
  const invalidate      = useInvalidateProducts();

  return useMutation({
    mutationFn: (values: ProductFormValues) => {
      if (!user?.id) throw new Error("You must be logged in to create a product.");
      return productService.createProduct(values, user.id);
    },
    onSuccess: (product) => {
      invalidate();
      toast.success("Product created!", {
        description: `${product.name} (${product.sku}) was added successfully.`,
      });
      navigate(ROUTES.PRODUCTS);
    },
    onError: (error: Error) => {
      toast.error("Failed to create product", {
        description: error.message,
      });
    },
  });
}

// ─── Update Product ───────────────────────────────────────────────────────────

export function useUpdateProduct(productId: string) {
  const navigate    = useNavigate();
  const invalidate  = useInvalidateProducts();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ProductFormValues) =>
      productService.updateProduct(productId, values),

    onSuccess: (product) => {
      invalidate();
      // Also update the single product cache immediately
      queryClient.setQueryData(PRODUCT_QUERY_KEYS.detail(productId), product);
      toast.success("Product updated!", {
        description: `${product.name} was updated successfully.`,
      });
      navigate(ROUTES.PRODUCTS);
    },
    onError: (error: Error) => {
      toast.error("Failed to update product", {
        description: error.message,
      });
    },
  });
}

// ─── Delete Product ───────────────────────────────────────────────────────────

export function useDeleteProduct() {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      invalidate();
      toast.success("Product deleted", {
        description: "The product was removed from your inventory.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete product", {
        description: error.message,
      });
    },
  });
}
