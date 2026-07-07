/**
 * useCustomerMutations.ts — TanStack Query mutations for Customer CRUD.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { customerService } from "@/features/customers/services/customerService";
import { CUSTOMER_QUERY_KEYS } from "@/features/customers/hooks/useCustomers";
import { useAuthContext } from "@/context/AuthContext";
import { ROUTES, QUERY_KEYS } from "@/utils/constants";
import type { CustomerFormValues } from "@/features/customers/schemas/customerSchemas";

function useInvalidateCustomers() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
  };
}

// ─── Create Customer ─────────────────────────────────────────────────────────

export function useCreateCustomer() {
  const { user }   = useAuthContext();
  const navigate   = useNavigate();
  const invalidate = useInvalidateCustomers();

  return useMutation({
    mutationFn: (values: CustomerFormValues) => {
      if (!user?.id) throw new Error("You must be logged in to create a customer.");
      return customerService.createCustomer(values, user.id);
    },
    onSuccess: (customer) => {
      invalidate();
      toast.success("Customer created!", {
        description: `${customer.name} was added successfully.`,
      });
      navigate(ROUTES.CUSTOMERS);
    },
    onError: (error: Error) => {
      toast.error("Failed to create customer", {
        description: error.message,
      });
    },
  });
}

// ─── Update Customer ─────────────────────────────────────────────────────────

export function useUpdateCustomer(customerId: string) {
  const navigate    = useNavigate();
  const invalidate  = useInvalidateCustomers();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CustomerFormValues) =>
      customerService.updateCustomer(customerId, values),

    onSuccess: (customer) => {
      invalidate();
      queryClient.setQueryData(CUSTOMER_QUERY_KEYS.detail(customerId), customer);
      toast.success("Customer updated!", {
        description: `${customer.name} was updated successfully.`,
      });
      navigate(ROUTES.CUSTOMERS);
    },
    onError: (error: Error) => {
      toast.error("Failed to update customer", {
        description: error.message,
      });
    },
  });
}

// ─── Delete Customer ─────────────────────────────────────────────────────────

export function useDeleteCustomer() {
  const invalidate = useInvalidateCustomers();

  return useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    onSuccess: () => {
      invalidate();
      toast.success("Customer deleted", {
        description: "The customer was removed from the database.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete customer", {
        description: error.message,
      });
    },
  });
}
