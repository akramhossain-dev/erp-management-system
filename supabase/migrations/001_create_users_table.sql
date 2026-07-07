-- =============================================================================
-- ERP Management System — Migration 001
-- Tables: users (profile extension)
-- Description: Creates the public.users table that mirrors auth.users (1:1).
--              Automatically populated via trigger when a new user signs up.
-- =============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLE: public.users
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
    id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT        NOT NULL DEFAULT '',
    email       TEXT        NOT NULL,
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.users IS 'ERP user profiles — extends Supabase auth.users (1:1).';
COMMENT ON COLUMN public.users.id         IS 'Mirrors auth.users.id — primary + foreign key.';
COMMENT ON COLUMN public.users.full_name  IS 'Display name of the user.';
COMMENT ON COLUMN public.users.email      IS 'Email synced from auth.users.email.';
COMMENT ON COLUMN public.users.avatar_url IS 'Optional profile picture URL.';

-- ──────────────────────────────────────────────────────────────────────────────
-- TRIGGER FUNCTION: update_updated_at_column
-- Automatically sets updated_at = now() on every row update.
-- Shared by all tables that carry an updated_at column.
-- ──────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.update_updated_at_column() IS
    'Generic trigger function: sets updated_at = now() before every UPDATE.';

-- Attach trigger to users table
CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ──────────────────────────────────────────────────────────────────────────────
-- TRIGGER FUNCTION: handle_new_user
-- Fires AFTER INSERT on auth.users.
-- Creates a matching row in public.users automatically on signup.
-- ──────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER                   -- runs as DB owner, needed to write public.users
SET search_path = public           -- security hardening: prevent search_path hijack
AS $$
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

COMMENT ON FUNCTION public.handle_new_user() IS
    'Trigger on auth.users INSERT: auto-creates matching public.users row.';

-- Attach trigger to auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ──────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY: users
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile
CREATE POLICY "users_select_own"
    ON public.users FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "users_update_own"
    ON public.users FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Insert is handled by SECURITY DEFINER trigger — no manual INSERT policy needed.
-- Delete is handled by auth.users CASCADE — no manual DELETE policy needed.
