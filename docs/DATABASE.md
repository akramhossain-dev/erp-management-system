# ERP Management System — Database Architecture

> **Version:** 1.0.0  
> **Phase:** 2 — Database Architecture & Supabase PostgreSQL (Complete)  
> **Database:** PostgreSQL (via Supabase)  
> **Status:** ✅ Phase 2 Complete  
> **Last Updated:** 2026-07-07

---

## Phase 2 — Completion Status ✅

> **Completed:** 2026-07-07

### Migration Files Created

| File | Purpose |
|------|---------|
| `supabase/migrations/000_master_migration.sql` | **Run this** — complete schema in one file |
| `supabase/migrations/001_create_users_table.sql` | users table + handle_new_user trigger |
| `supabase/migrations/002_create_products_table.sql` | products table + indexes + RLS |
| `supabase/migrations/003_create_customers_table.sql` | customers table + indexes + RLS |
| `supabase/migrations/004_create_suppliers_table.sql` | suppliers table + indexes + RLS |
| `supabase/migrations/005_create_purchases_tables.sql` | purchases + purchase_items + stock increase trigger |
| `supabase/migrations/006_create_sales_tables.sql` | sales + sale_items + stock decrease trigger |
| `supabase/migrations/007_create_functions.sql` | Dashboard RPC functions |

### How to Apply the Schema

```
1. Go to https://app.supabase.com
2. Select your project
3. Navigate to: SQL Editor → New query
4. Open: supabase/migrations/000_master_migration.sql
5. Paste the full content → Click "Run"
6. Verify: Table Editor should show 8 tables
```

### Verification Checklist

- ✅ 8 tables created (users, products, customers, suppliers, purchases, purchase_items, sales, sale_items)
- ✅ All primary keys (UUID, gen_random_uuid())
- ✅ All foreign keys with correct cascade rules
- ✅ CHECK constraints (non-negative prices/quantities, status enums, email format)
- ✅ RLS enabled on all 8 tables
- ✅ RLS policies: SELECT/INSERT/UPDATE/DELETE per table
- ✅ Child table RLS via parent JOIN (purchase_items, sale_items)
- ✅ 19 performance indexes
- ✅ Stock increase trigger (on_purchase_completed)
- ✅ Stock decrease trigger with validation (on_sale_completed)
- ✅ Auto user profile trigger (on_auth_user_created)
- ✅ Auto updated_at triggers on all mutable tables
- ✅ RPC functions: get_dashboard_stats, generate_invoice_number, get_low_stock_products
- ✅ TypeScript types updated (src/types/database.types.ts)
- ✅ Supabase client typed with Database generic (src/lib/supabase.ts)

---

## Table of Contents

