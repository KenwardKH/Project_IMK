<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared("CREATE DEFINER=`root`@`localhost` PROCEDURE `ReturnStockOnCancellation`(IN `p_invoice_id` INT)
BEGIN
    DECLARE v_product_id INT;
    DECLARE v_quantity INT;

    -- Cursor to iterate through the items in the invoice
    DECLARE item_cursor CURSOR FOR
        SELECT ProductID, Quantity 
        FROM invoicedetails
        WHERE InvoiceID = p_invoice_id;

    -- Handler for the end of the cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_product_id = NULL;

    -- Open the cursor
    OPEN item_cursor;

    -- Loop through each item in the invoice
    read_loop: LOOP
        FETCH item_cursor INTO v_product_id, v_quantity;
        IF v_product_id IS NULL THEN
            LEAVE read_loop;
        END IF;

        -- Update the product's CurrentStock
        UPDATE products
        SET CurrentStock = CurrentStock + v_quantity
        WHERE ProductID = v_product_id;
    END LOOP;

    -- Close the cursor
    CLOSE item_cursor;
END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS ReturnStockOnCancellation");
    }
};
