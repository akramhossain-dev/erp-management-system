-- =============================================================================
-- ERP Management System — Migration 004
-- Table: suppliers
-- Description: Supplier directory linked to purchase transactions.
-- =============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLE: public.suppliers
-- ──────────────────────────────────────────────────────────────────────────────

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

    -- Validate email format when provided (allow NULL)
    CONSTRAINT suppliers_email_format CHECK (
        email IS NULL OR email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'
    )
);

COMMENT ON TABLE  public.suppliers IS 'Supplier directory — linked to purchase transactions.';
COMMENT ON COLUMN public.suppliers.user_id IS 'Owner of this supplier record (auth.users FK).';
COMMENT ON COLUMN public.suppliers.email   IS 'Optional contact email. Validated by CHECK constraint.';
COMMENT ON COLUMN public.suppliers.notes   IS 'Internal notes about this supplier.';

-- ──────────────────────────────────────────────────────────────────────────────
-- TRIGGER: auto-update updated_at on suppliers
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TRIGGER set_suppliers_updated_at
    BEFORE UPDATE ON public.suppliers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ──────────────────────────────────────────────────────────────────────────────
-- INDEXES: suppliers
-- ──────────────────────────────────────────────────────────────────────────────

CREATE INDEX idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX idx_suppliers_name    ON public.suppliers(name);
CREATE INDEX idx_suppliers_phone   ON public.suppliers(phone);

-- ──────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY: suppliers
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "suppliers_select_own"
    ON public.suppliers FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "suppliers_insert_own"
    ON public.suppliers FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "suppliers_update_own"
    ON public.suppliers FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "suppliers_delete_own"
    ON public.suppliers FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
