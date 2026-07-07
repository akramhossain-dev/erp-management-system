import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
// ─── Phase 5: Product pages ───────────────────────────────────────────────────
import { ProductsPage }   from "@/pages/products/ProductsPage";
import { ProductNewPage } from "@/pages/products/ProductNewPage";
import { ProductEditPage } from "@/pages/products/ProductEditPage";
// ─── Phase 6: Customer & Supplier pages ─────────────────────────────────────
import { CustomersPage } from "@/pages/customers/CustomersPage";
import { CustomerNewPage } from "@/pages/customers/CustomerNewPage";
import { CustomerEditPage } from "@/pages/customers/CustomerEditPage";
import { SuppliersPage } from "@/pages/suppliers/SuppliersPage";
import { SupplierNewPage } from "@/pages/suppliers/SupplierNewPage";
import { SupplierEditPage } from "@/pages/suppliers/SupplierEditPage";
// ─── Phase 7: Purchases pages ───────────────────────────────────────────────
import { PurchasesPage } from "@/pages/purchases/PurchasesPage";
import { PurchaseNewPage } from "@/pages/purchases/PurchaseNewPage";
import { PurchaseDetailsPage } from "@/pages/purchases/PurchaseDetailsPage";
// ─── Phase 8: Sales pages ───────────────────────────────────────────────────
import { SalesPage } from "@/pages/sales/SalesPage";
import { SalesNewPage } from "@/pages/sales/SalesNewPage";
import { SalesDetailsPage } from "@/pages/sales/SalesDetailsPage";
// ─── Phase 9: Reports page ───────────────────────────────────────────────────
import { ReportsPage } from "@/pages/reports/ReportsPage";
import { ROUTES } from "@/utils/constants";


/**
 * AppRoutes — complete application routing.
 *
 * Structure:
 * - /login, /register           → public (AuthLayout)
 * - /dashboard, /products, etc  → protected (ProtectedRoute + DashboardLayout)
 * - /                           → redirects to /dashboard
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      {/* ── Public Auth Routes ─────────────────────────────────────────────── */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN}    element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      {/* ── Protected Dashboard Routes ──────────────────────────────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

        {/* Products — Phase 5 ✅ */}
        <Route path={ROUTES.PRODUCTS}     element={<ProductsPage />} />
        <Route path={ROUTES.PRODUCTS_NEW} element={<ProductNewPage />} />
        <Route path="/products/:id/edit"  element={<ProductEditPage />} />

        {/* Customers — Phase 6 ✅ */}
        <Route path={ROUTES.CUSTOMERS}     element={<CustomersPage />} />
        <Route path={ROUTES.CUSTOMERS_NEW} element={<CustomerNewPage />} />
        <Route path="/customers/:id/edit"  element={<CustomerEditPage />} />

        {/* Suppliers — Phase 6 ✅ */}
        <Route path={ROUTES.SUPPLIERS}     element={<SuppliersPage />} />
        <Route path={ROUTES.SUPPLIERS_NEW} element={<SupplierNewPage />} />
        <Route path="/suppliers/:id/edit"  element={<SupplierEditPage />} />

        {/* Purchases — Phase 7 ✅ */}
        <Route path={ROUTES.PURCHASES}     element={<PurchasesPage />} />
        <Route path={ROUTES.PURCHASES_NEW} element={<PurchaseNewPage />} />
        <Route path="/purchases/:id"       element={<PurchaseDetailsPage />} />

        {/* Sales — Phase 8 ✅ */}
        <Route path={ROUTES.SALES}     element={<SalesPage />} />
        <Route path={ROUTES.SALES_NEW} element={<SalesNewPage />} />
        <Route path="/sales/:id"       element={<SalesDetailsPage />} />
        <Route path="/sales/:id/invoice" element={<SalesDetailsPage />} />

        {/* Reports — Phase 9 ✅ */}
        <Route path={ROUTES.REPORTS}           element={<ReportsPage />} />
        <Route path={ROUTES.REPORTS_PRODUCTS}  element={<ReportsPage />} />
        <Route path={ROUTES.REPORTS_CUSTOMERS} element={<ReportsPage />} />
        <Route path={ROUTES.REPORTS_SUPPLIERS} element={<ReportsPage />} />
        <Route path={ROUTES.REPORTS_PURCHASES} element={<ReportsPage />} />
        <Route path={ROUTES.REPORTS_SALES}     element={<ReportsPage />} />
      </Route>

      {/* 404 — redirect to dashboard (ProtectedRoute will handle auth) */}
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
