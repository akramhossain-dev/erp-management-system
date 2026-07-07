-- =============================================================================
-- ERP Management System — Migration 005
-- Tables: purchases + purchase_items
-- Description: Purchase transaction headers and line items.
--              Purchasing from suppliers → increases product stock.
-- =============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLE: public.purchases
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.purchases (
    id            UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID           NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    supplier_id   UUID           NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    status        TEXT           NOT NULL DEFAULT 'pending'
                                 CHECK (status IN ('pending', 'completed', 'cancelled')),
    total_amount  NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    purchase_date DATE           NOT NULL DEFAULT CURRENT_DATE,
    notes         TEXT,
    created_at    TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ    NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.purchases IS 'Purchase transaction header — one per purchase order from a supplier.';
COMMENT ON COLUMN public.purchases.user_id      IS 'User who created the purchase.';
COMMENT ON COLUMN public.purchases.supplier_id  IS 'FK to suppliers.id — restricted delete (protect history).';
COMMENT ON COLUMN public.purchases.status       IS 'Enum: pending | completed | cancelled.';
COMMENT ON COLUMN public.purchases.total_amount IS 'Sum of purchase_items.total_price. Stored for performance.';
COMMENT ON COLUMN public.purchases.purchase_date IS 'Date of the purchase transaction (not necessarily created_at).';

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLE: public.purchase_items
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.purchase_items (
    id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id  UUID           NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
    product_id   UUID           NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity     INTEGER        NOT NULL CHECK (quantity > 0),
    unit_price   NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    total_price  NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0),
    created_at   TIMESTAMPTZ    NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.purchase_items IS 'Line items for a purchase order.';
COMMENT ON COLUMN public.purchase_items.purchase_id IS 'FK to purchases.id — cascades on delete.';
COMMENT ON COLUMN public.purchase_items.product_id  IS 'FK to products.id — restricted delete (protect history).';
COMMENT ON COLUMN public.purchase_items.quantity    IS 'Units purchased. Must be > 0.';
COMMENT ON COLUMN public.purchase_items.unit_price  IS 'Price per unit at purchase time (historical snapshot).';
COMMENT ON COLUMN public.purchase_items.total_price IS 'quantity × unit_price. Stored denormalized for reports.';

-- ──────────────────────────────────────────────────────────────────────────────
-- TRIGGERS: auto updated_at on purchases
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TRIGGER set_purchases_updated_at
    BEFORE UPDATE ON public.purchases
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ──────────────────────────────────────────────────────────────────────────────
-- INDEXES: purchases + purchase_items
-- ──────────────────────────────────────────────────────────────────────────────

CREATE INDEX idx_purchases_user_id       ON public.purchases(user_id);
CREATE INDEX idx_purchases_supplier_id   ON public.purchases(supplier_id);
CREATE INDEX idx_purchases_status        ON public.purchases(status);
CREATE INDEX idx_purchases_purchase_date ON public.purchases(purchase_date DESC);

CREATE INDEX idx_purchase_items_purchase_id ON public.purchase_items(purchase_id);
CREATE INDEX idx_purchase_items_product_id  ON public.purchase_items(product_id);

-- ──────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY: purchases
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "purchases_select_own"
    ON public.purchases FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "purchases_insert_own"
    ON public.purchases FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "purchases_update_own"
    ON public.purchases FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "purchases_delete_own"
    ON public.purchases FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY: purchase_items
-- Child table — ownership checked via parent purchases.user_id JOIN
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "purchase_items_select_via_purchase"
    ON public.purchase_items FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.purchases p
            WHERE p.id = purchase_items.purchase_id
              AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "purchase_items_insert_via_purchase"
    ON public.purchase_items FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.purchases p
            WHERE p.id = purchase_items.purchase_id
              AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "purchase_items_update_via_purchase"
    ON public.purchase_items FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.purchases p
            WHERE p.id = purchase_items.purchase_id
              AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "purchase_items_delete_via_purchase"
    ON public.purchase_items FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.purchases p
            WHERE p.id = purchase_items.purchase_id
              AND p.user_id = auth.uid()
        )
    );

-- ──────────────────────────────────────────────────────────────────────────────
-- INVENTORY TRIGGER: increase stock on purchase completion
-- ──────────────────────────────────────────────────────────────────────────────

-- Function: called when a purchase status changes to 'completed'
CREATE OR REPLACE FUNCTION public.increase_stock_on_purchase_complete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER                   -- must bypass RLS to update products.stock_quantity
SET search_path = public
AS $$
BEGIN
    -- Only act when status transitions TO 'completed'
    IF NEW.status = 'completed' AND OLD.status <> 'completed' THEN
        UPDATE public.products p
        SET
            stock_quantity = p.stock_quantity + pi.quantity,
            updated_at     = now()
        FROM public.purchase_items pi
        WHERE pi.purchase_id = NEW.id
          AND p.id           = pi.product_id;
    END IF;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.increase_stock_on_purchase_complete() IS
    'Trigger: when a purchase is marked completed, increases stock_quantity for each purchased product.';

-- Attach trigger — fires on status column update
CREATE TRIGGER on_purchase_completed
    AFTER UPDATE OF status ON public.purchases
    FOR EACH ROW
    EXECUTE FUNCTION public.increase_stock_on_purchase_complete();
