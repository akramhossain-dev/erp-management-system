# Glass ERP — Testing Documentation

Comprehensive end-to-end testing guide for the Glass ERP Management System. Covers all modules, business logic validation, responsive testing, and known edge cases.

---

## 1. Testing Scope

| Module | Type | Status |
|---|---|---|
| Authentication | Manual E2E | ✅ Verified |
| Dashboard | Manual E2E + Visual | ✅ Verified |
| Products | Manual CRUD | ✅ Verified |
| Customers | Manual CRUD | ✅ Verified |
| Suppliers | Manual CRUD | ✅ Verified |
| Purchases | Manual E2E + DB Trigger | ✅ Verified |
| Sales | Manual E2E + DB Trigger + Stock Guard | ✅ Verified |
| Reports | Manual Filter + Export | ✅ Verified |
| Responsive (Mobile) | Visual Inspection | ✅ Verified |
| Responsive (Tablet) | Visual Inspection | ✅ Verified |
| Responsive (Desktop) | Visual Inspection | ✅ Verified |

---

## 2. Full E2E Test Checklist

### 2.1 Authentication

| Test | Steps | Expected Result | Status |
|---|---|---|---|
| Protected route redirect | Visit `/dashboard` without login | Redirects to `/login` | ✅ |
| Invalid login | Enter wrong email/password | Error toast: "Invalid credentials" | ✅ |
| Valid login | Correct email + password | Redirects to `/dashboard` | ✅ |
| Registration | New email + password (min 6 chars) | Account created, redirected to dashboard | ✅ |
| Logout | Click user menu → Logout | Redirects to `/login`, session cleared | ✅ |
| Session persistence | Login, close tab, reopen | Still logged in (JWT persists) | ✅ |
| Form validation | Submit empty login form | Field-level Zod errors displayed | ✅ |

---

### 2.2 Dashboard

| Test | Expected Result | Status |
|---|---|---|
| KPI cards load | 6 cards: Products, Customers, Suppliers, Purchases, Sales, Revenue | ✅ |
| KPI skeleton state | Cards show skeleton while loading | ✅ |
| Revenue chart loads | Area chart with last 6 months | ✅ |
| Sales chart loads | Bar chart: completed vs pending | ✅ |
| Recent activity feed | Shows latest sales + purchases sorted by date | ✅ |
| Low stock alert | Shows products at/below min_stock_level | ✅ |
| Refresh button | Invalidates all queries, re-fetches data | ✅ |
| Quick actions | Links navigate to correct pages | ✅ |
| Empty state (no data) | Charts show "No data" empty state | ✅ |

---

### 2.3 Products

| Test | Steps | Expected Result | Status |
|---|---|---|---|
| Create product | Fill form (name, SKU, price, stock) → Submit | Product appears in table | ✅ |
| SKU uniqueness | Create product with existing SKU | Error: "SKU already exists" | ✅ |
| Edit product | Click Edit → Modify fields → Submit | Product updated in table | ✅ |
| Delete product | Click Delete → Confirm dialog | Product removed from table | ✅ |
| Search | Type product name in search box | Table filters in real-time | ✅ |
| Category filter | Select category from dropdown | Table shows only that category | ✅ |
| Stock filter | Select "Low Stock" filter | Shows products below min_stock_level | ✅ |
| Form validation | Submit empty required fields | Field errors shown | ✅ |
| Margin preview | Enter cost/sale price | Margin % calculated in real-time | ✅ |

---

### 2.4 Customers

| Test | Expected Result | Status |
|---|---|---|
| Create customer | Customer appears in list | ✅ |
| Edit customer | Changes saved | ✅ |
| Delete customer | Customer removed | ✅ |
| Search by name | Filters list | ✅ |
| Form validation | Required fields enforced | ✅ |
| Empty state | "No customers yet" shown | ✅ |

---

### 2.5 Suppliers

| Test | Expected Result | Status |
|---|---|---|
| Create supplier | Supplier appears in list | ✅ |
| Edit supplier | Changes saved | ✅ |
| Delete supplier | Supplier removed | ✅ |
| Search by name | Filters list | ✅ |
| Form validation | Required fields enforced | ✅ |

---

### 2.6 Purchases — Critical Workflow

#### Test Case: Purchase Stock Increment Flow

1. Note current stock of a product (e.g. `SKU-001` has `0` units)
2. Go to **Purchases → Create Purchase**
3. Select a supplier, add line item: `SKU-001` qty `50`, unit price `100.00`
4. Submit → Purchase saved
5. Go to **Products**
6. **Expected**: `SKU-001` stock is now `50` ✅

| Test | Expected Result | Status |
|---|---|---|
| Create purchase order | Appears in purchase list | ✅ |
| Multi-item purchase | Multiple line items saved correctly | ✅ |
| Subtotal calculation | Line qty × price = correct line total | ✅ |
| Grand total calculation | Sum of all line totals correct | ✅ |
| Stock auto-increment | DB trigger fires, stock updated | ✅ |
| Purchase detail view | All items and totals visible | ✅ |
| Supplier required | Cannot submit without supplier | ✅ |

---

### 2.7 Sales — Critical Workflow + Stock Guard

#### Test Case A: Insufficient Stock Rejection

1. Product `SKU-001` has `50` units in stock
2. Go to **Sales → Create Invoice**
3. Select customer, add `SKU-001` with qty `60`
4. **Expected**: Field shows red "Exceeds available stock (50)" ✅
5. Attempt to submit
6. **Expected**: Form blocked, toast "Insufficient stock" ✅

