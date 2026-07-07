-- =============================================================================
-- ERP Management System — Migration 008
-- Description: Trigger function to handle product stock increases on
--              direct insert of completed purchase items.
-- =============================================================================

-- Function: called when a new purchase item is inserted
CREATE OR REPLACE FUNCTION public.increase_stock_on_purchase_item_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER                   -- bypass RLS to update products
SET search_path = public
AS $$
DECLARE
    v_status TEXT;
BEGIN
    -- Retrieve parent purchase status
    SELECT status INTO v_status
    FROM public.purchases
    WHERE id = NEW.purchase_id;

    -- Only increase product stock if the purchase status is 'completed'
    IF v_status = 'completed' THEN
        UPDATE public.products
        SET
            stock_quantity = stock_quantity + NEW.quantity,
            updated_at     = now()
        WHERE id = NEW.product_id;
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.increase_stock_on_purchase_item_insert() IS
    'Trigger: when a purchase item is inserted, increases the product stock level if the parent purchase is already completed.';

-- Attach trigger
CREATE OR REPLACE TRIGGER on_purchase_item_inserted
    AFTER INSERT ON public.purchase_items
    FOR EACH ROW
    EXECUTE FUNCTION public.increase_stock_on_purchase_item_insert();
