import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ROUTES } from "@/utils/constants";

// ─── Page Imports (lazy-loaded in future phases) ──────────────────────────────
// These pages will be implemented in Phase 2+.
// Using placeholder components until then.

function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 rounded-2xl glass-default flex items-center justify-center">
        <span className="text-3xl">🚧</span>
      </div>
      <h1 className="text-h2 text-text-primary">{title}</h1>
      <p className="text-body text-text-secondary">
        This module will be implemented in the next phase.
      </p>
    </div>
  );
}

/**
 * AppRoutes — defines all application routes.
 *
 * Route structure:
 * - Public routes:  /login, /register (wrapped in AuthLayout)
 * - Protected routes: /dashboard and all ERP modules (wrapped in DashboardLayout + ProtectedRoute)
 * - Root /: redirects to /dashboard
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      {/* ── Public Routes (Auth) ───────────────────────────────────────────── */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<ComingSoonPage title="Login" />} />
        <Route path={ROUTES.REGISTER} element={<ComingSoonPage title="Register" />} />
      </Route>

      {/* ── Protected Routes (Dashboard) ──────────────────────────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path={ROUTES.DASHBOARD} element={<ComingSoonPage title="Dashboard" />} />

        {/* Products */}
        <Route path={ROUTES.PRODUCTS} element={<ComingSoonPage title="Products" />} />
        <Route path={ROUTES.PRODUCTS_NEW} element={<ComingSoonPage title="New Product" />} />
        <Route path="/products/:id/edit" element={<ComingSoonPage title="Edit Product" />} />

        {/* Customers */}
        <Route path={ROUTES.CUSTOMERS} element={<ComingSoonPage title="Customers" />} />
        <Route path={ROUTES.CUSTOMERS_NEW} element={<ComingSoonPage title="New Customer" />} />
        <Route path="/customers/:id/edit" element={<ComingSoonPage title="Edit Customer" />} />

        {/* Suppliers */}
        <Route path={ROUTES.SUPPLIERS} element={<ComingSoonPage title="Suppliers" />} />
        <Route path={ROUTES.SUPPLIERS_NEW} element={<ComingSoonPage title="New Supplier" />} />
        <Route path="/suppliers/:id/edit" element={<ComingSoonPage title="Edit Supplier" />} />

        {/* Purchases */}
        <Route path={ROUTES.PURCHASES} element={<ComingSoonPage title="Purchases" />} />
        <Route path={ROUTES.PURCHASES_NEW} element={<ComingSoonPage title="New Purchase" />} />
        <Route path="/purchases/:id" element={<ComingSoonPage title="Purchase Detail" />} />

        {/* Sales */}
        <Route path={ROUTES.SALES} element={<ComingSoonPage title="Sales" />} />
        <Route path={ROUTES.SALES_NEW} element={<ComingSoonPage title="New Sale" />} />
        <Route path="/sales/:id" element={<ComingSoonPage title="Sale Detail" />} />
        <Route path="/sales/:id/invoice" element={<ComingSoonPage title="Invoice" />} />

        {/* Reports */}
        <Route path={ROUTES.REPORTS} element={<ComingSoonPage title="Reports" />} />
        <Route path={ROUTES.REPORTS_PRODUCTS} element={<ComingSoonPage title="Product Reports" />} />
        <Route path={ROUTES.REPORTS_CUSTOMERS} element={<ComingSoonPage title="Customer Reports" />} />
        <Route path={ROUTES.REPORTS_SUPPLIERS} element={<ComingSoonPage title="Supplier Reports" />} />
        <Route path={ROUTES.REPORTS_PURCHASES} element={<ComingSoonPage title="Purchase Reports" />} />
        <Route path={ROUTES.REPORTS_SALES} element={<ComingSoonPage title="Sales Reports" />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
