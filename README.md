# 🏢 Glass ERP — Enterprise Resource Planning System

> **Code Bondhu IT — AI Developer Assessment Submission**

A modern, production-ready **Enterprise Resource Planning (ERP)** system built with React 19, TypeScript, and Supabase. Features a premium glassmorphism dark UI with complete business workflows for products, customers, suppliers, purchases, sales, and analytics.

---

## ✨ Features

### Core ERP Modules
| Module | Features |
|---|---|
| 🔐 **Authentication** | Register, login, logout, protected routes, JWT session persistence |
| 📊 **Dashboard** | KPI cards, revenue area chart, sales bar chart, recent activity feed, low stock alerts, quick actions |
| 📦 **Products** | Full CRUD, SKU uniqueness, category filter, stock tracking, cost/sale price, margin calculation |
| 👥 **Customers** | Full CRUD, contact management, purchase history count |
| 🏭 **Suppliers** | Full CRUD, contact management, supply history count |
| 🛒 **Purchases** | Create purchase orders, multi-line items, automatic stock increment via DB trigger |
| 🧾 **Sales** | Create sales invoices, real-time stock check, insufficient stock guard, automatic stock deduction, printable invoice |
| 📈 **Reports** | 5-tab analytics: Sales, Purchases, Products, Customers, Suppliers — with filters, KPI summary cards, data tables, CSV export |

### UI / UX
- ⚫ **Professional dark theme** — `#0B0F19` base, glass morphism cards
- 📱 **Fully responsive** — mobile drawer, tablet, and desktop layouts
- ✨ **Micro-animations** — slide-in, stagger, hover glow effects
- 🔔 **Toast notifications** — success/error feedback on all mutations
- 💀 **Loading skeletons** — every data section has skeleton states
- 🌑 **Empty states** — all tables and lists have illustrated empty states

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 8 |
| **Language** | TypeScript 6 (strict) |
| **Styling** | Tailwind CSS v4 + Custom CSS variables |
| **UI Primitives** | Radix UI (Dialog, Select, Label, DropdownMenu) |
| **Forms** | React Hook Form + Zod validation |
| **Data Fetching** | TanStack React Query v5 |
| **Charts** | Recharts v3 |
| **Backend** | Supabase (PostgreSQL + Auth + RLS) |
| **Router** | React Router v7 |
| **Notifications** | Sonner |
| **Linter** | Oxlint |

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/akramhossain-dev/erp-management-system.git
cd erp-management-system
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Database Setup

Run the master migration in your **Supabase SQL Editor**:

```
supabase/migrations/000_master_migration.sql
```

This creates all tables, RLS policies, functions, and triggers in one step.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Production Build

```bash
npm run build
npm run preview
```

---

## 🗂 Project Structure

```
erp-management-system/
├── src/
│   ├── App.tsx                    # Root app with providers
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Global theme & CSS tokens
│   │
│   ├── features/                  # Feature-based modules
│   │   ├── auth/                  # Login/register forms, schemas
│   │   ├── dashboard/             # KPI, charts, activity components
│   │   ├── products/              # Product CRUD, table, form
│   │   ├── customers/             # Customer CRUD
│   │   ├── suppliers/             # Supplier CRUD
│   │   ├── purchases/             # Purchase orders with line items
│   │   ├── sales/                 # Sales invoices, invoice preview
│   │   └── reports/               # 5-tab analytics views
│   │
│   ├── components/common/         # Shared: Sidebar, Navbar, KpiCard, PageContainer
│   ├── components/ui/             # Radix-based: Button, Input, Dialog, Select
│   ├── pages/                     # Route-level page components
│   ├── routes/                    # AppRoutes + ProtectedRoute
│   ├── context/                   # AuthContext (Supabase session)
│   ├── services/                  # supabaseClient setup
│   ├── hooks/                     # useMediaQuery, shared hooks
│   ├── layouts/                   # AppLayout (sidebar + navbar)
│   ├── types/                     # Global TypeScript types
│   └── utils/                     # constants, formatters, helpers
│
├── supabase/
│   └── migrations/
│       ├── 000_master_migration.sql  # ← Run this in Supabase
│       ├── 001_create_users_table.sql
│       ├── 002_create_products_table.sql
│       ├── 003_create_customers_table.sql
│       ├── 004_create_suppliers_table.sql
│       ├── 005_create_purchases_tables.sql
│       ├── 006_create_sales_tables.sql
│       ├── 007_create_functions.sql
│       ├── 008_purchase_stock_trigger.sql
│       └── 009_sale_stock_trigger.sql
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── PROJECT_PLAN.md
│   ├── SUBMISSION.md
│   ├── TESTING.md
│   └── UI_GUIDE.md
│
├── .env.example
├── package.json
├── vite.config.ts
└── tsconfig.app.json
```

---

## 📚 Documentation

| Document | Description |
|---|---|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Frontend architecture, folder structure, routing, state management |
| [DATABASE.md](docs/DATABASE.md) | All tables, relationships, triggers, RLS policies |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Local setup, Supabase config, Vercel deployment |
| [TESTING.md](docs/TESTING.md) | E2E test scenarios, bug fixes, limitations |
| [UI_GUIDE.md](docs/UI_GUIDE.md) | Theme system, CSS tokens, design patterns |
| [PROJECT_PLAN.md](docs/PROJECT_PLAN.md) | Build phases, implementation timeline |
| [AI_WORKFLOW.md](docs/AI_WORKFLOW.md) | How AI tools were used throughout development |

---

## 🌐 Live Demo

- **Live URL**: [https://glass-erp-management-system.vercel.app](https://glass-erp-management-system.vercel.app) *(placeholder)*
- **GitHub**: [https://github.com/akramhossain-dev/erp-management-system](https://github.com/akramhossain-dev/erp-management-system) *(placeholder)*

---

## 📄 License

This project is submitted as an assessment for **Code Bondhu IT**. All rights reserved.

---

<p align="center">Built with ❤️ using React, TypeScript, and Supabase</p>
