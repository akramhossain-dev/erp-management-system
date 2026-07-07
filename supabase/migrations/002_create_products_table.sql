-- =============================================================================
-- ERP Management System — Migration 002
-- Table: products
-- Description: Central inventory catalog with stock tracking.
--              stock_quantity is managed by purchase/sale triggers.
-- =============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLE: public.products
-- ──────────────────────────────────────────────────────────────────────────────

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

    -- SKU must be unique per user (each user has their own product catalog)
    CONSTRAINT products_user_sku_unique UNIQUE (user_id, sku)
);

COMMENT ON TABLE  public.products IS 'Central inventory catalog — every purchasable/sellable item.';
COMMENT ON COLUMN public.products.user_id        IS 'Owner of this product record (auth.users FK).';
COMMENT ON COLUMN public.products.sku            IS 'Stock Keeping Unit — unique per user.';
COMMENT ON COLUMN public.products.purchase_price IS 'Cost price (what we pay suppliers). NUMERIC(12,2).';
COMMENT ON COLUMN public.products.selling_price  IS 'Retail price (what customers pay). NUMERIC(12,2).';
COMMENT ON COLUMN public.products.stock_quantity IS 'Current stock level. Must be >= 0 (CHECK constraint).';
COMMENT ON COLUMN public.products.min_stock      IS 'Minimum threshold for low-stock alerts.';

-- ──────────────────────────────────────────────────────────────────────────────
-- TRIGGER: auto-update updated_at on products
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ──────────────────────────────────────────────────────────────────────────────
-- INDEXES: products
-- ──────────────────────────────────────────────────────────────────────────────

-- Filter by owner (all product queries include user_id = auth.uid())
CREATE INDEX idx_products_user_id ON public.products(user_id);

-- Fast text search on product name
CREATE INDEX idx_products_name ON public.products(name);

-- Fast SKU lookup (also covered by unique constraint, added for explicit naming)
CREATE INDEX idx_products_sku ON public.products(sku);

-- Category filtering
CREATE INDEX idx_products_category ON public.products(category);

-- ──────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY: products
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_own"
    ON public.products FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "products_insert_own"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "products_update_own"
    ON public.products FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "products_delete_own"
    ON public.products FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
