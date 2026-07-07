import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import { AppRoutes } from "@/routes";

/**
 * App — root application component.
 *
 * Provider order (outer to inner):
 * 1. BrowserRouter     — React Router context
 * 2. QueryClientProvider — TanStack Query context
 * 3. AuthProvider      — Supabase auth state
 * 4. AppRoutes         — Application routes
 */
function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
