/**
 * useSalesMutations.ts — TanStack Query mutations for Sale invoice creation and deletion.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { salesService } from "@/features/sales/services/salesService";
import { SALES_QUERY_KEYS } from "@/features/sales/hooks/useSales";
import { useAuthContext } from "@/context/AuthContext";
import { ROUTES, QUERY_KEYS } from "@/utils/constants";
import type { SaleFormValues } from "@/features/sales/schemas/salesSchemas";

function useInvalidateSales() {
  const queryClient = useQueryClient();
  return () => {
    // Invalidate sales list
    queryClient.invalidateQueries({ queryKey: SALES_QUERY_KEYS.all });
    // Invalidate products list
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    // Invalidate dashboard totals
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
  };
}

// ─── Create Sale ──────────────────────────────────────────────────────────────

export function useCreateSale() {
  const { user }   = useAuthContext();
  const navigate   = useNavigate();
  const invalidate = useInvalidateSales();

  return useMutation({
    mutationFn: (values: SaleFormValues) => {
      if (!user?.id) throw new Error("You must be logged in to record a sale.");
      return salesService.createSale(values, user.id);
    },
    onSuccess: (sale) => {
      invalidate();
      toast.success("Sale order recorded!", {
        description: `Invoice ${sale.invoice_number} saved and stock quantity deducted.`,
      });
      navigate(ROUTES.SALES);
    },
    onError: (error: Error) => {
      toast.error("Failed to create sale invoice", {
        description: error.message,
      });
    },
  });
}

// ─── Delete Sale ──────────────────────────────────────────────────────────────

export function useDeleteSale() {
  const invalidate = useInvalidateSales();

  return useMutation({
    mutationFn: (id: string) => salesService.deleteSale(id),
    onSuccess: () => {
      invalidate();
      toast.success("Invoice record deleted", {
        description: "The sale order has been removed from transaction history.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete sale", {
        description: error.message,
      });
    },
  });
}
