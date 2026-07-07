# Glass ERP — Testing Documentation

This document outlines the test strategies, verification matrixes, and manual test scripts executed to validate the Glass ERP Management System.

---

## 1. Scope of Testing

Testing covers the entire user flow:
- **Authentication System**: Login redirection, registration validation, token expiration, sign out.
- **Directories**: Full CRUD, search, filter boundaries for Products, Customers, and Suppliers.
- **Transactions**: Double-entry consistency for completed Purchase Orders and Sales Invoices.
- **Inventory Safety**: Database triggers preventing negative stock levels.
- **Reports & Auditing**: Filtering aggregates and Excel/CSV data exports.

---

## 2. Manual Test Matrix & Scripts

### Test Case 1: Session Security & Routing
1. Access `/dashboard` in an incognito window.
2. **Expected Result**: System redirects page to `/login`.
3. Try registering a new user via `/register`.
4. **Expected Result**: Successful account creation directs user automatically to dashboard.

### Test Case 2: Product SKU Uniqueness
1. Create a product with SKU `SKU-TEST-001` and category `Hardware`.
2. Attempt to create a second product with SKU `SKU-TEST-001`.
3. **Expected Result**: Form blocks action and shows "SKU is already registered".

### Test Case 3: Purchase Stock Increment Flow
1. Note the current stock level of `SKU-TEST-001` (e.g. `0` items).
2. Go to **Purchases** > **Create Purchase**. Select a supplier, add `SKU-TEST-001` with quantity `50` and cost price `100.00`.
3. Save the purchase invoice.
4. Go back to **Products** list.
5. **Expected Result**: Stock quantity of `SKU-TEST-001` has updated to `50` items.

### Test Case 4: Sales Stock Limit Validation
1. Go to **Sales** > **Create Invoice**. Select a customer.
2. Add `SKU-TEST-001` and enter quantity `60`.
3. **Expected Result**: Input field highlights red and displays "Quantity exceeds available stock level (50 left)".
4. Attempt to press "Create Invoice".
5. **Expected Result**: Form intercepts action, blocks submit, and toasts "Insufficient stock".

### Test Case 5: Sales Stock Deduction Flow
1. Go to **Sales** > **Create Invoice**. Select customer, add `SKU-TEST-001` with quantity `15`.
2. Complete transaction.
3. Go back to **Products** list.
4. **Expected Result**: Stock quantity of `SKU-TEST-001` has decreased to `35` items (`50 - 15`).
5. Open the invoice details `/sales/:id` and verify details align.

### Test Case 6: CSV Export Accuracy
1. Go to **Reports** > **Inventory Value** or **Sales Revenue** tab.
2. Click **Export CSV**.
3. Open the downloaded file in Microsoft Excel or Google Sheets.
4. **Expected Result**: File opens with clean rows. Escaped strings containing commas or special characters are safely isolated inside double quotes.

---

## 3. Critical Database Workflow Tests

### Atomicity & Transaction Safety
Purchase and Sale creation are client-side step transactions. If saving lines fails (e.g. DB connection interrupts midway or RLS blocks a record), the transaction:
1. Catches the error.
2. Deletes the parent header record (rollback).
3. Alerts the user via toast notifications.
This keeps the database consistent and prevents orphaned invoices.

---

## 4. Known Limitations & Assessment Scope
- **Offline Sync**: Real-time network interruptions during transactions require a page reload to resubmit.
- **Audit Trails**: Inventory ledger histories are derived from sales/purchase lists; historical logs are not stored in separate database journals.
