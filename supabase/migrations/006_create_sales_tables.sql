-- =============================================================================
-- ERP Management System — Migration 006
-- Tables: sales + sale_items
-- Description: Sales transaction headers and line items.
--              Selling to customers → decreases product stock.
--              Stock validation prevents overselling.
-- =============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLE: public.sales
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sales (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID           NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_id    UUID           NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    invoice_number TEXT           NOT NULL,
    status         TEXT           NOT NULL DEFAULT 'pending'
                                  CHECK (status IN ('pending', 'completed', 'cancelled')),
    total_amount   NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    sale_date      DATE           NOT NULL DEFAULT CURRENT_DATE,
    notes          TEXT,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT now(),

    -- Invoice number unique per user
    CONSTRAINT sales_user_invoice_unique UNIQUE (user_id, invoice_number)
);

COMMENT ON TABLE  public.sales IS 'Sales transaction header — one per sale to a customer.';
COMMENT ON COLUMN public.sales.user_id        IS 'User who created the sale.';
COMMENT ON COLUMN public.sales.customer_id    IS 'FK to customers.id — restricted delete (protect history).';
COMMENT ON COLUMN public.sales.invoice_number IS 'Human-readable invoice ID. Unique per user.';
COMMENT ON COLUMN public.sales.status         IS 'Enum: pending | completed | cancelled.';
COMMENT ON COLUMN public.sales.total_amount   IS 'Sum of sale_items.total_price. Stored for performance.';
COMMENT ON COLUMN public.sales.sale_date      IS 'Date of the sale transaction (not necessarily created_at).';

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLE: public.sale_items
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sale_items (
    id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id     UUID           NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    product_id  UUID           NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity    INTEGER        NOT NULL CHECK (quantity > 0),
    unit_price  NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0),
    created_at  TIMESTAMPTZ    NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.sale_items IS 'Line items for a sale order.';
COMMENT ON COLUMN public.sale_items.sale_id     IS 'FK to sales.id — cascades on delete.';
COMMENT ON COLUMN public.sale_items.product_id  IS 'FK to products.id — restricted delete (protect history).';
COMMENT ON COLUMN public.sale_items.quantity    IS 'Units sold. Must be > 0.';
COMMENT ON COLUMN public.sale_items.unit_price  IS 'Selling price per unit at sale time (historical snapshot).';
COMMENT ON COLUMN public.sale_items.total_price IS 'quantity × unit_price. Stored denormalized for reports.';

-- ──────────────────────────────────────────────────────────────────────────────
-- TRIGGER: auto updated_at on sales
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TRIGGER set_sales_updated_at
    BEFORE UPDATE ON public.sales
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ──────────────────────────────────────────────────────────────────────────────
-- INDEXES: sales + sale_items
-- ──────────────────────────────────────────────────────────────────────────────

CREATE INDEX idx_sales_user_id      ON public.sales(user_id);
CREATE INDEX idx_sales_customer_id  ON public.sales(customer_id);
CREATE INDEX idx_sales_status       ON public.sales(status);
CREATE INDEX idx_sales_sale_date    ON public.sales(sale_date DESC);

CREATE INDEX idx_sale_items_sale_id    ON public.sale_items(sale_id);
CREATE INDEX idx_sale_items_product_id ON public.sale_items(product_id);

-- ──────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY: sales
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sales_select_own"
    ON public.sales FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "sales_insert_own"
    ON public.sales FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sales_update_own"
    ON public.sales FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sales_delete_own"
    ON public.sales FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY: sale_items
-- Child table — ownership checked via parent sales.user_id JOIN
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sale_items_select_via_sale"
    ON public.sale_items FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.sales s
            WHERE s.id      = sale_items.sale_id
              AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "sale_items_insert_via_sale"
    ON public.sale_items FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.sales s
            WHERE s.id      = sale_items.sale_id
              AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "sale_items_update_via_sale"
    ON public.sale_items FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.sales s
            WHERE s.id      = sale_items.sale_id
              AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "sale_items_delete_via_sale"
    ON public.sale_items FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.sales s
            WHERE s.id      = sale_items.sale_id
              AND s.user_id = auth.uid()
        )
    );

-- ──────────────────────────────────────────────────────────────────────────────
-- INVENTORY TRIGGER: decrease stock on sale completion
-- With stock validation — raises error if stock is insufficient.
-- ──────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.decrease_stock_on_sale_complete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_item        RECORD;
    v_stock       INTEGER;
    v_product_name TEXT;
BEGIN
    -- Only act when status transitions TO 'completed'
    IF NEW.status = 'completed' AND OLD.status <> 'completed' THEN

        -- ── Step 1: Validate all items have sufficient stock ──────────────────
        FOR v_item IN
            SELECT si.product_id, si.quantity, p.stock_quantity, p.name
            FROM   public.sale_items    si
            JOIN   public.products      p  ON p.id = si.product_id
            WHERE  si.sale_id = NEW.id
        LOOP
            IF v_item.stock_quantity < v_item.quantity THEN
                RAISE EXCEPTION
                    'Insufficient stock for product "%". Available: %, Requested: %',
                    v_item.name, v_item.stock_quantity, v_item.quantity
                    USING ERRCODE = 'P0001';
            END IF;
        END LOOP;

        -- ── Step 2: Deduct stock (only runs if all validations passed) ────────
        UPDATE public.products p
        SET
            stock_quantity = p.stock_quantity - si.quantity,
            updated_at     = now()
        FROM public.sale_items si
        WHERE si.sale_id  = NEW.id
          AND p.id        = si.product_id;

    END IF;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.decrease_stock_on_sale_complete() IS
    'Trigger: validates stock availability then decreases stock_quantity when a sale is completed. Raises P0001 on insufficient stock.';

-- Attach trigger — fires on status column update
CREATE TRIGGER on_sale_completed
    AFTER UPDATE OF status ON public.sales
    FOR EACH ROW
    EXECUTE FUNCTION public.decrease_stock_on_sale_complete();
