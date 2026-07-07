# ERP Management System — System Architecture

> **Version:** 1.0.0  
> **Phase:** 0 — Planning & Design  
> **Status:** Draft  
> **Last Updated:** 2026-07-07

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture (Supabase)](#3-backend-architecture-supabase)
4. [Frontend Folder Structure](#4-frontend-folder-structure)
5. [State Management Strategy](#5-state-management-strategy)
6. [Data Fetching Strategy](#6-data-fetching-strategy)
7. [Security Architecture](#7-security-architecture)
8. [Deployment Architecture](#8-deployment-architecture)

---

## 1. Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                  │
│                                                                        │
│   React + Vite + TypeScript + Tailwind CSS + Shadcn UI                 │
│                                                                        │
│   ┌──────────────┐  ┌───────────────┐  ┌─────────────────────────┐    │
│   │  UI Layer    │  │  Logic Layer  │  │   Data Layer            │    │
│   │  (Components)│  │  (Hooks/Stores│  │   (Services/Supabase)   │    │
│   └──────────────┘  └───────────────┘  └─────────────────────────┘    │
│                                                                        │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS / WebSocket
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                        SUPABASE PLATFORM                               │
│                                                                        │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────────┐    │
│  │ Supabase Auth│  │  PostgREST    │  │  Supabase Realtime       │    │
│  │ (JWT / RLS)  │  │  (REST API)   │  │  (WebSocket subscriptions│    │
│  └──────────────┘  └───────────────┘  └──────────────────────────┘    │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │               PostgreSQL Database                              │    │
│  │  (Tables, Views, Functions, Triggers, RLS Policies)           │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Architecture Decisions

| Decision                       | Alternative Considered       | Reason Chosen                                              |
|--------------------------------|------------------------------|------------------------------------------------------------|
| Supabase (BaaS)                | Custom Node.js backend       | Instant auth, DB, APIs, RLS — zero backend ops overhead    |
| React + Vite                   | Next.js                      | CSR sufficient for ERP; Vite gives faster DX than Next.js  |
| TanStack Query (React Query)   | Zustand + manual fetch       | Automatic caching, background refetch, mutation management |
| Feature-based folder structure | Layer-based (components/pages)| Scales with team; each feature is independently workable   |
| TypeScript                     | JavaScript                   | Type-safe DB schema mapping; catches errors at compile time|
| Shadcn UI                      | MUI / Ant Design             | Unstyled primitives; full Tailwind CSS control maintained  |

---

## 2. Frontend Architecture

### 2.1 Layer Breakdown

```
┌──────────────────────────────────────────────────┐
│                   UI LAYER                        │
│  Pages → Feature Components → Shared Components  │
│  (Presentation only, no business logic)          │
└─────────────────────────┬────────────────────────┘
                          │ calls
┌─────────────────────────▼────────────────────────┐
│                  LOGIC LAYER                      │
│  Custom Hooks (useProducts, useSales, etc.)       │
│  Form handling (React Hook Form + Zod)            │
│  Business validation (stock checks, etc.)         │
└─────────────────────────┬────────────────────────┘
                          │ calls
┌─────────────────────────▼────────────────────────┐
│                  DATA LAYER                       │
│  Service modules (productService, salesService)   │
│  Supabase JS Client (@supabase/supabase-js)       │
│  TanStack Query (caching + async state)           │
└──────────────────────────────────────────────────┘
```

### 2.2 Component Structure Strategy

**Atomic Design Adapted for ERP:**

| Level          | Description                                         | Examples                                     |
|----------------|-----------------------------------------------------|----------------------------------------------|
| **Primitives** | Raw HTML/Shadcn atoms — no business logic           | Button, Input, Badge, Avatar, Skeleton       |
| **Compounds**  | Combinations of primitives forming reusable UI units| DataTable, FormField, KpiCard, StatusBadge  |
| **Features**   | Module-specific components with domain logic        | ProductTable, SaleForm, CustomerSelector     |
| **Pages**      | Full route-level components that assemble features  | DashboardPage, ProductsPage, SalesPage       |
| **Layouts**    | Shell components that define page scaffolding       | AuthLayout, DashboardLayout, SidebarNav      |

### 2.3 Routing Strategy

```
/                     → redirect to /dashboard
/login                → LoginPage (public)
/register             → RegisterPage (public)

/dashboard            → DashboardPage (protected)
/products             → ProductsPage (protected)
/products/new         → ProductNewPage (protected)
/products/:id/edit    → ProductEditPage (protected)
/customers            → CustomersPage (protected)
/customers/new        → CustomerNewPage (protected)
/customers/:id/edit   → CustomerEditPage (protected)
/suppliers            → SuppliersPage (protected)
/suppliers/new        → SupplierNewPage (protected)
/suppliers/:id/edit   → SupplierEditPage (protected)
/purchases            → PurchasesPage (protected)
/purchases/new        → PurchaseNewPage (protected)
/purchases/:id        → PurchaseDetailPage (protected)
/sales                → SalesPage (protected)
/sales/new            → SaleNewPage (protected)
/sales/:id            → SaleDetailPage (protected)
/sales/:id/invoice    → InvoicePage (protected)
/reports              → ReportsPage (protected)
/reports/products     → ProductReportPage (protected)
/reports/customers    → CustomerReportPage (protected)
/reports/suppliers    → SupplierReportPage (protected)
/reports/purchases    → PurchaseReportPage (protected)
/reports/sales        → SalesReportPage (protected)

* = ProtectedRoute wrapper (checks session)
```

---

## 3. Backend Architecture (Supabase)

### 3.1 Authentication Flow

```
1. User lands on /login page
   │
2. Enters credentials → supabase.auth.signInWithPassword()
   │
3. Supabase Auth validates credentials
   │
   ├── Success → Returns JWT (access_token + refresh_token)
   │              → Stored in localStorage by Supabase JS client
   │              → onAuthStateChange event fires
   │              → React context updates user state
   │              → Router redirects to /dashboard
   │
   └── Failure → Returns error → Display toast notification
```

### 3.2 Session Management

```
Session Lifecycle:
- Access Token: expires in 1 hour (Supabase default)
- Refresh Token: used automatically by Supabase JS to obtain new access token
- Supabase JS client handles token refresh transparently
- No manual token management required on frontend

Route Protection:
- ProtectedRoute component calls supabase.auth.getSession()
- If no session → redirect to /login
- If session exists → render child component
- On session expiry → Supabase JS auto-refreshes or redirects to /login

Auth State Listener:
- supabase.auth.onAuthStateChange() registered in React context
- Handles: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED events
- Updates global auth state for all components
```

### 3.3 Database Communication

```
Communication Path:
Frontend → @supabase/supabase-js → PostgREST (REST API) → PostgreSQL

Query Method Options:
┌─────────────────────────────────────────────────────────────┐
│  Option 1: Supabase Query Builder (primary method)          │
│  supabase.from('products').select('*').eq('user_id', uid)   │
│  ✓ Type-safe with generated types                           │
│  ✓ RLS automatically applied                                │
│  ✓ Simple CRUD operations                                   │
├─────────────────────────────────────────────────────────────┤
│  Option 2: Supabase RPC (database functions)                │
│  supabase.rpc('get_dashboard_stats')                        │
│  ✓ Complex aggregations run server-side                     │
│  ✓ Single round-trip for multi-table queries                │
│  ✓ Better performance for report queries                    │
├─────────────────────────────────────────────────────────────┤
│  Option 3: Supabase Views                                   │
│  supabase.from('dashboard_summary').select('*')             │
│  ✓ Computed fields pre-joined at DB level                   │
│  ✓ Used for read-heavy report pages                         │
└─────────────────────────────────────────────────────────────┘
```

### 3.4 Row Level Security Strategy

**Core Principle:** All data isolation happens at the database level via RLS. The frontend never implements ownership checks — the database enforces them.

```
RLS enabled on: ALL public schema tables

Policy template for user-owned tables (products, customers, suppliers):

  SELECT: auth.uid() = user_id
  INSERT: auth.uid() = user_id
  UPDATE: auth.uid() = user_id
  DELETE: auth.uid() = user_id

Policy for child tables (purchase_items, sale_items):
  These tables don't have a user_id. Instead:
  SELECT: EXISTS (
    SELECT 1 FROM purchases
    WHERE purchases.id = purchase_items.purchase_id
    AND purchases.user_id = auth.uid()
  )
  (Same EXISTS pattern for INSERT, UPDATE, DELETE)

Special Policies:
- SECURITY DEFINER functions bypass RLS (used for stock update triggers)
- Service role key bypasses RLS (used only in secure server-side context, not frontend)
```

### 3.5 Database Functions & Triggers

**Trigger: Auto-increase stock on purchase completion**
```
Trigger name: on_purchase_completed
Fires: AFTER UPDATE on purchases WHERE new.status = 'completed'
Action: For each purchase_item in this purchase,
        UPDATE products SET stock_qty = stock_qty + quantity
```

**Trigger: Auto-decrease stock on sale completion**
```
Trigger name: on_sale_completed
Fires: AFTER UPDATE on sales WHERE new.status = 'completed'
Action: For each sale_item in this sale,
        UPDATE products SET stock_qty = stock_qty - quantity
        (With CHECK: stock_qty must remain >= 0)
```

**Function: get_dashboard_stats()**
```
Returns:
{
  total_products: INTEGER,
  total_customers: INTEGER,
  total_suppliers: INTEGER,
  total_purchases: INTEGER,
  total_sales: INTEGER,
  total_revenue: NUMERIC
}
Single RPC call replaces 6 separate count queries.
Filtered by auth.uid() at function scope.
```

---

## 4. Frontend Folder Structure

```
erp-management-system/
├── public/                         # Static files served as-is
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── assets/                     # Static media: images, fonts, SVGs
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/                 # Shared, reusable UI primitives & compounds
│   │   ├── ui/                     # Shadcn UI base components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── common/                 # Custom shared components (non-feature-specific)
│   │   │   ├── DataTable/
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── DataTableColumns.tsx
│   │   │   │   ├── DataTablePagination.tsx
│   │   │   │   └── index.ts
│   │   │   ├── KpiCard/
│   │   │   ├── PageHeader/
│   │   │   ├── StatusBadge/
│   │   │   ├── ConfirmDialog/
│   │   │   ├── EmptyState/
│   │   │   └── LoadingSkeleton/
│   │   └── forms/                  # Shared form field components
│   │       ├── FormField.tsx
│   │       ├── SearchInput.tsx
│   │       └── SelectField.tsx
│   │
│   ├── features/                   # Feature modules (domain-organized)
│   │   ├── auth/
│   │   │   ├── components/         # Auth-specific UI components
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── hooks/              # Feature-specific custom hooks
│   │   │   │   └── useAuth.ts
│   │   │   ├── services/           # Auth API calls
│   │   │   │   └── authService.ts
│   │   │   ├── schemas/            # Zod validation schemas
│   │   │   │   └── authSchemas.ts
│   │   │   └── index.ts            # Public API of this feature
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   └── DashboardStats.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDashboardStats.ts
│   │   │   └── services/
│   │   │       └── dashboardService.ts
│   │   │
│   │   ├── products/
│   │   │   ├── components/
│   │   │   │   ├── ProductTable.tsx
│   │   │   │   ├── ProductForm.tsx
│   │   │   │   └── ProductFilters.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProducts.ts
│   │   │   │   └── useProductMutations.ts
│   │   │   ├── services/
│   │   │   │   └── productService.ts
│   │   │   ├── schemas/
│   │   │   │   └── productSchemas.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── customers/              # (same structure as products/)
│   │   ├── suppliers/              # (same structure as products/)
│   │   │
│   │   ├── purchases/
│   │   │   ├── components/
│   │   │   │   ├── PurchaseTable.tsx
│   │   │   │   ├── PurchaseForm.tsx
│   │   │   │   ├── PurchaseItemRow.tsx
│   │   │   │   └── PurchaseDetail.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── usePurchases.ts
│   │   │   │   └── usePurchaseMutations.ts
│   │   │   ├── services/
│   │   │   │   └── purchaseService.ts
│   │   │   ├── schemas/
│   │   │   │   └── purchaseSchemas.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── sales/                  # (same structure as purchases/)
│   │   │
│   │   └── reports/
│   │       ├── components/
│   │       │   ├── ReportFilters.tsx
│   │       │   └── ReportTable.tsx
│   │       ├── hooks/
│   │       │   └── useReport.ts
│   │       └── services/
│   │           └── reportService.ts
│   │
│   ├── hooks/                      # Global shared custom hooks (not feature-specific)
│   │   ├── useDebounce.ts          # Debounce search inputs
│   │   ├── useLocalStorage.ts      # Persistent UI state
│   │   ├── usePagination.ts        # Shared pagination logic
│   │   └── useToast.ts             # Global toast notifications
│   │
│   ├── lib/                        # Third-party library configuration & wrappers
│   │   ├── supabase.ts             # Supabase client initialization
│   │   ├── queryClient.ts          # TanStack Query client configuration
│   │   └── utils.ts                # cn() utility (clsx + tailwind-merge)
│   │
│   ├── pages/                      # Route-level page components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── products/
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── ProductNewPage.tsx
│   │   │   └── ProductEditPage.tsx
│   │   ├── customers/
│   │   ├── suppliers/
│   │   ├── purchases/
│   │   ├── sales/
│   │   └── reports/
│   │
│   ├── routes/                     # Routing configuration
│   │   ├── index.tsx               # Root router definition
│   │   ├── ProtectedRoute.tsx      # Auth guard wrapper
│   │   └── AppRoutes.tsx           # All route definitions
│   │
│   ├── services/                   # Global/cross-feature services
│   │   └── supabaseService.ts      # Base Supabase query helpers
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── database.types.ts       # Auto-generated from Supabase schema
│   │   ├── entities.ts             # Domain entity interfaces
│   │   ├── api.ts                  # API request/response types
│   │   └── common.ts               # Shared utility types
│   │
│   ├── utils/                      # Pure utility functions
│   │   ├── formatters.ts           # Currency, date, number formatters
│   │   ├── validators.ts           # Shared validation helpers
│   │   └── constants.ts            # App-wide constants (status enums, etc.)
│   │
│   ├── context/                    # React Contexts for global state
│   │   └── AuthContext.tsx         # Auth state (user, session, loading)
│   │
│   ├── App.tsx                     # Root application component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles + CSS custom properties
│
├── docs/                           # Project documentation (Phase 0 output)
│   ├── PROJECT_PLAN.md
│   ├── DATABASE.md
│   ├── UI_GUIDE.md
│   ├── AI_WORKFLOW.md
│   └── PROMPTS.md
│
├── .env.local                      # Environment variables (gitignored)
├── .env.example                    # Environment variable template
├── .gitignore
├── components.json                 # Shadcn UI configuration
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts
```

### Folder Purpose Explanations

| Folder              | Purpose                                                                        |
|---------------------|--------------------------------------------------------------------------------|
| `public/`           | Files served directly by the web server. Favicon, robots.txt, static assets.  |
| `src/assets/`       | Imported assets (images, SVGs) bundled by Vite. Not served directly.           |
| `src/components/ui/`| Shadcn UI generated components. Never edit manually — regenerate via CLI.       |
| `src/components/common/`| Reusable compound components built on top of Shadcn primitives.            |
| `src/components/forms/`| Shared form field wrappers that integrate with React Hook Form.             |
| `src/features/`     | The core of the app. Each subdirectory owns a business domain completely.      |
| `src/features/*/components/`| Feature-specific UI components not reusable outside their domain.   |
| `src/features/*/hooks/`| React Query hooks that manage server state for that feature.               |
| `src/features/*/services/`| Raw Supabase query functions — no React, no state, pure async calls.   |
| `src/features/*/schemas/`| Zod validation schemas for forms and API response validation.           |
| `src/hooks/`        | Generic hooks with no business domain — reusable across all features.          |
| `src/lib/`          | Third-party client initialization. Supabase client, Query client, utilities.   |
| `src/pages/`        | Route-level components. Thin wrappers that compose feature components.         |
| `src/routes/`       | React Router configuration, ProtectedRoute guard, all route definitions.       |
| `src/services/`     | Cross-feature Supabase helpers shared by multiple feature service modules.     |
| `src/types/`        | TypeScript definitions. `database.types.ts` generated by Supabase CLI.         |
| `src/utils/`        | Pure utility functions with no side effects (formatters, validators).          |
| `src/context/`      | React Contexts. Only for truly global state (auth, theme, notifications).      |

---

## 5. State Management Strategy

### State Categories & Solutions

| State Category        | Tool                      | Examples                                    |
|-----------------------|---------------------------|---------------------------------------------|
| Server / Remote State | TanStack Query (React Query)| Products list, sales history, KPI data    |
| Form State            | React Hook Form + Zod     | All create/edit forms                       |
| Auth State            | React Context + Supabase  | Current user, session, isAuthenticated      |
| UI / Local State      | useState / useReducer     | Modal open/close, active tab, sidebar state |
| URL / Filter State    | URL search params         | Table filters, pagination, sort             |

### Why TanStack Query?

```
Benefits:
✓ Automatic background refetching (data stays fresh)
✓ Deduplication (same query called 3 places = 1 network request)
✓ Optimistic updates (UI updates before server confirms)
✓ Cache invalidation (after mutation, related queries auto-refetch)
✓ Loading/error states built-in
✓ No global store needed for server data

Example flow:
useProducts hook → useSuspenseQuery(['products']) → productService.getAll()
→ TanStack caches result for 5 minutes
→ ProductTable reads from cache (no reload on component mount)
→ After createProduct mutation → invalidateQueries(['products'])
→ ProductTable auto-refetches fresh data
```

### No Redux / Zustand

For this ERP scope, global client state is minimal:
- Auth state → React Context (simple, built-in)
- Server state → TanStack Query (replaces Zustand for async data)
- UI state → useState (local, co-located)

If Phase 2 introduces complex shared UI state (e.g., multi-step wizard spanning routes), Zustand can be introduced at that point.

---

## 6. Data Fetching Strategy

### Query Key Convention

```typescript
// Standardized query key factory per feature
const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
}
```

### Stale Time Configuration

| Query Type              | Stale Time | Rationale                                      |
|-------------------------|------------|------------------------------------------------|
| Dashboard KPI stats     | 30 seconds | Frequently updated; keep relatively fresh      |
| Products list           | 5 minutes  | Changes only on CRUD; user-controlled          |
| Customers list          | 10 minutes | Low-frequency updates                          |
| Suppliers list          | 10 minutes | Low-frequency updates                          |
| Purchase history        | 2 minutes  | May be updated by others (future multi-user)   |
| Sales history           | 2 minutes  | May be updated by others (future multi-user)   |
| Report data             | 1 minute   | Analytical; slightly stale acceptable          |

### Mutation Strategy

```
1. User submits form
2. useMutation.mutateAsync() called
3. Optimistic UI update (optional, for instant feedback)
4. API call to Supabase via service function
5. On success:
   - Toast notification (success)
   - Invalidate related query keys (refetch lists)
   - Navigate away (if create/edit form)
6. On error:
   - Toast notification (error message)
   - Revert optimistic update
   - Form remains open with errors displayed
```

---

## 7. Security Architecture

### Security Layers

```
Layer 1: Supabase Authentication
  → Only authenticated users can reach the API
  → JWT tokens signed and verified by Supabase

Layer 2: Row Level Security (PostgreSQL)
  → All queries filtered by auth.uid()
  → Impossible to read/write other users' data even with valid token

Layer 3: Frontend Route Guards
  → ProtectedRoute checks session before rendering
  → Defense-in-depth: UX protection (not security guarantee)

Layer 4: Input Validation (Zod)
  → All form inputs validated before API calls
  → Prevents malformed data from reaching database

Layer 5: Business Logic Guards
  → Stock validation before sale creation (app layer)
  → Referential integrity enforced by FK constraints (DB layer)
```

### Environment Variables

```
Required in .env.local:
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=[public anon key]

Security notes:
- ANON_KEY is safe to expose in frontend (it's designed to be public)
- RLS + Auth enforces all security — not the key secrecy
- SERVICE_ROLE_KEY must NEVER be in frontend code or committed to repo
- .env.local must be in .gitignore
```

---

## 8. Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│                 DEVELOPMENT                      │
│                                                 │
│  Local: npm run dev → Vite dev server :5173     │
│  Supabase: cloud project (free tier)            │
│  Env: .env.local (gitignored)                   │
└─────────────────────────────────────────────────┘
                        │
                        │ git push → main branch
                        ▼
┌─────────────────────────────────────────────────┐
│                  PRODUCTION                      │
│                                                 │
│  Frontend: Vercel (auto-deploy from GitHub)     │
│  - Build command: npm run build                 │
│  - Output: dist/                                │
│  - Environment vars set in Vercel dashboard     │
│                                                 │
│  Backend: Supabase (cloud managed)              │
│  - Database migrations: Supabase CLI            │
│  - No server management required                │
│                                                 │
│  Domain: [project].vercel.app (or custom)       │
└─────────────────────────────────────────────────┘
```

### CI/CD Flow

```
Developer pushes to main branch
        │
        ▼
GitHub Actions (or Vercel bot) triggers
        │
        ├── Run TypeScript type check (tsc --noEmit)
        ├── Run ESLint
        ├── Run unit tests (Vitest)
        └── Build production bundle (vite build)
              │
              ├── Success → Deploy to Vercel production
              └── Failure → Block deployment, notify developer
```
