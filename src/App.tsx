import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import { AppRoutes } from "@/routes";

/**
 * App — root application component.
 *
 * Provider order (outer → inner):
 * 1. BrowserRouter       — React Router context
 * 2. QueryClientProvider — TanStack Query context
 * 3. AuthProvider        — Supabase auth state + logout action
 * 4. AppRoutes           — Application routes
 * 5. Toaster             — Sonner global toast notifications
 */
function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: "var(--bg-surface-200)",
                border:     "1px solid var(--border-default)",
                color:      "var(--text-primary)",
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
