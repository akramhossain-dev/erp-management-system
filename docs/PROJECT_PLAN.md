# ERP Management System — Project Plan

> **Version:** 1.0.0  
> **Phase:** 5 — Product Management Module (Complete)  
> **Status:** ✅ Phase 1 | ✅ Phase 2 | ✅ Phase 3 | ✅ Phase 4 | ✅ Phase 5 Complete  
> **Last Updated:** 2026-07-07

---

## Phase 5 — Product Management Module ✅

> **Completed:** 2026-07-07

### Module Architecture

```
features/products/
├── schemas/
│   └── productSchemas.ts     → Zod schema, PRODUCT_CATEGORIES, form defaults
├── services/
│   └── productService.ts     → Supabase CRUD (getProducts, getById,
│                                create, update, delete, checkSku, getCategories)
├── hooks/
│   ├── useProducts.ts        → list query (search/filter/pagination)
│   └── useProductMutations.ts → create/update/delete mutations
└── components/
    ├── ProductTable.tsx       → data table with stock badges, pagination
    ├── ProductFilters.tsx     → search + category + stock status filters
    ├── ProductForm.tsx        → create/edit form (RHF + Zod, margin preview)
    └── ProductDetails.tsx    → read-only product detail view

components/common/ConfirmDialog/ → reusable delete confirmation modal

pages/products/
├── ProductsPage.tsx          → /products  (list + filters + table)
├── ProductNewPage.tsx        → /products/new (create form)
└── ProductEditPage.tsx       → /products/:id/edit (edit form)
```

### CRUD Workflow

| Operation | Service Function | Hook | Route |
|-----------|-----------------|------|-------|
| List      | `getProducts()`  | `useProducts()` | GET /products |
| Read      | `getProductById()` | `useProduct(id)` | GET /products/:id/edit |
| Create    | `createProduct()` | `useCreateProduct()` | POST /products/new |
| Update    | `updateProduct()` | `useUpdateProduct(id)` | PATCH /products/:id/edit |
| Delete    | `deleteProduct()` | `useDeleteProduct()` | DELETE (inline) |

### Data Flow

```
ProductsPage
    ↓
useProducts (TanStack Query)
    ↓
productService.getProducts({ filters, page, pageSize })
    ↓
supabase.from("products").select("*", { count: "exact" }).order().range()
    ↓
PostgreSQL products table (RLS scoped to user_id)
```

### Validation Rules

| Field | Rules |
|-------|-------|
| `name` | Required, max 200 chars |
| `sku` | Required, max 50 chars, `[A-Za-z0-9_-]+` regex, unique per user |
| `category` | Optional, max 100 chars, from PRODUCT_CATEGORIES |
| `description` | Optional, max 1000 chars |
| `purchase_price` | Required, ≥ 0 |
| `selling_price` | Required, ≥ 0 |
| `stock_quantity` | Required, integer, ≥ 0 |
| `min_stock` | Required, integer, ≥ 0 |

### Search & Filtering

- **Text search**: `name.ilike.%term%` OR `sku.ilike.%term%` (Supabase server-side)
- **Debounce**: 350ms delay prevents excessive API calls
- **Category**: Dropdown with predefined + DB categories merged
- **Stock status**: all / in_stock (qty > 0) / low_stock (0 < qty ≤ min_stock) / out_of_stock (qty = 0)
- **Pagination**: 10 per page, server-side with count

### Dashboard Integration

The dashboard KPI "Total Products" is updated automatically via:
- `useCreateProduct` → invalidates `QUERY_KEYS.DASHBOARD`
- `useDeleteProduct` → invalidates `QUERY_KEYS.DASHBOARD`

### Phase 5 Verification Checklist

- ✅ productService: getProducts (search + filter + pagination)
- ✅ productService: createProduct with SKU uniqueness + user_id injection
- ✅ productService: updateProduct with typed Supabase Update payload
- ✅ productService: deleteProduct with FK constraint error handling
- ✅ productService: checkSkuExists, getCategories
- ✅ productSchemas: Zod v4 validation, SKU regex, PRODUCT_CATEGORIES
- ✅ useProducts: filter state, debounced search, pagination, placeholderData
- ✅ useProductMutations: invalidates products list + dashboard KPI
- ✅ ProductForm: create/edit mode, gross profit margin preview
- ✅ ProductTable: StockBadge, skeleton rows, empty state, pagination
- ✅ ProductFilters: search + category + stock status + clear
- ✅ ProductDetails: read-only with stock progress bar
- ✅ ConfirmDialog: reusable danger modal for delete
- ✅ Routes: /products, /products/new, /products/:id/edit live
- ✅ Production build: zero TypeScript errors (2,628 modules)