#### Test Case B: Sales Stock Deduction

1. Create invoice with `SKU-001` qty `15` (stock: 50)
2. Save invoice
3. Go to **Products**
4. **Expected**: `SKU-001` stock is now `35` (50 − 15) ✅

| Test | Expected Result | Status |
|---|---|---|
| Create sale invoice | Invoice appears in sales list | ✅ |
| Customer required | Cannot submit without customer | ✅ |
| Stock validation (UI) | Real-time qty limit on item row | ✅ |
| Stock validation (DB) | Trigger rejects negative stock | ✅ |
| Invoice number generation | Sequential invoice numbers (INV-0001, 0002...) | ✅ |
| Multi-item sale | Multiple products on one invoice | ✅ |
| Subtotal/total calculation | Correct arithmetic | ✅ |
| Stock deduction trigger | DB auto-decrements stock | ✅ |
| Invoice preview | Printable A4 view renders correctly | ✅ |
| Sale detail view | All line items and totals shown | ✅ |

---

### 2.8 Reports

| Test | Expected Result | Status |
|---|---|---|
| Sales report tab | Shows sales with filter by date/customer/status | ✅ |
| Purchase report tab | Shows purchases with filter | ✅ |
| Product inventory tab | Shows all products with stock value | ✅ |
| Customer report tab | Shows customer purchase totals | ✅ |
| Supplier report tab | Shows supplier supply totals | ✅ |
| Date range filter | Filters data by start/end date | ✅ |
| Search filter | Filters by name/invoice number | ✅ |
| Summary KPI cards | Total revenue, count, average shown | ✅ |
| Export CSV | Downloads valid UTF-8 BOM CSV | ✅ |
| Empty state | "No records found" when no data | ✅ |
| Reset filters | Clears all filters | ✅ |

---

## 3. Business Logic Verification

### Stock Integrity Tests

| Scenario | Result |
|---|---|
| Purchase → stock increases | ✅ Confirmed via DB trigger |
| Sale → stock decreases | ✅ Confirmed via DB trigger |
| Sale qty > stock → rejected | ✅ Both UI + DB trigger reject |
| Stock never goes negative | ✅ DB trigger raises exception |
| Completed purchase increments, pending does not | ✅ Trigger checks status |

### Data Consistency Tests

| Check | Result |
|---|---|
| Dashboard KPI count matches Supabase table row count | ✅ |
| Revenue = sum of completed sale `total_amount` | ✅ |
| Report totals match transaction data | ✅ |
| Invoice numbers are unique and sequential | ✅ |
| RLS: User only sees their own data | ✅ |

---

## 4. Responsive Testing

### Mobile (< 640px)

| Test | Result |
|---|---|
| Sidebar hidden by default | ✅ |
| Hamburger menu opens sidebar as overlay | ✅ |
| Clicking outside closes drawer | ✅ |
| All navigation links functional in drawer | ✅ |
| Tables scroll horizontally | ✅ |
| Forms single-column layout | ✅ |
| Dashboard cards stack vertically | ✅ |
| Report filters stack vertically | ✅ |

### Tablet (640–1024px)

| Test | Result |
|---|---|
| Sidebar appears as overlay with toggle | ✅ |
| Two-column card grids | ✅ |
| Table readable without horizontal scroll | ✅ |
| Padding adjusted appropriately | ✅ |

### Desktop (> 1024px)

| Test | Result |
|---|---|
| Sidebar always visible | ✅ |
| No hamburger menu button | ✅ |
| Three-column KPI grid | ✅ |
| Charts side by side (2/3 + 1/3) | ✅ |
| Full table width | ✅ |

---

## 5. Bugs Found & Fixed

| Bug | Location | Fix Applied |
|---|---|---|
| Sidebar not closeable on mobile | `MobileDrawer.tsx` | Added overlay click handler + ESC key close |
| Hamburger button visible on desktop | `Navbar.tsx` | Added `lg:hidden` CSS class |
| Stock not updating after purchase | DB trigger | Rewrote trigger to use `AFTER INSERT` on items |
| Double stock deduction on sale | DB trigger | Scoped trigger to check parent sale status |
| HTML5 router 404 on Vercel refresh | Deployment | Added `vercel.json` SPA rewrite rule |
| Report page hardcoded colors not matching theme | `ReportsPage.tsx` | Replaced all `rgba()` with CSS variable tokens |
| Dashboard refresh button padding/sizing | `DashboardPage.tsx` | Refactored to proper styled button with `height: 36px` |
| Product form margin calculation negative | `ProductForm.tsx` | Added guard: cost > sale price = 0% margin |

---

## 6. Known Limitations

| Limitation | Impact | Future Fix |
|---|---|---|
| No real-time sync | Users need manual refresh after another user's changes | Add Supabase `realtime` subscription |
| No audit trail/inventory ledger | Stock history not separately stored | Add ledger table with trigger |
| No pagination on large datasets | Performance degrades with 1000+ rows | Add cursor-based pagination |
| Reports use client-side aggregation | May be slow on very large datasets | Move to Supabase RPC aggregations |
| No email notifications | No purchase/sale confirmation emails | Add Supabase Edge Functions + Resend |
| No print-to-PDF for invoices | Browser print dialog only | Add react-pdf or puppeteer |

---

## 7. TypeScript Verification

```bash
npm run type-check
```
**Result**: 0 errors ✅

```bash
npm run build
```
**Result**: Build successful, no warnings ✅
