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
        DB::unprepared("CREATE DEFINER=`root`@`localhost` PROCEDURE `AddInvoiceDetail`(IN `p_invoice_id` INT, IN `p_product_id` INT, IN `p_quantity` INT)
BEGIN
    DECLARE v_price DECIMAL(10,2);
    DECLARE v_product_name VARCHAR(255);
    DECLARE v_product_image TEXT;
    DECLARE v_product_unit VARCHAR(255);
    DECLARE v_productprice VARCHAR(255);

    -- Step 1: Look up the product name
    SELECT ProductName,image,productUnit,ProductPrice INTO v_product_name,v_product_image,v_product_unit,v_productprice
    FROM products
    WHERE ProductID = p_product_id;



    INSERT INTO invoicedetails (InvoiceID,ProductID, productName,productImage, Quantity, productUnit ,price)
    VALUES (p_invoice_id,p_product_id, v_product_name,v_product_image, p_quantity, v_product_unit, v_productprice);
END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS AddInvoiceDetail");
    }
};
