# Glass ERP — Deployment Guide

This guide covers local development setup, Supabase database configuration, and production deployment to Vercel.

---

## 1. Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | ≥ 18.x | LTS recommended |
| **npm** | ≥ 9.x | Comes with Node |
| **Supabase Account** | Free tier | [supabase.com](https://supabase.com) |
| **Git** | Any | For cloning |

---

## 2. Environment Variables

All environment variables use the `VITE_` prefix (required by Vite for client-side access).

### Required Variables

| Variable | Description | Where to Find |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Supabase → Project Settings → API |

### Setup

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your values
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> [!CAUTION]
> Never commit `.env.local` to version control. It is already in `.gitignore`.

---

## 3. Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/akramhossain-dev/erp-management-system.git
cd erp-management-system

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Setup database (see Section 4 below)

# 5. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check + production build |
| `npm run type-check` | TypeScript check only (no emit) |
| `npm run lint` | Oxlint code quality check |
| `npm run preview` | Preview production build locally |

---

## 4. Supabase Database Setup

### Option A: Master Migration (Recommended)

Run the single master file in your **Supabase SQL Editor**:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **SQL Editor** → **New Query**
3. Open and paste the entire contents of:
   ```
   supabase/migrations/000_master_migration.sql
   ```
4. Click **Run** (RLS, tables, triggers, and functions are all created)

### Option B: Individual Migrations (In Order)

Run these in sequence via the SQL Editor:

```
001_create_users_table.sql
002_create_products_table.sql
003_create_customers_table.sql
004_create_suppliers_table.sql
005_create_purchases_tables.sql
006_create_sales_tables.sql
007_create_functions.sql
008_purchase_stock_trigger.sql
009_sale_stock_trigger.sql
```

### Database Features Configured

After running migrations, the following are active:

| Feature | Detail |
|---|---|
| **Tables** | users, products, customers, suppliers, purchase_orders, purchase_items, sales, sale_items |
| **RLS** | Row-Level Security enabled on all tables — users only see their own data |
| **Triggers** | `increase_stock_on_purchase_item_insert` — auto-increments stock |
| | `decrease_stock_on_sale_item_insert` — auto-decrements stock (with negative-stock guard) |
| **Functions** | `get_next_invoice_number()` — generates sequential invoice numbers |
| **Policies** | Full CRUD policies scoped to `auth.uid()` |

### Supabase Auth Configuration

The application uses **Supabase Email/Password authentication**. No additional configuration is required beyond running the migrations. The default Supabase Auth settings work out of the box.

> [!NOTE]
> Email confirmation is disabled in development mode by default. In production, you may want to enable it in Supabase Auth Settings.

---

## 5. Production Deployment — Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "feat: final production build"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Vercel auto-detects Vite — keep default settings

### Step 3: Environment Variables in Vercel

In Vercel Project Settings → **Environment Variables**, add:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` |

Set scope to: **Production**, **Preview**, **Development**

### Step 4: SPA Routing Fix

The project includes a `vercel.json` for client-side routing. Verify this file exists at project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> [!IMPORTANT]
> Without this file, refreshing any route like `/dashboard` or `/products` will return a 404 from Vercel.

### Step 5: Deploy

Click **Deploy** in Vercel. After a minute, your app is live.

### Build Settings (Vercel Auto-detected)

| Setting | Value |
|---|---|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

---

## 6. Supabase Production Checklist

Before going live, verify in Supabase:

- [ ] **RLS enabled** on all tables (check Table Editor → RLS column)
- [ ] **Email confirmation** setting matches your requirement
- [ ] **Allowed origins** — add your Vercel domain in Authentication → URL Configuration
  - Example: `https://your-app.vercel.app`
- [ ] **API rate limits** — review Supabase plan limits for production load
- [ ] **Database backups** — enable in Supabase project settings

---

## 7. Troubleshooting

### "Invalid API key" or auth errors
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
- Ensure variables are prefixed with `VITE_` (Vite only exposes `VITE_*` to client)

### "Could not find table 'public.products'" error
- The database migrations have not been run
- Run `000_master_migration.sql` in Supabase SQL Editor

### 404 on route refresh (e.g. `/dashboard`)
- Missing `vercel.json` — add the SPA rewrite rule shown above
- For other hosts (Netlify): add `_redirects` file: `/* /index.html 200`

### TypeScript compilation errors
```bash
npm run type-check
```
Resolve any type errors before running `npm run build`.

### Port already in use
```bash
npm run dev -- --port 3000
```

---

## 8. Deployment Notes for Evaluators

- The project uses **Supabase free tier** — all database operations work within free limits
- **No server required** — purely a Vite SPA + Supabase BaaS
- The `.env.example` file shows all required variables
- The master migration file creates everything in one click