---

## Phase 4 — ERP Layout & Dashboard System ✅

> **Completed:** 2026-07-07

### Layout Architecture

| Component | Location | Description |
|-----------|----------|-------------|
| `DashboardLayout` | `layouts/DashboardLayout.tsx` | Shell: Sidebar + Navbar + Outlet |
| `Sidebar` | `components/common/Sidebar/` | Collapsible nav (260px/72px) |
| `MobileDrawer` | `components/common/Sidebar/MobileDrawer.tsx` | Mobile overlay drawer |
| `Navbar` | `components/common/Navbar/` | Sticky header: title, bell, user menu |
| `NavIcons` | `components/common/NavIcons.tsx` | Inline SVG icon set |
| `KpiCard` | `components/common/KpiCard/` | Reusable glass metric card |

### Dashboard Feature Structure

```
features/dashboard/
├── components/
│   ├── DashboardStats.tsx    → 6 KPI cards grid
│   ├── RevenueChart.tsx      → 6-month area chart (Recharts)
│   ├── SalesChart.tsx        → Completed vs pending bar chart
│   ├── RecentActivity.tsx    → Merged sales+purchases feed
│   └── LowStockAlert.tsx     → Low stock product table
├── hooks/
│   └── useDashboardStats.ts  → 6 TanStack Query hooks
├── services/
│   └── dashboardService.ts   → Supabase queries
└── index.ts                  → Barrel exports
```

### Chart Library

- **Recharts** — React chart library with responsive containers
- Revenue: `AreaChart` with gradient fill and custom tooltip
- Sales: `BarChart` grouped bars (completed=green, pending=amber)

### Responsive Breakpoints

| Breakpoint | KPI Grid | Charts | Activity |
|------------|----------|--------|----------|
| mobile (<sm) | 1 column | stacked | stacked |
| sm–lg | 2 columns | stacked | stacked |
| lg–xl | 2 columns | 2/3 + 1/3 | stacked |
| xl+ | 3 columns | 2/3 + 1/3 | side-by-side |

### Phase 4 Verification Checklist

- ✅ Sidebar: 7 nav items in 4 groups, active state, collapse/expand
- ✅ Navbar: dynamic page title, notification bell, user dropdown + logout
- ✅ MobileDrawer: auto-closes on route change, scroll trapped
- ✅ KPI Cards: 6 metrics, trend badge, skeleton loading, hover glow
- ✅ RevenueChart: 6-month area chart, custom tooltip, skeleton
- ✅ SalesChart: grouped bar chart, custom legend, skeleton
- ✅ RecentActivity: merged feed, status badges, empty state
- ✅ LowStockAlert: product table with Out of Stock / Low Stock differentiation
- ✅ Refresh button invalidates all TanStack Query caches
- ✅ Data hooks: all enabled only when `isAuthenticated = true`
- ✅ Production build: zero TypeScript errors (804 modules)

---

## Phase 1 — Completion Status ✅

> **Completed:** 2026-07-07  

### Installed Packages

| Package | Version | Purpose |
|---------|---------|----------|
| react + react-dom | ^19 | UI framework |
| vite | ^8 | Build tool & dev server |
| typescript | ~5.8 | Type safety |
| tailwindcss + @tailwindcss/vite | ^4 | Utility-first CSS |
| react-router-dom | ^7 | Client-side routing |
| @tanstack/react-query | ^5 | Server state management |
| react-hook-form | ^7 | Form state management |
| @hookform/resolvers | ^3 | Zod integration for RHF |
| zod | ^3 | Schema validation |
| @supabase/supabase-js | ^2 | Supabase client |
| lucide-react | latest | Icon library |
| clsx + tailwind-merge | latest | Class utilities |
| class-variance-authority | latest | CVA for Shadcn UI |

### Shadcn UI Components Installed

