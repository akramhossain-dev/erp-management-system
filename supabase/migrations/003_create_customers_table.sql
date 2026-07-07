-- =============================================================================
-- ERP Management System — Migration 003
-- Table: customers
-- Description: Customer directory linked to sales transactions.
-- =============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLE: public.customers
-- ──────────────────────────────────────────────────────────────────────────────

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

    -- Validate email format when provided (allow NULL)
    CONSTRAINT customers_email_format CHECK (
        email IS NULL OR email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'
    )
);

COMMENT ON TABLE  public.customers IS 'Customer directory — linked to sales transactions.';
COMMENT ON COLUMN public.customers.user_id IS 'Owner of this customer record (auth.users FK).';
COMMENT ON COLUMN public.customers.email   IS 'Optional contact email. Validated by CHECK constraint.';
COMMENT ON COLUMN public.customers.notes   IS 'Internal notes about this customer.';

-- ──────────────────────────────────────────────────────────────────────────────
-- TRIGGER: auto-update updated_at on customers
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TRIGGER set_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ──────────────────────────────────────────────────────────────────────────────
-- INDEXES: customers
-- ──────────────────────────────────────────────────────────────────────────────

CREATE INDEX idx_customers_user_id ON public.customers(user_id);
CREATE INDEX idx_customers_name    ON public.customers(name);
CREATE INDEX idx_customers_phone   ON public.customers(phone);
CREATE INDEX idx_customers_email   ON public.customers(email);

-- ──────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY: customers
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers_select_own"
    ON public.customers FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "customers_insert_own"
    ON public.customers FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "customers_update_own"
    ON public.customers FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "customers_delete_own"
    ON public.customers FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
