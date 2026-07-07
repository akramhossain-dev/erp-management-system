/**
 * useSupplierMutations.ts — TanStack Query mutations for Supplier CRUD.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supplierService } from "@/features/suppliers/services/supplierService";
import { SUPPLIER_QUERY_KEYS } from "@/features/suppliers/hooks/useSuppliers";
import { useAuthContext } from "@/context/AuthContext";
import { ROUTES, QUERY_KEYS } from "@/utils/constants";
import type { SupplierFormValues } from "@/features/suppliers/schemas/supplierSchemas";

function useInvalidateSuppliers() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: SUPPLIER_QUERY_KEYS.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
  };
}

// ─── Create Supplier ─────────────────────────────────────────────────────────

export function useCreateSupplier() {
  const { user }   = useAuthContext();
  const navigate   = useNavigate();
  const invalidate = useInvalidateSuppliers();

  return useMutation({
    mutationFn: (values: SupplierFormValues) => {
      if (!user?.id) throw new Error("You must be logged in to create a supplier.");
      return supplierService.createSupplier(values, user.id);
    },
    onSuccess: (supplier) => {
      invalidate();
      toast.success("Supplier created!", {
        description: `${supplier.name} was added successfully.`,
      });
      navigate(ROUTES.SUPPLIERS);
    },
    onError: (error: Error) => {
      toast.error("Failed to create supplier", {
        description: error.message,
      });
    },
  });
}

// ─── Update Supplier ─────────────────────────────────────────────────────────

export function useUpdateSupplier(supplierId: string) {
  const navigate    = useNavigate();
  const invalidate  = useInvalidateSuppliers();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: SupplierFormValues) =>
      supplierService.updateSupplier(supplierId, values),

    onSuccess: (supplier) => {
      invalidate();
      queryClient.setQueryData(SUPPLIER_QUERY_KEYS.detail(supplierId), supplier);
      toast.success("Supplier updated!", {
        description: `${supplier.name} was updated successfully.`,
      });
      navigate(ROUTES.SUPPLIERS);
    },
    onError: (error: Error) => {
      toast.error("Failed to update supplier", {
        description: error.message,
      });
    },
  });
}

// ─── Delete Supplier ─────────────────────────────────────────────────────────

export function useDeleteSupplier() {
  const invalidate = useInvalidateSuppliers();

  return useMutation({
    mutationFn: (id: string) => supplierService.deleteSupplier(id),
    onSuccess: () => {
      invalidate();
      toast.success("Supplier deleted", {
        description: "The supplier was removed from the database.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete supplier", {
        description: error.message,
      });
    },
  });
}
