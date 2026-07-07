# ERP Management System — Database Architecture

> **Version:** 1.0.0  
> **Phase:** 0 — Planning & Design  
> **Database:** PostgreSQL (via Supabase)  
> **Status:** Draft  
> **Last Updated:** 2026-07-07

---

## Table of Contents

1. [Database Design Principles](#1-database-design-principles)
2. [Entity Relationship Overview](#2-entity-relationship-overview)
3. [Table Definitions](#3-table-definitions)
4. [Relationship Map](#4-relationship-map)
5. [Inventory Workflow](#5-inventory-workflow)
6. [Row Level Security Strategy](#6-row-level-security-strategy)
7. [Indexing Strategy](#7-indexing-strategy)

---

## 1. Database Design Principles

| Principle              | Decision                                                              |
|------------------------|-----------------------------------------------------------------------|
| Primary Keys           | UUID (gen_random_uuid()) — globally unique, safe for distributed use  |
| Timestamps             | All tables carry `created_at` and `updated_at` columns (auto-managed)|
| Soft Deletes           | `deleted_at` nullable timestamp for entities with linked transactions |
| Naming Convention      | snake_case for tables and columns                                     |
| Referential Integrity  | Foreign keys enforced at database level                               |
| Data Types             | NUMERIC(12,2) for monetary values; avoid FLOAT for financial data     |
| Auth Integration       | `user_id` fields reference `auth.users.id` (Supabase Auth schema)    |

---

## 2. Entity Relationship Overview

```
auth.users (Supabase managed)
    │
    │ (user_id FK)
    ├──────────────────────────────────────────────────────┐
    │                                                      │
    ▼                                                      ▼
products                                              customers
    │                                                      │
    │ (product_id FK)                                      │ (customer_id FK)
    │                                                      │
    ▼                                                      ▼
purchase_items ◄──── purchases ────► suppliers       sale_items ◄──── sales
                         │                                               │
                         │ (supplier_id FK)                              │
                         │                                               │
                    suppliers                                       products
                                                                 (product_id FK)
```

---

## 3. Table Definitions

### 3.1 Table: `users` (profile extension)

**Purpose:** Stores additional profile data for authenticated users. This extends Supabase's built-in `auth.users` table and lives in the `public` schema. It acts as the ERP user record and can hold role, full name, and avatar data.

| Column      | Type                     | Constraints              | Description                        |
|-------------|--------------------------|---------------------------|------------------------------------|
| id          | UUID                     | PK, FK → auth.users.id   | Mirrors Supabase auth user ID      |
| full_name   | TEXT                     | NOT NULL                  | Display name of the user           |
| email       | TEXT                     | NOT NULL, UNIQUE          | Email synced from auth.users       |
| role        | TEXT                     | DEFAULT 'user'            | Future RBAC: 'admin', 'user', etc. |
| avatar_url  | TEXT                     | NULLABLE                  | Optional profile picture URL       |
| created_at  | TIMESTAMPTZ              | NOT NULL, DEFAULT now()   | Record creation timestamp          |
| updated_at  | TIMESTAMPTZ              | NOT NULL, DEFAULT now()   | Last modification timestamp        |

**Notes:**
- A Supabase trigger (on `auth.users` insert) auto-creates the matching row in `public.users`.
- The `id` column is both the primary key and a foreign key to Supabase Auth, ensuring 1:1 mapping.

---

### 3.2 Table: `products`

**Purpose:** Central inventory catalog. Every item that can be bought or sold exists here. Stock quantity is managed here and updated automatically by purchase/sale database triggers.

| Column       | Type              | Constraints              | Description                          |
|--------------|-------------------|---------------------------|--------------------------------------|
| id           | UUID              | PK, DEFAULT gen_random_uuid()| Unique product identifier         |
| user_id      | UUID              | FK → auth.users.id, NOT NULL | Owner/creator of the record       |
| name         | TEXT              | NOT NULL                  | Product display name                 |
| sku          | TEXT              | NOT NULL, UNIQUE          | Stock Keeping Unit — unique code     |
| description  | TEXT              | NULLABLE                  | Detailed product description         |
| category     | TEXT              | NULLABLE                  | Product category label               |
| unit_price   | NUMERIC(12, 2)    | NOT NULL, DEFAULT 0       | Selling price per unit               |
| cost_price   | NUMERIC(12, 2)    | NOT NULL, DEFAULT 0       | Purchase/cost price per unit         |
| stock_qty    | INTEGER           | NOT NULL, DEFAULT 0       | Current available stock              |
| min_stock    | INTEGER           | NOT NULL, DEFAULT 0       | Threshold for low stock alerts       |
| deleted_at   | TIMESTAMPTZ       | NULLABLE                  | Soft delete timestamp                |
| created_at   | TIMESTAMPTZ       | NOT NULL, DEFAULT now()   | Record creation timestamp            |
| updated_at   | TIMESTAMPTZ       | NOT NULL, DEFAULT now()   | Last modification timestamp          |

**Business Rules:**
- `stock_qty` must never go negative (enforced by a CHECK constraint and sale validation logic).
- `sku` must be globally unique per user scope.

---

### 3.3 Table: `customers`

**Purpose:** Stores all customer records. Customers are linked to sales transactions for history tracking and reporting.

| Column     | Type              | Constraints                   | Description                        |
|------------|-------------------|--------------------------------|------------------------------------|
| id         | UUID              | PK, DEFAULT gen_random_uuid() | Unique customer identifier          |
| user_id    | UUID              | FK → auth.users.id, NOT NULL  | Owner of the customer record        |
| name       | TEXT              | NOT NULL                      | Full name or business name          |
| email      | TEXT              | NULLABLE                      | Contact email                       |
| phone      | TEXT              | NULLABLE                      | Contact phone number                |
| address    | TEXT              | NULLABLE                      | Physical address                    |
| notes      | TEXT              | NULLABLE                      | Additional notes about customer     |
| deleted_at | TIMESTAMPTZ       | NULLABLE                      | Soft delete timestamp               |
| created_at | TIMESTAMPTZ       | NOT NULL, DEFAULT now()       | Record creation timestamp           |
| updated_at | TIMESTAMPTZ       | NOT NULL, DEFAULT now()       | Last modification timestamp         |

---

### 3.4 Table: `suppliers`

**Purpose:** Stores all supplier records. Suppliers are linked to purchase transactions for history tracking and reporting.

| Column     | Type              | Constraints                   | Description                        |
|------------|-------------------|--------------------------------|------------------------------------|
| id         | UUID              | PK, DEFAULT gen_random_uuid() | Unique supplier identifier          |
| user_id    | UUID              | FK → auth.users.id, NOT NULL  | Owner of the supplier record        |
| name       | TEXT              | NOT NULL                      | Supplier company name               |
| email      | TEXT              | NULLABLE                      | Contact email                       |
| phone      | TEXT              | NULLABLE                      | Contact phone number                |
| address    | TEXT              | NULLABLE                      | Physical address                    |
| notes      | TEXT              | NULLABLE                      | Additional notes about supplier     |
| deleted_at | TIMESTAMPTZ       | NULLABLE                      | Soft delete timestamp               |
| created_at | TIMESTAMPTZ       | NOT NULL, DEFAULT now()       | Record creation timestamp           |
| updated_at | TIMESTAMPTZ       | NOT NULL, DEFAULT now()       | Last modification timestamp         |

---

### 3.5 Table: `purchases`

**Purpose:** A purchase transaction header. Represents a complete purchase order placed with a supplier. Each purchase can contain multiple line items stored in `purchase_items`.

| Column        | Type              | Constraints                   | Description                         |
|---------------|-------------------|--------------------------------|-------------------------------------|
| id            | UUID              | PK, DEFAULT gen_random_uuid() | Unique purchase identifier           |
| user_id       | UUID              | FK → auth.users.id, NOT NULL  | Who created this purchase            |
| supplier_id   | UUID              | FK → suppliers.id, NOT NULL   | Linked supplier for this purchase    |
| status        | TEXT              | NOT NULL, DEFAULT 'pending'   | 'pending', 'completed', 'cancelled'  |
| total_amount  | NUMERIC(12, 2)    | NOT NULL, DEFAULT 0           | Sum of all line item totals          |
| notes         | TEXT              | NULLABLE                      | Optional notes or reference number   |
| purchase_date | DATE              | NOT NULL, DEFAULT CURRENT_DATE| Date of the purchase transaction     |
| created_at    | TIMESTAMPTZ       | NOT NULL, DEFAULT now()       | Record creation timestamp            |
| updated_at    | TIMESTAMPTZ       | NOT NULL, DEFAULT now()       | Last modification timestamp          |

**Status Flow:** `pending` → `completed` (triggers stock increase) or `cancelled`

---

### 3.6 Table: `purchase_items`

**Purpose:** Line items for a purchase. Each row represents one product type within a purchase order, specifying quantity and price agreed with the supplier at that time.

| Column       | Type              | Constraints                   | Description                         |
|--------------|-------------------|--------------------------------|-------------------------------------|
| id           | UUID              | PK, DEFAULT gen_random_uuid() | Unique line item identifier          |
| purchase_id  | UUID              | FK → purchases.id, NOT NULL   | Parent purchase transaction          |
| product_id   | UUID              | FK → products.id, NOT NULL    | Product being purchased              |
| quantity     | INTEGER           | NOT NULL, CHECK > 0           | Number of units purchased            |
| unit_price   | NUMERIC(12, 2)    | NOT NULL                      | Price per unit at time of purchase   |
| total_price  | NUMERIC(12, 2)    | NOT NULL                      | quantity × unit_price (computed)     |
| created_at   | TIMESTAMPTZ       | NOT NULL, DEFAULT now()       | Record creation timestamp            |

**Notes:**
- `unit_price` is copied from `products.cost_price` at order time but can be overridden (supplier negotiation).
- `total_price` should be computed and stored for reporting without join overhead.

---

### 3.7 Table: `sales`

**Purpose:** A sales transaction header. Represents a completed sale made to a customer. Each sale can contain multiple line items stored in `sale_items`.

| Column        | Type              | Constraints                   | Description                         |
|---------------|-------------------|--------------------------------|-------------------------------------|
| id            | UUID              | PK, DEFAULT gen_random_uuid() | Unique sale identifier               |
| user_id       | UUID              | FK → auth.users.id, NOT NULL  | Who created this sale                |
| customer_id   | UUID              | FK → customers.id, NOT NULL   | Linked customer for this sale        |
| status        | TEXT              | NOT NULL, DEFAULT 'pending'   | 'pending', 'completed', 'cancelled'  |
| total_amount  | NUMERIC(12, 2)    | NOT NULL, DEFAULT 0           | Sum of all line item totals          |
| notes         | TEXT              | NULLABLE                      | Optional notes or invoice reference  |
| sale_date     | DATE              | NOT NULL, DEFAULT CURRENT_DATE| Date of the sale transaction         |
| created_at    | TIMESTAMPTZ       | NOT NULL, DEFAULT now()       | Record creation timestamp            |
| updated_at    | TIMESTAMPTZ       | NOT NULL, DEFAULT now()       | Last modification timestamp          |

**Status Flow:** `pending` → `completed` (triggers stock decrease) or `cancelled`

---

### 3.8 Table: `sale_items`

**Purpose:** Line items for a sale. Each row represents one product type within a sale order, specifying quantity and selling price.

| Column      | Type              | Constraints                   | Description                         |
|-------------|-------------------|--------------------------------|-------------------------------------|
| id          | UUID              | PK, DEFAULT gen_random_uuid() | Unique line item identifier          |
| sale_id     | UUID              | FK → sales.id, NOT NULL       | Parent sale transaction              |
| product_id  | UUID              | FK → products.id, NOT NULL    | Product being sold                   |
| quantity    | INTEGER           | NOT NULL, CHECK > 0           | Number of units sold                 |
| unit_price  | NUMERIC(12, 2)    | NOT NULL                      | Selling price per unit at sale time  |
| total_price | NUMERIC(12, 2)    | NOT NULL                      | quantity × unit_price (computed)     |
| created_at  | TIMESTAMPTZ       | NOT NULL, DEFAULT now()       | Record creation timestamp            |

**Notes:**
- `unit_price` is copied from `products.unit_price` at sale time and stored to preserve historical accuracy.
- Even if the product price changes later, old sale records retain the original sale price.

---

## 4. Relationship Map

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  auth.users │────1:1──│    users     │          │  suppliers  │
└─────────────┘         └──────────────┘          └──────┬──────┘
                               │                         │
                               │ 1:N                     │ 1:N
                        ┌──────▼──────┐          ┌───────▼──────┐
                        │  products   │          │   purchases   │
                        └──────┬──────┘          └───────┬───────┘
                               │                         │
                               │ 1:N                     │ 1:N
                        ┌──────▼──────────────────►──────▼────────┐
                        │          purchase_items                  │
                        └──────────────────────────────────────────┘

                        ┌──────────────┐         ┌─────────────┐
                        │  customers   │          │    sales    │
                        └──────┬───────┘          └──────┬──────┘
                               │ 1:N                     │ 1:N
                        ┌──────▼──────────────────►──────▼────────┐
                        │            sale_items                    │
                        └──────────────────────────────────────────┘

                        ┌──────────────┐
                        │  products    │◄───── sale_items.product_id (N:1)
                        └──────────────┘◄───── purchase_items.product_id (N:1)
```

### Cardinality Summary

| Relationship                          | Type |
|---------------------------------------|------|
| auth.users → users                    | 1:1  |
| users → products                      | 1:N  |
| users → customers                     | 1:N  |
| users → suppliers                     | 1:N  |
| users → purchases                     | 1:N  |
| users → sales                         | 1:N  |
| suppliers → purchases                 | 1:N  |
| purchases → purchase_items            | 1:N  |
| products → purchase_items             | 1:N  |
| customers → sales                     | 1:N  |
| sales → sale_items                    | 1:N  |
| products → sale_items                 | 1:N  |

---

## 5. Inventory Workflow

### 5.1 Purchase Completion — Stock Increase

```
User marks purchase as 'completed'
           │
           ▼
Supabase DB trigger fires on: purchases.status = 'completed'
           │
           ▼
For each row in purchase_items WHERE purchase_id = [this purchase]:
    UPDATE products
    SET stock_qty = stock_qty + purchase_items.quantity
    WHERE products.id = purchase_items.product_id
           │
           ▼
Stock quantity increased. Purchase record locked (immutable).
```

### 5.2 Sale Completion — Stock Decrease

```
User submits a new sale
           │
           ▼
Pre-sale validation (application layer + DB constraint):
    For each sale item:
        IF products.stock_qty < sale_items.quantity THEN
            RAISE ERROR: 'Insufficient stock for [product_name]'
           │
           ▼
Sale record created with status 'pending'
           │
           ▼
User confirms/completes the sale
           │
           ▼
Supabase DB trigger fires on: sales.status = 'completed'
           │
           ▼
For each row in sale_items WHERE sale_id = [this sale]:
    UPDATE products
    SET stock_qty = stock_qty - sale_items.quantity
    WHERE products.id = sale_items.product_id
           │
           ▼
Stock quantity decreased. Sale record locked (immutable).
```

### 5.3 Stock Safety Rules

| Rule                                  | Enforcement Method                       |
|---------------------------------------|------------------------------------------|
| stock_qty cannot be negative           | DB CHECK constraint + app validation     |
| Completed transactions are immutable   | Application logic + RLS policy           |
| Historical prices preserved in items   | Denormalized unit_price in *_items tables|
| Cancelled transactions don't affect stock | Status check in DB trigger            |

---

## 6. Row Level Security Strategy

All tables in the `public` schema will have RLS enabled. The core policy is:

> **Every user can only see and modify their own data.**

### RLS Policy Pattern (per table)

| Policy Name           | Operation | Condition                                 |
|-----------------------|-----------|-------------------------------------------|
| select_own_data       | SELECT    | auth.uid() = user_id                      |
| insert_own_data       | INSERT    | auth.uid() = user_id                      |
| update_own_data       | UPDATE    | auth.uid() = user_id                      |
| delete_own_data       | DELETE    | auth.uid() = user_id                      |

### Special Cases

- **purchase_items / sale_items:** These tables link to purchases/sales which carry `user_id`. RLS for these child tables checks ownership via a JOIN to the parent table.
- **users (profile):** Users can only read and update their own profile row. Admin roles will override this in Phase 2.
- **Database Functions:** Functions performing stock updates must run with `SECURITY DEFINER` to bypass RLS where needed (e.g., updating `stock_qty` atomically during trigger execution).

---

## 7. Indexing Strategy

Well-planned indexes minimize query time for the most common ERP operations.

| Table          | Indexed Column(s)                | Reason                                      |
|----------------|----------------------------------|---------------------------------------------|
| products       | user_id                          | All product queries filter by owner          |
| products       | sku                              | Unique constraint; fast lookup               |
| products       | name (text search)               | Product search functionality                 |
| customers      | user_id                          | All customer queries filter by owner         |
| suppliers      | user_id                          | All supplier queries filter by owner         |
| purchases      | user_id                          | Filter purchases by owner                    |
| purchases      | supplier_id                      | Join to suppliers table                      |
| purchases      | status                           | Filter by pending/completed/cancelled        |
| purchase_items | purchase_id                      | Fetch all items for a purchase               |
| purchase_items | product_id                       | Inventory updates; product history           |
| sales          | user_id                          | Filter sales by owner                        |
| sales          | customer_id                      | Join to customers table                      |
| sales          | status                           | Filter by pending/completed/cancelled        |
| sale_items     | sale_id                          | Fetch all items for a sale                   |
| sale_items     | product_id                       | Stock management; product history            |
