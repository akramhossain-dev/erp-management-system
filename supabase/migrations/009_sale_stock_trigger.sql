-- =============================================================================
-- ERP Management System — Migration 009
-- Description: Trigger function to handle product stock decreases and validations
--              on direct insert of completed sale items.
-- =============================================================================

-- Function: called when a new sale item is inserted
CREATE OR REPLACE FUNCTION public.decrease_stock_on_sale_item_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER                   -- bypass RLS to update products
SET search_path = public
AS $$
DECLARE
    v_status       TEXT;
    v_stock        INTEGER;
    v_product_name TEXT;
BEGIN
    -- Retrieve parent sale status
    SELECT status INTO v_status
    FROM public.sales
    WHERE id = NEW.sale_id;

    -- Only check stock and deduct if sale status is 'completed'
    IF v_status = 'completed' THEN
        -- Retrieve current stock level and name
        SELECT stock_quantity, name INTO v_stock, v_product_name
        FROM public.products
        WHERE id = NEW.product_id;

        -- Validate stock availability
        IF v_stock < NEW.quantity THEN
            RAISE EXCEPTION
                'Insufficient stock for product "%". Available: %, Requested: %',
                v_product_name, v_stock, NEW.quantity
                USING ERRCODE = 'P0001';
        END IF;

        -- Deduct stock level
        UPDATE public.products
        SET
            stock_quantity = stock_quantity - NEW.quantity,
            updated_at     = now()
        WHERE id = NEW.product_id;
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.decrease_stock_on_sale_item_insert() IS
    'Trigger: when a sale item is inserted, validates stock availability and decreases the product stock level if parent sale is completed. Throws P0001 if stock is insufficient.';

-- Attach trigger
CREATE OR REPLACE TRIGGER on_sale_item_inserted
    AFTER INSERT ON public.sale_items
    FOR EACH ROW
    EXECUTE FUNCTION public.decrease_stock_on_sale_item_insert();
