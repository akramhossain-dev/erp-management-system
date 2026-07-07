-- =============================================================================
-- ERP Management System — Migration 007
-- Functions: Dashboard stats + helper utilities
-- Description: Server-side aggregation functions called via Supabase RPC.
--              Single round-trip replaces 6 separate count queries.
-- =============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- FUNCTION: get_dashboard_stats
-- Returns a single row of KPI counts for the authenticated user.
-- Called via: supabase.rpc('get_dashboard_stats')
-- ──────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE (
    total_products  BIGINT,
    total_customers BIGINT,
    total_suppliers BIGINT,
    total_purchases BIGINT,
    total_sales     BIGINT,
    total_revenue   NUMERIC
)
LANGUAGE sql
STABLE                             -- result is consistent within a single transaction
SECURITY DEFINER                   -- reads across tables; SECURITY DEFINER + explicit uid filter
SET search_path = public
AS $$
    SELECT
        (SELECT COUNT(*) FROM public.products   WHERE user_id = auth.uid())  AS total_products,
        (SELECT COUNT(*) FROM public.customers  WHERE user_id = auth.uid())  AS total_customers,
        (SELECT COUNT(*) FROM public.suppliers  WHERE user_id = auth.uid())  AS total_suppliers,
        (SELECT COUNT(*) FROM public.purchases  WHERE user_id = auth.uid())  AS total_purchases,
        (SELECT COUNT(*) FROM public.sales      WHERE user_id = auth.uid())  AS total_sales,
        (
            SELECT COALESCE(SUM(total_amount), 0)
            FROM   public.sales
            WHERE  user_id = auth.uid()
              AND  status  = 'completed'
        )                                                                     AS total_revenue;
$$;

COMMENT ON FUNCTION public.get_dashboard_stats() IS
    'RPC: returns KPI aggregates (counts + revenue) for the authenticated user in a single call.';

-- ──────────────────────────────────────────────────────────────────────────────
-- FUNCTION: generate_invoice_number
-- Generates a unique invoice number in format: INV-YYYYMMDD-NNNN
-- Called from the application before inserting a new sale.
-- ──────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_today      TEXT;
    v_count      INTEGER;
    v_invoice_no TEXT;
BEGIN
    v_today := to_char(CURRENT_DATE, 'YYYYMMDD');

    -- Count existing invoices for today for this user
    SELECT COUNT(*) + 1
    INTO   v_count
    FROM   public.sales
    WHERE  user_id        = auth.uid()
      AND  invoice_number LIKE 'INV-' || v_today || '-%';

    v_invoice_no := 'INV-' || v_today || '-' || LPAD(v_count::TEXT, 4, '0');

    RETURN v_invoice_no;
END;
$$;

COMMENT ON FUNCTION public.generate_invoice_number() IS
    'RPC: generates next invoice number in format INV-YYYYMMDD-NNNN for the authenticated user.';

-- ──────────────────────────────────────────────────────────────────────────────
-- FUNCTION: get_low_stock_products
-- Returns products where stock_quantity <= min_stock for the authenticated user.
-- Called via: supabase.rpc('get_low_stock_products')
-- ──────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_low_stock_products()
RETURNS TABLE (
    id               UUID,
    name             TEXT,
    sku              TEXT,
    category         TEXT,
    stock_quantity   INTEGER,
    min_stock        INTEGER,
    selling_price    NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        id,
        name,
        sku,
        category,
        stock_quantity,
        min_stock,
        selling_price
    FROM public.products
    WHERE user_id       = auth.uid()
      AND stock_quantity <= min_stock
    ORDER BY stock_quantity ASC;
$$;

COMMENT ON FUNCTION public.get_low_stock_products() IS
    'RPC: returns products where stock_quantity <= min_stock for the authenticated user.';