1. [Database Design Principles](#1-database-design-principles)
2. [Entity Relationship Overview](#2-entity-relationship-overview)
3. [Table Definitions](#3-table-definitions)
4. [Relationship Map](#4-relationship-map)
5. [Inventory Workflow](#5-inventory-workflow)
6. [Row Level Security Strategy](#6-row-level-security-strategy)
7. [Indexing Strategy](#7-indexing-strategy)
8. [Database Functions](#8-database-functions)

---

## 1. Database Design Principles

| Principle              | Decision                                                              |
|------------------------|-----------------------------------------------------------------------|
| Primary Keys           | UUID (gen_random_uuid()) — globally unique, safe for distributed use  |
| Timestamps             | All tables carry `created_at` and `updated_at` columns (auto-managed)|
| Naming Convention      | snake_case for tables and columns                                     |
| Referential Integrity  | Foreign keys enforced at database level                               |
| Data Types             | NUMERIC(12,2) for monetary values — avoids FLOAT precision loss       |
| Auth Integration       | `user_id` fields reference `auth.users.id` (Supabase Auth schema)    |
| Stock Safety           | CHECK constraint: `stock_quantity >= 0` + trigger validation          |
| Historical Accuracy    | `unit_price` denormalized in `*_items` tables (price-at-sale-time)   |

---

## 2. Entity Relationship Overview

```
auth.users (Supabase managed)
    │
    │ (1:1 trigger-created profile)
    ▼
public.users ────────────────────────────────────┐
    │                                             │
    │ user_id FK (all tables)                     │
    │                                             │
    ├──► products                                 │
    │        │ (product_id FK)                    │
    │        ├──── purchase_items                 │
    │        └──── sale_items                     │
    │                                             │
    ├──► suppliers                                │
    │        │ (supplier_id FK)                   │
    │        └──── purchases                      │
    │                  │ (purchase_id FK)          │
    │                  └──── purchase_items        │
    │                                             │
    ├──► customers                                │
    │        │ (customer_id FK)                   │
    │        └──── sales                          │
    │                  │ (sale_id FK)              │
    │                  └──── sale_items            │
```

---

## 3. Table Definitions

### 3.1 `users` (profile extension)

**Purpose:** Extends Supabase `auth.users` with ERP-specific profile data. Auto-created by trigger on signup.

| Column     | Type        | Constraints              | Description                  |
|------------|-------------|--------------------------|------------------------------|
| id         | UUID        | PK, FK → auth.users.id   | Mirrors auth user ID         |
| full_name  | TEXT        | NOT NULL, DEFAULT ''     | Display name                 |
| email      | TEXT        | NOT NULL                 | Synced from auth.users       |
| avatar_url | TEXT        | NULLABLE                 | Optional profile picture URL |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now()  | Record creation timestamp    |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now()  | Auto-updated by trigger      |

---

### 3.2 `products`

**Purpose:** Central inventory catalog. Every purchasable/sellable item lives here. Stock is managed by DB triggers.

| Column         | Type          | Constraints                    | Description                        |
|----------------|---------------|--------------------------------|------------------------------------|
| id             | UUID          | PK, DEFAULT gen_random_uuid()  | Unique product identifier          |
| user_id        | UUID          | NOT NULL, FK → auth.users      | Record owner                       |
| name           | TEXT          | NOT NULL                       | Product display name               |
| sku            | TEXT          | NOT NULL                       | Stock Keeping Unit                 |
| description    | TEXT          | NULLABLE                       | Detailed description               |
| category       | TEXT          | NULLABLE                       | Category label                     |
| purchase_price | NUMERIC(12,2) | NOT NULL, DEFAULT 0, >= 0      | Cost price (from supplier)         |
| selling_price  | NUMERIC(12,2) | NOT NULL, DEFAULT 0, >= 0      | Retail price (to customer)         |
| stock_quantity | INTEGER       | NOT NULL, DEFAULT 0, >= 0      | Current stock level                |
| min_stock      | INTEGER       | NOT NULL, DEFAULT 0, >= 0      | Low-stock alert threshold          |
| created_at     | TIMESTAMPTZ   | NOT NULL, DEFAULT now()        | Record creation timestamp          |
| updated_at     | TIMESTAMPTZ   | NOT NULL, DEFAULT now()        | Auto-updated by trigger            |

**Constraints:** `UNIQUE(user_id, sku)` — SKU unique per user.

---

### 3.3 `customers`

**Purpose:** Customer directory. Linked to sales for history and reporting.

| Column    | Type        | Constraints                   | Description              |
|-----------|-------------|-------------------------------|--------------------------|
| id        | UUID        | PK, DEFAULT gen_random_uuid() | Unique customer ID       |
| user_id   | UUID        | NOT NULL, FK → auth.users     | Record owner             |
| name      | TEXT        | NOT NULL                      | Full name or company     |
| email     | TEXT        | NULLABLE, CHECK format        | Contact email            |
| phone     | TEXT        | NULLABLE                      | Contact phone            |
| address   | TEXT        | NULLABLE                      | Physical address         |
| notes     | TEXT        | NULLABLE                      | Internal notes           |
| created_at| TIMESTAMPTZ | NOT NULL, DEFAULT now()       | Creation timestamp       |
| updated_at| TIMESTAMPTZ | NOT NULL, DEFAULT now()       | Auto-updated by trigger  |

**Constraints:** Email CHECK validates format when non-NULL.

---

### 3.4 `suppliers`

**Purpose:** Supplier directory. Linked to purchases for history and reporting.

| Column    | Type        | Constraints                   | Description              |
|-----------|-------------|-------------------------------|--------------------------|
| id        | UUID        | PK, DEFAULT gen_random_uuid() | Unique supplier ID       |
| user_id   | UUID        | NOT NULL, FK → auth.users     | Record owner             |
| name      | TEXT        | NOT NULL                      | Company name             |
| email     | TEXT        | NULLABLE, CHECK format        | Contact email            |
| phone     | TEXT        | NULLABLE                      | Contact phone            |
| address   | TEXT        | NULLABLE                      | Physical address         |
| notes     | TEXT        | NULLABLE                      | Internal notes           |
| created_at| TIMESTAMPTZ | NOT NULL, DEFAULT now()       | Creation timestamp       |
| updated_at| TIMESTAMPTZ | NOT NULL, DEFAULT now()       | Auto-updated by trigger  |

---

### 3.5 `purchases`

**Purpose:** Purchase order header. One record per transaction with a supplier.

| Column        | Type          | Constraints                            | Description                  |
|---------------|---------------|----------------------------------------|------------------------------|
| id            | UUID          | PK, DEFAULT gen_random_uuid()          | Unique purchase ID           |
| user_id       | UUID          | NOT NULL, FK → auth.users              | Record owner                 |
| supplier_id   | UUID          | NOT NULL, FK → suppliers (RESTRICT)    | Linked supplier              |
| status        | TEXT          | NOT NULL, DEFAULT 'pending'            | pending/completed/cancelled  |
| total_amount  | NUMERIC(12,2) | NOT NULL, DEFAULT 0, >= 0             | Sum of line items            |
| purchase_date | DATE          | NOT NULL, DEFAULT CURRENT_DATE         | Date of transaction          |
| notes         | TEXT          | NULLABLE                               | Reference/notes              |
| created_at    | TIMESTAMPTZ   | NOT NULL, DEFAULT now()                | Creation timestamp           |
| updated_at    | TIMESTAMPTZ   | NOT NULL, DEFAULT now()                | Auto-updated by trigger      |

**Status Flow:** `pending` → `completed` (fires stock increase trigger) or `cancelled`

---

### 3.6 `purchase_items`

**Purpose:** Line items within a purchase order. Each row = one product type purchased.

| Column      | Type          | Constraints                         | Description                     |
|-------------|---------------|-------------------------------------|---------------------------------|
| id          | UUID          | PK, DEFAULT gen_random_uuid()       | Unique line item ID             |
| purchase_id | UUID          | NOT NULL, FK → purchases (CASCADE)  | Parent purchase                 |
| product_id  | UUID          | NOT NULL, FK → products (RESTRICT)  | Product being purchased         |
| quantity    | INTEGER       | NOT NULL, CHECK > 0                 | Units purchased                 |
| unit_price  | NUMERIC(12,2) | NOT NULL, CHECK >= 0               | Price at purchase time          |
| total_price | NUMERIC(12,2) | NOT NULL, CHECK >= 0               | quantity × unit_price           |
| created_at  | TIMESTAMPTZ   | NOT NULL, DEFAULT now()             | Creation timestamp              |

**Note:** `unit_price` is a historical snapshot — reflects price agreed at purchase time.

---

### 3.7 `sales`

**Purpose:** Sales order header. One record per transaction with a customer.

| Column         | Type          | Constraints                            | Description                  |
|----------------|---------------|----------------------------------------|------------------------------|
| id             | UUID          | PK, DEFAULT gen_random_uuid()          | Unique sale ID               |
| user_id        | UUID          | NOT NULL, FK → auth.users              | Record owner                 |
| customer_id    | UUID          | NOT NULL, FK → customers (RESTRICT)    | Linked customer              |
| invoice_number | TEXT          | NOT NULL, UNIQUE(user_id, invoice)     | Human-readable invoice ID    |
| status         | TEXT          | NOT NULL, DEFAULT 'pending'            | pending/completed/cancelled  |
| total_amount   | NUMERIC(12,2) | NOT NULL, DEFAULT 0, >= 0             | Sum of line items            |
| sale_date      | DATE          | NOT NULL, DEFAULT CURRENT_DATE         | Date of transaction          |
| notes          | TEXT          | NULLABLE                               | Reference/notes              |
| created_at     | TIMESTAMPTZ   | NOT NULL, DEFAULT now()                | Creation timestamp           |
| updated_at     | TIMESTAMPTZ   | NOT NULL, DEFAULT now()                | Auto-updated by trigger      |

**Status Flow:** `pending` → `completed` (fires stock decrease trigger) or `cancelled`

---

### 3.8 `sale_items`

**Purpose:** Line items within a sale order. Each row = one product type sold.

| Column      | Type          | Constraints                       | Description                   |
|-------------|---------------|-----------------------------------|-------------------------------|
| id          | UUID          | PK, DEFAULT gen_random_uuid()     | Unique line item ID           |
| sale_id     | UUID          | NOT NULL, FK → sales (CASCADE)    | Parent sale                   |
| product_id  | UUID          | NOT NULL, FK → products (RESTRICT)| Product being sold            |
| quantity    | INTEGER       | NOT NULL, CHECK > 0               | Units sold                    |
| unit_price  | NUMERIC(12,2) | NOT NULL, CHECK >= 0             | Price at sale time            |
| total_price | NUMERIC(12,2) | NOT NULL, CHECK >= 0             | quantity × unit_price         |
| created_at  | TIMESTAMPTZ   | NOT NULL, DEFAULT now()           | Creation timestamp            |

**Note:** `unit_price` is a historical snapshot — preserves the price at time of sale.

---

## 4. Relationship Map

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  auth.users │────1:1──│  users       │          │  suppliers  │
└─────────────┘         └──────┬───────┘          └──────┬──────┘
                               │ user_id FK              │
                               │ (all tables)            │ 1:N
                        ┌──────▼──────┐          ┌───────▼──────┐
                        │  products   │          │   purchases   │
                        └──────┬──────┘          └───────┬───────┘
                               │                         │ 1:N
                               │ N:1              ┌──────▼─────────┐
                               └──────────────────► purchase_items  │
                                                  └────────────────┘

┌─────────────────┐
│   customers     │
└────────┬────────┘
         │ 1:N
  ┌──────▼──────┐
  │    sales    │
  └──────┬──────┘
         │ 1:N
  ┌──────▼───────────┐
  │   sale_items     │◄─── products (N:1)
  └──────────────────┘
```

### Cascade Rules

| FK Relationship | ON DELETE |
|-----------------|-----------|
| users.id → auth.users.id | CASCADE (profile deleted with auth user) |
| products.user_id → auth.users.id | CASCADE |
| customers.user_id → auth.users.id | CASCADE |
| suppliers.user_id → auth.users.id | CASCADE |
| purchases.user_id → auth.users.id | CASCADE |
| purchases.supplier_id → suppliers.id | **RESTRICT** (protect history) |
| purchase_items.purchase_id → purchases.id | CASCADE (items deleted with order) |
| purchase_items.product_id → products.id | **RESTRICT** (protect history) |
| sales.user_id → auth.users.id | CASCADE |
| sales.customer_id → customers.id | **RESTRICT** (protect history) |
| sale_items.sale_id → sales.id | CASCADE (items deleted with order) |
| sale_items.product_id → products.id | **RESTRICT** (protect history) |

---

## 5. Inventory Workflow

### 5.1 Purchase Completion — Stock Increase

```
User marks purchase status → 'completed' OR creates a completed purchase initially
            │
            ▼
DB Trigger: on_purchase_completed (on purchases status update) 
            OR 
DB Trigger: on_purchase_item_inserted (on purchase_items insert)
            │
            ▼
For each purchase_item in this completed purchase:
    UPDATE products
    SET stock_quantity = stock_quantity + purchase_item.quantity
    WHERE products.id = purchase_item.product_id
            │
            ▼
✅ Stock increased atomically.
   All items updated in one DB operation.
```

**Functions:**
- `increase_stock_on_purchase_complete()` — SECURITY DEFINER, fires AFTER UPDATE OF status ON purchases.
- `increase_stock_on_purchase_item_insert()` — SECURITY DEFINER, fires AFTER INSERT ON purchase_items if parent status is 'completed'.

---

### 5.2 Sale Completion — Stock Decrease

```
User marks sale status → 'completed' OR creates a completed sale initially
            │
            ▼
DB Trigger: on_sale_completed (on sales status update)
            OR
DB Trigger: on_sale_item_inserted (on sale_items insert)
            │
            ▼
Step 1: VALIDATE all items
  FOR each sale_item:
    IF products.stock_quantity < sale_item.quantity THEN
      ❌ RAISE EXCEPTION 'Insufficient stock for [product_name]'
         Transaction ROLLS BACK — sale stays 'pending' or insert fails
            │
            ▼  (only if all validations pass)
Step 2: DEDUCT stock
  UPDATE products
  SET stock_quantity = stock_quantity - sale_item.quantity
  WHERE products.id = sale_item.product_id
            │
            ▼
✅ Stock decreased atomically.
   ERRCODE: P0001 returned to application on failure.
```

**Functions:**
- `decrease_stock_on_sale_complete()` — SECURITY DEFINER, fires AFTER UPDATE OF status ON sales.
- `decrease_stock_on_sale_item_insert()` — SECURITY DEFINER, fires AFTER INSERT ON sale_items if parent status is 'completed'.

---

### 5.3 Stock Safety Rules

| Rule | Enforcement |
|------|-------------|
| stock_quantity cannot be negative | DB CHECK constraint |
| Pre-sale stock validation | Trigger raises EXCEPTION before deducting |
| Failed validation rolls back | PostgreSQL transaction atomicity |
| Historical prices preserved | unit_price denormalized in *_items tables |

---

## 6. Row Level Security Strategy

> **Core Policy:** Every user can only see and modify their own data.  
> `auth.uid()` is matched against `user_id` on every operation.

### Direct Tables (products, customers, suppliers, purchases, sales)

```sql
-- Pattern applied to all 5 direct tables:
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

### Child Tables (purchase_items, sale_items)

These tables don't carry `user_id` — ownership is verified via parent JOIN:

```sql
-- purchase_items example:
USING (
    EXISTS (
        SELECT 1 FROM public.purchases p
        WHERE p.id = purchase_items.purchase_id
          AND p.user_id = auth.uid()
    )
)
```

### users Table (profile)

```sql
-- Users can only read/update their own profile row:
USING (auth.uid() = id)
```

### Database Functions

All functions that perform stock updates use `SECURITY DEFINER` to bypass RLS atomically:

| Function | SECURITY DEFINER | Reason |
|----------|-----------------|--------|
| `handle_new_user()` | ✅ | Writes public.users from auth schema |
| `increase_stock_on_purchase_complete()` | ✅ | Updates products across user boundary |
| `decrease_stock_on_sale_complete()` | ✅ | Updates products across user boundary |
| `get_dashboard_stats()` | ✅ | Aggregates across multiple tables |
| `generate_invoice_number()` | ✅ | Counts existing sales for uniqueness |
| `get_low_stock_products()` | ✅ | Returns cross-table data efficiently |

All SECURITY DEFINER functions explicitly filter by `auth.uid()` to prevent data leakage.

---

## 7. Indexing Strategy

| Table          | Index Name                        | Column(s)       | Reason                               |
|----------------|-----------------------------------|-----------------|--------------------------------------|
| products       | idx_products_user_id              | user_id         | All product queries filter by owner  |
| products       | idx_products_name                 | name            | Search / sort by name                |
| products       | idx_products_sku                  | sku             | Fast SKU lookup                      |
| products       | idx_products_category             | category        | Filter by category                   |
| customers      | idx_customers_user_id             | user_id         | All customer queries filter by owner |
| customers      | idx_customers_name                | name            | Search / sort by name                |
| customers      | idx_customers_phone               | phone           | Phone lookup                         |
| customers      | idx_customers_email               | email           | Email lookup                         |
| suppliers      | idx_suppliers_user_id             | user_id         | All supplier queries filter by owner |
| suppliers      | idx_suppliers_name                | name            | Search / sort by name                |
| suppliers      | idx_suppliers_phone               | phone           | Phone lookup                         |
| purchases      | idx_purchases_user_id             | user_id         | Filter purchases by owner            |
| purchases      | idx_purchases_supplier_id         | supplier_id     | Join to suppliers                    |
| purchases      | idx_purchases_status              | status          | Filter by status                     |
| purchases      | idx_purchases_purchase_date       | purchase_date DESC | Date-range queries, recent first  |
| purchase_items | idx_purchase_items_purchase_id    | purchase_id     | Fetch all items for a purchase       |
| purchase_items | idx_purchase_items_product_id     | product_id      | Inventory trigger + product history  |
| sales          | idx_sales_user_id                 | user_id         | Filter sales by owner                |
| sales          | idx_sales_customer_id             | customer_id     | Join to customers                    |
| sales          | idx_sales_status                  | status          | Filter by status                     |
| sales          | idx_sales_sale_date               | sale_date DESC  | Date-range queries, recent first     |
| sale_items     | idx_sale_items_sale_id            | sale_id         | Fetch all items for a sale           |
| sale_items     | idx_sale_items_product_id         | product_id      | Stock trigger + product history      |

**Total: 22 indexes** (including 2 from UNIQUE constraints: `products_user_sku_unique`, `sales_user_invoice_unique`)

---

## 8. Database Functions

### `get_dashboard_stats()` → RPC

Called via `supabase.rpc('get_dashboard_stats')`. Returns KPI aggregates in a single round trip.

```typescript
const { data } = await supabase.rpc('get_dashboard_stats');
// Returns: { total_products, total_customers, total_suppliers,
//            total_purchases, total_sales, total_revenue }
```

### `generate_invoice_number()` → RPC

Generates unique invoice number: `INV-YYYYMMDD-NNNN`.

```typescript
const { data: invoiceNo } = await supabase.rpc('generate_invoice_number');
// Returns: "INV-20260707-0001"
```

### `get_low_stock_products()` → RPC

Returns products where `stock_quantity <= min_stock`.

```typescript
const { data } = await supabase.rpc('get_low_stock_products');
// Returns: Array<{ id, name, sku, category, stock_quantity, min_stock, selling_price }>
```

### `increase_stock_on_purchase_item_insert()` → Trigger Function

Fires on `purchase_items` insert to increase stock levels if purchase is marked completed.

### `decrease_stock_on_sale_item_insert()` → Trigger Function

Fires on `sale_items` insert to decrease stock levels and validate stock limits (throws P0001 on failure) if sale is completed.
