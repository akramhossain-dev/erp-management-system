# ERP Management System — Project Plan

> **Version:** 1.0.0  
> **Phase:** 1 — Project Setup & Infrastructure (Complete)  
> **Status:** ✅ Phase 1 Complete | 🔲 Phase 2 Pending  
> **Last Updated:** 2026-07-07

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
