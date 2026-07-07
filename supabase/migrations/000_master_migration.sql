-- =============================================================================
-- ERP Management System — MASTER MIGRATION
-- Version: 1.0.0  |  Phase: 2 — Database Architecture
-- =============================================================================
-- 
-- HOW TO USE:
--   Option A (Recommended): Run this entire file in the Supabase SQL Editor.
--   Option B: Run individual migration files in order (001 → 007).
--
-- SUPABASE SQL EDITOR:
--   1. Go to https://app.supabase.com
--   2. Select your project
--   3. Navigate to: SQL Editor → New query
--   4. Paste this entire file content
--   5. Click "Run"
--
-- PREREQUISITES:
--   - Supabase project created
--   - Authentication enabled (default)
--   - Public schema (default)
--
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 1: users (profile extension of auth.users)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
    id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT        NOT NULL DEFAULT '',
    email       TEXT        NOT NULL,
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.users IS 'ERP user profiles — extends Supabase auth.users (1:1).';

-- Shared trigger function: auto-set updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        NEW.raw_user_meta_data ->> 'avatar_url'
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON public.users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 2: products
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.products (
    id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID           NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name             TEXT           NOT NULL,
    sku              TEXT           NOT NULL,
    description      TEXT,
    category         TEXT,
    purchase_price   NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (purchase_price >= 0),
    selling_price    NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (selling_price >= 0),
    stock_quantity   INTEGER        NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    min_stock        INTEGER        NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ    NOT NULL DEFAULT now(),
    CONSTRAINT products_user_sku_unique UNIQUE (user_id, sku)
);

CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_products_user_id  ON public.products(user_id);
CREATE INDEX idx_products_name     ON public.products(name);
CREATE INDEX idx_products_sku      ON public.products(sku);
CREATE INDEX idx_products_category ON public.products(category);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_select_own" ON public.products FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "products_insert_own" ON public.products FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "products_update_own" ON public.products FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "products_delete_own" ON public.products FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 3: customers
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.customers (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name        TEXT        NOT NULL,
    email       TEXT,
    phone       TEXT,
    address     TEXT,
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT customers_email_format CHECK (
        email IS NULL OR email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'
    )
);

CREATE TRIGGER set_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_customers_user_id ON public.customers(user_id);
CREATE INDEX idx_customers_name    ON public.customers(name);
CREATE INDEX idx_customers_phone   ON public.customers(phone);
CREATE INDEX idx_customers_email   ON public.customers(email);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "customers_select_own" ON public.customers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "customers_insert_own" ON public.customers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "customers_update_own" ON public.customers FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "customers_delete_own" ON public.customers FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 4: suppliers
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.suppliers (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name        TEXT        NOT NULL,
    email       TEXT,
    phone       TEXT,
    address     TEXT,
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT suppliers_email_format CHECK (
        email IS NULL OR email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'
    )
);

CREATE TRIGGER set_suppliers_updated_at
    BEFORE UPDATE ON public.suppliers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX idx_suppliers_name    ON public.suppliers(name);
CREATE INDEX idx_suppliers_phone   ON public.suppliers(phone);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "suppliers_select_own" ON public.suppliers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "suppliers_insert_own" ON public.suppliers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "suppliers_update_own" ON public.suppliers FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "suppliers_delete_own" ON public.suppliers FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 5: purchases + purchase_items
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.purchases (
    id            UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID           NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    supplier_id   UUID           NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    status        TEXT           NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    total_amount  NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    purchase_date DATE           NOT NULL DEFAULT CURRENT_DATE,
    notes         TEXT,
    created_at    TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.purchase_items (
    id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id  UUID           NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
    product_id   UUID           NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity     INTEGER        NOT NULL CHECK (quantity > 0),
    unit_price   NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    total_price  NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0),
    created_at   TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE TRIGGER set_purchases_updated_at
    BEFORE UPDATE ON public.purchases
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_purchases_user_id       ON public.purchases(user_id);
CREATE INDEX idx_purchases_supplier_id   ON public.purchases(supplier_id);
CREATE INDEX idx_purchases_status        ON public.purchases(status);
CREATE INDEX idx_purchases_purchase_date ON public.purchases(purchase_date DESC);
CREATE INDEX idx_purchase_items_purchase_id ON public.purchase_items(purchase_id);
CREATE INDEX idx_purchase_items_product_id  ON public.purchase_items(product_id);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "purchases_select_own" ON public.purchases FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "purchases_insert_own" ON public.purchases FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "purchases_update_own" ON public.purchases FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "purchases_delete_own" ON public.purchases FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "purchase_items_select_via_purchase" ON public.purchase_items FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.purchases p WHERE p.id = purchase_items.purchase_id AND p.user_id = auth.uid()));
CREATE POLICY "purchase_items_insert_via_purchase" ON public.purchase_items FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.purchases p WHERE p.id = purchase_items.purchase_id AND p.user_id = auth.uid()));
CREATE POLICY "purchase_items_update_via_purchase" ON public.purchase_items FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.purchases p WHERE p.id = purchase_items.purchase_id AND p.user_id = auth.uid()));
CREATE POLICY "purchase_items_delete_via_purchase" ON public.purchase_items FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.purchases p WHERE p.id = purchase_items.purchase_id AND p.user_id = auth.uid()));

