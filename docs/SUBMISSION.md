# Glass ERP — Assessment Submission Summary

This document serves as the final submission summary for the Glass ERP Management System built for the Code Bondhu IT AI Developer Assessment.

---

## 1. Project Overview
**Glass ERP** is a modern, high-fidelity Enterprise Resource Planning (ERP) dashboard application. It provides small to medium enterprises with inventory tracking, customer relationship management (CRM), supplier management, transactional purchase tracking, sales invoicing, and real-time accounting reports.

The interface adheres to the **Modern Glass ERP** design guidelines, incorporating glassmorphism layouts, subtle CSS animations, interactive cards, and responsive grids optimized for desktop and mobile devices.

---

## 2. Tech Stack

### Frontend
- **Framework**: React + Vite (HTML5, CSS3, Client-side JS)
- **Language**: TypeScript (Strict Mode compiler verification)
- **CSS Framework**: Tailwind CSS (Utility classes and custom tokens)
- **UI Components**: Shadcn UI (Radix UI primitives for dialogs, tables, and buttons)
- **Client State**: TanStack Query (Query cache management, invalidation triggers, and stale times)
- **Forms & Validation**: React Hook Form + Zod (Strict schema validation)
- **Icons**: Lucide React

### Backend
- **Platform**: Supabase
- **Database**: PostgreSQL (Relational constraints, custom triggers, and RLS tables)
- **Authentication**: Supabase Auth (Email/password JWT token session handles)

---

## 3. Implemented Modules
- **Authentication**: Register, login, logout, and protected route wrappers.
- **Dashboard**: KPI stat metrics (low-stock warning counts, client/supplier counters) and analytics charts.
- **Product Management**: CRUD database catalog, SKU uniqueness checking, margin previews, and category filters.
- **CRM (Customers)**: Customer profiles listing email, phone, and total purchases made.
- **Supplier Directory**: Supplier contact metrics and count of purchases supplied.
- **Purchase Orders (Phase 7)**: Dual-step PO generation automatically updating stock levels.
- **Sales & Invoicing (Phase 8)**: Client-side and DB-side stock constraints, sequential invoice number RPC, and printable A4 invoice previews.
- **Reports & Analytics (Phase 9)**: Aggregated tabs (inventory values, cost valuation, customer/supplier tallies) and UTF-8 BOM CSV exports.

---

## 4. AI Tools Used
- **Antigravity**: Used as the primary agentic pair programmer to write clean files, design database triggers, refactor state management, and audit TypeScript compilations.

---

## 5. Development Workflow Summary
- **Planning Mode**: Designed architectural outlines ([implementation_plan.md](file:///home/akram/.gemini/antigravity-ide/brain/b71c4a19-9253-4013-84eb-e64a33c5235e/implementation_plan.md)) before modifying source code.
- **Code Execution**: Pair programmed logic features and UI modules.
- **Auditing & QA**: Ran compiler verification checks (`npm run build`) to ensure type safety and resolve unused imports.
- **Documentation**: Generated guides for database architectures, UI standards, deployment workflows, testing scripts, and final submission packages.

---

## 6. Architecture Explanation

### Frontend Layout
Organized around a **Feature-based architecture**:
- `src/features/`: Encapsulates modular components, hooks, services, and validation schemas (e.g. `features/products`, `features/sales`). This keeps modules decoupled and scalable.
- `src/routes/AppRoutes.tsx`: Manages navigation layouts using React Router.
- `src/context/AuthContext.tsx`: Distributes user session states.

### Database Design & Inventory Workflow
PostgreSQL handles business logic to maintain data consistency:
- **Atomicity**: Sales and Purchases use transactional triggers. Stock increments/deductions are processed as Postgres triggers:
  - `increase_stock_on_purchase_item_insert()` on purchase items.
  - `decrease_stock_on_sale_item_insert()` on sale items.
- **RLS isolation**: Row Level Security is active on all tables. Queries filter results by user session IDs automatically.

---

## 7. Challenges Faced & Solutions

### Challenge 1: Double stock deduction on UPDATE vs INSERT triggers
- *Problem*: Trigger functions originally fired `AFTER UPDATE` of parent invoice status. Inserting items dynamically caused duplicate trigger executions.
- *Solution*: Wrote a clean `AFTER INSERT` trigger function in [009_sale_stock_trigger.sql](file:///media/akram/code/Project/erp-management-system/supabase/migrations/009_sale_stock_trigger.sql) that validates stock limits and deducts levels atomically *only* if the parent invoice status is already completed.

### Challenge 2: HTML5 Router Refresh 404s
- *Problem*: Refreshing routes like `/sales` on hosting platforms causes 404 errors as the server searches for a physical directory instead of routing via `index.html`.
- *Solution*: Created a [vercel.json](file:///media/akram/code/Project/erp-management-system/vercel.json) rewrite file directing all routes back to the main document root.

---

## 8. Development Time Summary
- **Project Start**: 2026-07-07
- **Project End**: 2026-07-07
- **Total Hours**: ~8 Hours
- **Total Days**: 1 Day

---

## 9. Deployment Links
- **Live ERP URL**: [https://glass-erp-management-system.vercel.app](https://glass-erp-management-system.vercel.app) *(Placeholder)*
- **GitHub Repository URL**: [https://github.com/akramhossain-dev/erp-management-system](https://github.com/akramhossain-dev/erp-management-system) *(Placeholder)*
