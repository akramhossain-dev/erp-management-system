import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query client configuration.
 *
 * Stale times follow the architecture plan:
 * - Dashboard KPI stats: 30s  (frequently updated)
 * - Products list: 5min       (changes only on CRUD)
 * - Customers list: 10min     (low-frequency updates)
 * - Suppliers list: 10min     (low-frequency updates)
 * - Purchases history: 2min
 * - Sales history: 2min
 * - Report data: 1min
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed queries twice before showing error
      retry: 2,
      // Retry delay: exponential backoff (1s, 2s)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus in development (helps DX)
      refetchOnWindowFocus: import.meta.env.PROD,
    },
    mutations: {
      // Don't retry mutations by default (prevent duplicate records)
      retry: 0,
    },
  },
});
