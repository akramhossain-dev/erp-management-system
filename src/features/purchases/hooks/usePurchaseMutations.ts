/**
 * usePurchaseMutations.ts — TanStack Query mutations for Purchase creation and deletion.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { purchaseService } from "@/features/purchases/services/purchaseService";
import { PURCHASE_QUERY_KEYS } from "@/features/purchases/hooks/usePurchases";
import { useAuthContext } from "@/context/AuthContext";
import { ROUTES, QUERY_KEYS } from "@/utils/constants";
import type { PurchaseFormValues } from "@/features/purchases/schemas/purchaseSchemas";

function useInvalidatePurchases() {
  const queryClient = useQueryClient();
  return () => {
    // Invalidate purchases list queries
    queryClient.invalidateQueries({ queryKey: PURCHASE_QUERY_KEYS.all });
    // Invalidate product queries (since stock levels changed)
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    // Invalidate dashboard stats
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
  };
}

// ─── Create Purchase ──────────────────────────────────────────────────────────

export function useCreatePurchase() {
  const { user }   = useAuthContext();
  const navigate   = useNavigate();
  const invalidate = useInvalidatePurchases();

  return useMutation({
    mutationFn: (values: PurchaseFormValues) => {
      if (!user?.id) throw new Error("You must be logged in to create a purchase.");
      return purchaseService.createPurchase(values, user.id);
    },
    onSuccess: (purchase) => {
      invalidate();
      toast.success("Purchase recorded!", {
        description: `Order total $${purchase.total_amount.toLocaleString()} was added and product stock increased successfully.`,
      });
      navigate(ROUTES.PURCHASES);
    },
    onError: (error: Error) => {
      toast.error("Failed to create purchase", {
        description: error.message,
      });
    },
  });
}

// ─── Delete Purchase ──────────────────────────────────────────────────────────

export function useDeletePurchase() {
  const invalidate = useInvalidatePurchases();

  return useMutation({
    mutationFn: (id: string) => purchaseService.deletePurchase(id),
    onSuccess: () => {
      invalidate();
      toast.success("Purchase deleted", {
        description: "The purchase record was removed from history.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete purchase", {
        description: error.message,
      });
    },
  });
}