- Button, Input, Card, Dialog, Form, Table
- Dropdown Menu, Badge, Skeleton, Select, Label

### Architecture Decisions Made

| Decision | Implementation |
|----------|----------------|
| Path alias | `@/*` → `./src/*` via tsconfig + vite config |
| Tailwind version | v4 (uses `@import "tailwindcss"` + `@theme {}`) |
| Shadcn base color | Slate (dark theme compatible) |
| CSS variables | Full Shadcn + custom design tokens in `:root` |
| Auth state | React Context (`AuthContext.tsx`) with Supabase listener |
| Query client | TanStack Query with stale times per architecture plan |
| Zod schemas | Common schema lib in `src/lib/schemas.ts` |

### Verified Checklist

- ✅ React + Vite running (`npm run dev` → http://localhost:5173)
- ✅ TypeScript configured (strict mode, path aliases)
- ✅ Tailwind CSS v4 working (design tokens, glassmorphism)
- ✅ Shadcn UI configured (11 components installed)
- ✅ Router configured (React Router v7)
- ✅ TanStack Query configured (queryClient.ts)
- ✅ Supabase client setup (src/lib/supabase.ts)
- ✅ Folder structure complete
- ✅ Environment variables prepared (.env.example)
- ✅ Production build succeeds (zero errors)

---

## Phase 3 — Authentication System ✅

> **Completed:** 2026-07-07

### Auth Architecture

```
User (browser)
    │
    │ React Hook Form (Zod validation)
    ▼
LoginForm / RegisterForm (features/auth/components/)
    │
    │ useAuth() hook
    ▼
authService.ts  (signIn / signUp / signOut)
    │
    │ @supabase/supabase-js
    ▼
Supabase Auth (JWT, sessions, email/password)
    │
    │ handle_new_user() TRIGGER (DB level)
    ▼
public.users (profile row auto-created)
```

### Files Created / Modified

| File | Status | Purpose |
|------|--------|---------|
| `src/features/auth/schemas/authSchemas.ts` | NEW | Zod schemas: login + register (strong password rules) |
| `src/features/auth/services/authService.ts` | UPDATED | Complete signIn/signUp/signOut with error mapping |
| `src/features/auth/hooks/useAuth.ts` | UPDATED | login/register/logout mutations + isMutating state |
| `src/features/auth/components/LoginForm.tsx` | NEW | Email + password form (RHF + Zod) |
| `src/features/auth/components/RegisterForm.tsx` | NEW | Full name + email + password + confirm + email confirmation flow |
| `src/features/auth/components/PasswordInput.tsx` | NEW | Password field with show/hide toggle |
| `src/features/auth/components/PasswordStrength.tsx` | NEW | 4-segment strength bar + rules checklist |
| `src/features/auth/components/FormFieldWrapper.tsx` | NEW | Label + error message wrapper |
| `src/features/auth/index.ts` | UPDATED | Barrel exports all auth feature items |
| `src/context/AuthContext.tsx` | UPDATED | Adds logout() action, uses authService.onAuthStateChange |
| `src/pages/auth/LoginPage.tsx` | UPDATED | Renders LoginForm inside AuthLayout |
| `src/pages/auth/RegisterPage.tsx` | UPDATED | Renders RegisterForm inside AuthLayout |
| `src/pages/DashboardPage.tsx` | UPDATED | Phase 3 placeholder with user info + logout button |
| `src/routes/AppRoutes.tsx` | UPDATED | Wires all real pages; protected routes for all ERP modules |
| `src/App.tsx` | UPDATED | Adds Sonner Toaster with ERP dark theme styling |
| `src/components/ui/sonner.tsx` | UPDATED | Removed next-themes dependency; custom dark theme |
| `src/lib/supabase.ts` | UPDATED | Safe init: validates URL format before createClient |

### Security Decisions

| Decision | Implementation |
|----------|----------------|
| Password validation | Min 8 chars + 1 uppercase + 1 number (Zod + visual indicator) |
| Error messages | Supabase technical errors remapped to friendly messages |
| Protected routes | ProtectedRoute component with loading state (no flash) |
| Auth state | Single source of truth in AuthContext (no prop drilling) |
| Session persistence | localStorage (Supabase default) + auto token refresh |
| Email trimming | All emails lowercased and trimmed before Supabase call |
| DB-level security | RLS on all tables (set up in Phase 2) |

### Auth Flow Diagram

```
Registration:
  Form submit → Zod validate → authService.signUp(email, password, full_name)
      → Supabase creates auth.users row
      → handle_new_user() TRIGGER creates public.users profile
      → Session returned → navigate to /dashboard
      (or show email confirmation screen if Supabase email confirm is ON)

Login:
  Form submit → Zod validate → authService.signIn(email, password)
      → Supabase validates credentials → returns JWT session
      → AuthContext.onAuthStateChange fires SIGNED_IN
      → navigate to /dashboard

Logout:
  User clicks logout → useAuth().logout() → authService.signOut()
      → Supabase clears session → localStorage cleared
      → AuthContext.onAuthStateChange fires SIGNED_OUT
      → navigate to /login

Protected Route:
  Navigate to /dashboard (or any ERP route)
      → ProtectedRoute checks isLoading (prevents flash)
      → if !isAuthenticated → <Navigate to="/login" replace />
      → if authenticated → renders DashboardLayout + child page
```

### Phase 3 Verification Checklist

- ✅ User registration form (full_name, email, password, confirm_password)
- ✅ Strong password validation (length, uppercase, number)
- ✅ Password strength indicator with live checklist
- ✅ Password show/hide toggle
- ✅ User login form (email, password)
- ✅ Form validation with field-level error messages
- ✅ Supabase signIn / signUp / signOut wired
- ✅ AuthContext provides user, session, isAuthenticated, isLoading, logout
- ✅ useAuth() hook provides login, register, logout + isMutating
- ✅ Protected routes redirect to /login when unauthenticated
- ✅ AuthLayout redirects to /dashboard when already authenticated
- ✅ Session persists after page refresh
- ✅ Toast notifications for all auth errors
- ✅ Email confirmation flow handled (shows confirmation screen)
- ✅ All ERP module routes protected (products, customers, suppliers, purchases, sales, reports)
- ✅ Dashboard placeholder shows user info + functional logout
- ✅ Production build: zero TypeScript errors

### Setup Instructions

```bash
# 1. Clone and install
git clone https://github.com/[username]/erp-management-system.git
cd erp-management-system
npm install

# 2. Configure Supabase
cp .env.example .env.local
# Edit .env.local with your credentials:
# VITE_SUPABASE_URL=https://[your-project].supabase.co
# VITE_SUPABASE_ANON_KEY=[your-anon-key]

# 3. Start dev server
npm run dev

# 4. Production build
npm run build
```

---


1. [Project Overview](#1-project-overview)
2. [Requirement Analysis](#2-requirement-analysis)
3. [Module Dependency Map](#3-module-dependency-map)
4. [Development Priority & Implementation Order](#4-development-priority--implementation-order)
5. [Future Scalability Plan](#5-future-scalability-plan)

---

## 1. Project Overview

**Project Name:** erp-management-system  
**Goal:** Build a modern, production-ready Enterprise Resource Planning (ERP) application using an AI-assisted development workflow.  
**Audience:** Small-to-medium enterprises (SMEs) needing unified inventory, sales, purchasing, and reporting management.

### Core Value Proposition

| Problem                         | Solution                                       |
|---------------------------------|------------------------------------------------|
| Fragmented business data        | Single unified dashboard with live KPIs        |
| Manual inventory tracking       | Auto-adjust stock on Purchase / Sale events    |
| No customer/supplier history    | Linked entity history and transaction records  |
| Slow reporting                  | Instant filterable reports per module          |

---

## 2. Requirement Analysis

### 2.1 Feature Breakdown

#### Module 1 — Authentication

| Feature           | Description                                              | Priority |
|-------------------|----------------------------------------------------------|----------|
| User Registration | Email + password signup with Supabase Auth               | P0       |
| User Login        | JWT-based session via Supabase Auth                      | P0       |
| User Logout       | Clear session and redirect to login                      | P0       |
| Protected Routes  | Route guard — unauthenticated users redirected to /login | P0       |
| Session Management| Supabase session persistence in local storage / cookies  | P0       |

#### Module 2 — Dashboard

| Feature            | Description                                          | Priority |
|--------------------|------------------------------------------------------|----------|
| Total Products KPI | Count of active products in database                 | P1       |
| Total Customers KPI| Count of customer records                            | P1       |
| Total Suppliers KPI| Count of supplier records                            | P1       |
| Total Purchases KPI| Count of all purchase transactions                   | P1       |
| Total Sales KPI    | Count of all sale transactions                       | P1       |
| Revenue KPI        | Sum of all completed sale totals                     | P1       |

#### Module 3 — Product Management

| Feature          | Description                                          | Priority |
|------------------|------------------------------------------------------|----------|
| Create Product   | Form to add name, SKU, price, stock, category        | P1       |
| View Products    | Paginated data table with all product records        | P1       |
| Update Product   | Edit form pre-filled with existing record            | P1       |
| Delete Product   | Soft-delete or hard-delete with confirmation dialog  | P1       |
| Product Search   | Real-time search by name or SKU                      | P2       |
| Product Filter   | Filter by category, price range, stock level         | P2       |

#### Module 4 — Customer Management

| Feature          | Description                                          | Priority |
|------------------|------------------------------------------------------|----------|
| Create Customer  | Form with name, email, phone, address                | P1       |
| View Customers   | Paginated table with search capability               | P1       |
| Update Customer  | Edit customer details                                | P1       |
| Delete Customer  | Remove customer record (guard against linked sales)  | P2       |

#### Module 5 — Supplier Management

| Feature          | Description                                          | Priority |
|------------------|------------------------------------------------------|----------|
| Create Supplier  | Form with name, email, phone, address                | P1       |
| View Suppliers   | Paginated table with search capability               | P1       |
| Update Supplier  | Edit supplier details                                | P1       |
| Delete Supplier  | Remove supplier record (guard against linked purchases)| P2     |

#### Module 6 — Purchase Management

| Feature               | Description                                           | Priority |
|-----------------------|-------------------------------------------------------|----------|
| Create Purchase       | Form to select supplier + add line items              | P1       |
| Supplier Selection    | Dropdown linked to suppliers table                    | P1       |
| Product Selection     | Multi-line item product picker with quantity input    | P1       |
| Quantity Management   | Per-line quantity + unit price + total calculation    | P1       |
| Purchase History      | Paginated list of past purchases with status          | P1       |
| Auto Stock Increase   | On purchase completion: product.stock += quantity     | P0 (BL)  |

> **BL = Business Logic** — critical, must be implemented at database trigger or service layer.

#### Module 7 — Sales Management

| Feature             | Description                                           | Priority |
|---------------------|-------------------------------------------------------|----------|
| Create Sale         | Form to select customer + add line items              | P1       |
| Customer Selection  | Dropdown linked to customers table                    | P1       |
| Product Selection   | Multi-line item product picker with stock check       | P1       |
| Stock Validation    | Prevent sale if quantity > available stock            | P0 (BL)  |
| Invoice Generation  | Printable/exportable invoice view after completion    | P2       |
| Auto Stock Decrease | On sale completion: product.stock -= quantity         | P0 (BL)  |

#### Module 8 — Reports

| Report Type       | Description                                           | Priority |
|-------------------|-------------------------------------------------------|----------|
| Product Report    | All products with stock, value, categories            | P2       |
| Customer Report   | All customers with total sales history                | P2       |
| Supplier Report   | All suppliers with total purchase history             | P2       |
| Purchase Report   | All purchases filterable by date, supplier            | P2       |
| Sales Report      | All sales filterable by date, customer, revenue       | P2       |

---

## 3. Module Dependency Map

```
Authentication (P0)
        │
        ▼
  Dashboard (P1)  ────────────────────────────────────────┐
        │                                                  │
        ├──── Product Management (P1) ◄──────────────────┐│
        │             │                                   ││
        ├──── Customer Management (P1)                    ││
        │             │                                   ││
        ├──── Supplier Management (P1)                    ││
        │             │                                   ││
        ├──── Purchase Management (P1) ──► Stock ++ ──────┘│
        │             │ (requires: Supplier + Product)      │
        │             │                                     │
        ├──── Sales Management (P1) ──► Stock -- ──────────┘
        │             │ (requires: Customer + Product)
        │
        └──── Reports Module (P2)
                      │ (reads from: all tables)
```

### Dependency Rules

- **Authentication** must be operational before any other module is accessible.
- **Product Management** must exist before Purchase or Sales can reference products.
- **Customer Management** must exist before Sales can reference customers.
- **Supplier Management** must exist before Purchases can reference suppliers.
- **Reports Module** is purely read-only; it depends on all other modules having data.
- **Dashboard** aggregates data from all modules; it can be built with mock data early, but requires real data for KPIs.

---

## 4. Development Priority & Implementation Order

### Priority Levels

| Level | Label      | Description                                               |
|-------|------------|-----------------------------------------------------------|
| P0    | Critical   | Core infrastructure; nothing works without this           |
| P1    | High       | Core business features; MVP requires these                |
| P2    | Medium     | Enhanced features; add after MVP is stable                |
| P3    | Low        | Nice-to-have; post-launch improvements                    |

### Recommended Sprint Order

#### Sprint 0 — Foundation (Week 1)
- Project scaffold (Vite + React + TypeScript + Tailwind + Shadcn)
- Supabase project creation + environment setup
- Folder structure creation
- Base routing setup (React Router)
- Global layout (sidebar + main content shell)
- Design system tokens implementation

#### Sprint 1 — Authentication (Week 1-2)
- Supabase Auth integration
- Login page + form
- Registration page + form
- Protected route guard component
- Session management (auto-refresh)
- Logout functionality

#### Sprint 2 — Core Entities (Week 2-3)
- Database schema creation in Supabase
- Row Level Security policies
- Product CRUD (Create, Read, Update, Delete)
- Customer CRUD
- Supplier CRUD

#### Sprint 3 — Transactions (Week 3-4)
- Purchase Management module
- Stock increase trigger (Purchase completion)
- Sales Management module
- Stock validation (Sales creation)
- Stock decrease trigger (Sale completion)

#### Sprint 4 — Dashboard & Reports (Week 4-5)
- Dashboard KPI cards
- Real-time aggregate queries
- All five module reports

#### Sprint 5 — Polish (Week 5-6)
- Invoice generation (print/PDF)
- Advanced search & filtering
- Error boundary implementation
- Loading skeletons
- Toast notifications
- Responsive layout testing

---

## 5. Future Scalability Plan

### Phase 1 — MVP (Current Scope)
Core CRUD modules, authentication, basic reports, inventory auto-management.

### Phase 2 — Enhanced Operations
- **Multi-warehouse Support** — Products tracked per warehouse location
- **Role-Based Access Control (RBAC)** — Admin, Manager, Salesperson, Viewer roles
- **Purchase Order Approval Workflow** — Manager approval before purchase is finalized
- **Customer Credit Limits** — Block sales if customer exceeds credit threshold

### Phase 3 — Analytics & Intelligence
- **Revenue Trend Charts** — Monthly/quarterly revenue visualization
- **Low Stock Alerts** — Automated notifications when stock falls below threshold
- **Best-Selling Products Report** — Ranked product performance
- **Customer Lifetime Value (CLV)** — Per-customer revenue analytics

### Phase 4 — Integration Layer
- **REST API Layer** — Expose ERP data to third-party systems
- **Webhook Support** — Trigger external events on sale/purchase completion
- **Email Notifications** — Invoice delivery, low stock alerts via email
- **Export to CSV/PDF** — Full data export capability for all reports

### Phase 5 — Enterprise Features
- **Audit Log** — Full change history for all critical records
- **Multi-currency Support** — Handle purchases/sales in different currencies
- **Tax Management** — VAT/GST calculation and reporting
- **Multi-company Support** — One platform, multiple business entities

### Scalability Architecture Decisions

| Decision                          | Rationale                                                   |
|-----------------------------------|-------------------------------------------------------------|
| Supabase PostgreSQL               | Scales vertically; supports connection pooling via PgBouncer|
| Feature-based folder structure    | Enables team parallelism; each feature is self-contained    |
| Supabase RLS                      | Security scales with users; no custom auth middleware needed |
| Vercel Edge Functions (future)    | Low-latency compute globally for API-heavy operations       |
| React Query for data fetching     | Automatic cache invalidation; reduces redundant DB reads    |
| TypeScript throughout             | Catches refactoring errors early as schema evolves          |