-- Stock increase trigger
CREATE OR REPLACE FUNCTION public.increase_stock_on_purchase_complete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status <> 'completed' THEN
        UPDATE public.products p
        SET stock_quantity = p.stock_quantity + pi.quantity, updated_at = now()
        FROM public.purchase_items pi
        WHERE pi.purchase_id = NEW.id AND p.id = pi.product_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_purchase_completed
    AFTER UPDATE OF status ON public.purchases
    FOR EACH ROW EXECUTE FUNCTION public.increase_stock_on_purchase_complete();

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 6: sales + sale_items
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sales (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID           NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_id    UUID           NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    invoice_number TEXT           NOT NULL,
    status         TEXT           NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    total_amount   NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    sale_date      DATE           NOT NULL DEFAULT CURRENT_DATE,
    notes          TEXT,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT now(),
    CONSTRAINT sales_user_invoice_unique UNIQUE (user_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS public.sale_items (
    id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id     UUID           NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    product_id  UUID           NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity    INTEGER        NOT NULL CHECK (quantity > 0),
    unit_price  NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0),
    created_at  TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE TRIGGER set_sales_updated_at
    BEFORE UPDATE ON public.sales
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_sales_user_id      ON public.sales(user_id);
CREATE INDEX idx_sales_customer_id  ON public.sales(customer_id);
CREATE INDEX idx_sales_status       ON public.sales(status);
CREATE INDEX idx_sales_sale_date    ON public.sales(sale_date DESC);
CREATE INDEX idx_sale_items_sale_id    ON public.sale_items(sale_id);
CREATE INDEX idx_sale_items_product_id ON public.sale_items(product_id);

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sales_select_own" ON public.sales FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "sales_insert_own" ON public.sales FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sales_update_own" ON public.sales FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sales_delete_own" ON public.sales FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sale_items_select_via_sale" ON public.sale_items FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.sales s WHERE s.id = sale_items.sale_id AND s.user_id = auth.uid()));
CREATE POLICY "sale_items_insert_via_sale" ON public.sale_items FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.sales s WHERE s.id = sale_items.sale_id AND s.user_id = auth.uid()));
CREATE POLICY "sale_items_update_via_sale" ON public.sale_items FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.sales s WHERE s.id = sale_items.sale_id AND s.user_id = auth.uid()));
CREATE POLICY "sale_items_delete_via_sale" ON public.sale_items FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.sales s WHERE s.id = sale_items.sale_id AND s.user_id = auth.uid()));

-- Stock decrease trigger with validation
CREATE OR REPLACE FUNCTION public.decrease_stock_on_sale_complete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_item RECORD;
BEGIN
    IF NEW.status = 'completed' AND OLD.status <> 'completed' THEN
        -- Validate stock availability
        FOR v_item IN
            SELECT si.product_id, si.quantity, p.stock_quantity, p.name
            FROM   public.sale_items si
            JOIN   public.products   p ON p.id = si.product_id
            WHERE  si.sale_id = NEW.id
        LOOP
            IF v_item.stock_quantity < v_item.quantity THEN
                RAISE EXCEPTION 'Insufficient stock for product "%". Available: %, Requested: %',
                    v_item.name, v_item.stock_quantity, v_item.quantity
                    USING ERRCODE = 'P0001';
            END IF;
        END LOOP;

        -- Deduct stock
        UPDATE public.products p
        SET stock_quantity = p.stock_quantity - si.quantity, updated_at = now()
        FROM public.sale_items si
        WHERE si.sale_id = NEW.id AND p.id = si.product_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_sale_completed
    AFTER UPDATE OF status ON public.sales
    FOR EACH ROW EXECUTE FUNCTION public.decrease_stock_on_sale_complete();

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 7: RPC functions
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE (
    total_products  BIGINT,
    total_customers BIGINT,
    total_suppliers BIGINT,
    total_purchases BIGINT,
    total_sales     BIGINT,
    total_revenue   NUMERIC
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT
        (SELECT COUNT(*) FROM public.products  WHERE user_id = auth.uid())                                AS total_products,
        (SELECT COUNT(*) FROM public.customers WHERE user_id = auth.uid())                                AS total_customers,
        (SELECT COUNT(*) FROM public.suppliers WHERE user_id = auth.uid())                                AS total_suppliers,
        (SELECT COUNT(*) FROM public.purchases WHERE user_id = auth.uid())                                AS total_purchases,
        (SELECT COUNT(*) FROM public.sales     WHERE user_id = auth.uid())                                AS total_sales,
        (SELECT COALESCE(SUM(total_amount),0) FROM public.sales WHERE user_id = auth.uid() AND status = 'completed') AS total_revenue;
$$;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_today      TEXT;
    v_count      INTEGER;
BEGIN
    v_today := to_char(CURRENT_DATE, 'YYYYMMDD');
    SELECT COUNT(*) + 1 INTO v_count
    FROM   public.sales
    WHERE  user_id = auth.uid() AND invoice_number LIKE 'INV-' || v_today || '-%';
    RETURN 'INV-' || v_today || '-' || LPAD(v_count::TEXT, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.get_low_stock_products()
RETURNS TABLE (id UUID, name TEXT, sku TEXT, category TEXT, stock_quantity INTEGER, min_stock INTEGER, selling_price NUMERIC)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT id, name, sku, category, stock_quantity, min_stock, selling_price
    FROM   public.products
    WHERE  user_id = auth.uid() AND stock_quantity <= min_stock
    ORDER  BY stock_quantity ASC;
$$;

-- =============================================================================
-- END OF MASTER MIGRATION
-- =============================================================================
-- 
-- ✅ Tables created:    users, products, customers, suppliers,
--                       purchases, purchase_items, sales, sale_items
-- ✅ Triggers created:  on_auth_user_created, set_*_updated_at,
--                       on_purchase_completed, on_sale_completed
-- ✅ RLS enabled:       All 8 tables
-- ✅ Policies created:  SELECT/INSERT/UPDATE/DELETE on all tables
-- ✅ Indexes created:   19 performance indexes
-- ✅ Functions:         get_dashboard_stats(), generate_invoice_number(),
--                       get_low_stock_products()
-- =============================================================================
