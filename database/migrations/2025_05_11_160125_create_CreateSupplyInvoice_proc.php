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
        DB::unprepared("CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateSupplyInvoice`(IN `p_SupplierID` INT, IN `p_SupplyDate` DATE, IN `p_SupplyInvoiceNumber` VARCHAR(255), IN `p_InvoiceDetails` JSON, IN `p_SupplyInvoiceImage` TEXT)
BEGIN
    DECLARE v_SupplyInvoiceID INT;

    -- Temporary variables to process JSON details
    DECLARE item TEXT;
    DECLARE item_index INT DEFAULT 0;
    DECLARE item_count INT;

    -- Extract individual fields from each JSON item
    DECLARE v_ProductID INT;
    DECLARE v_ProductName VARCHAR(255);
    DECLARE v_Quantity INT;
    DECLARE v_ProductUnit VARCHAR(255);
    DECLARE v_SupplyPrice DECIMAL(10, 2);
    DECLARE v_Discount VARCHAR(255);
    DECLARE v_FirstDiscount DECIMAL(10, 2) DEFAULT 0;
    DECLARE v_SecondDiscount DECIMAL(10, 2) DEFAULT 0;
    DECLARE v_FinalPrice DECIMAL(10, 2);
    DECLARE v_SupplierName VARCHAR(255);

    -- Get supplier name
    SELECT SupplierName INTO v_SupplierName 
    FROM suppliers
    WHERE SupplierID = p_SupplierID;
    
    -- Insert the new supply invoice
    INSERT INTO supply_invoices (SupplierID, SupplierName, SupplyDate, SupplyInvoiceNumber, SupplyInvoiceImage)
    VALUES (p_SupplierID, v_SupplierName, p_SupplyDate, p_SupplyInvoiceNumber, p_SupplyInvoiceImage);

    -- Get the generated SupplyInvoiceID
    SET v_SupplyInvoiceID = LAST_INSERT_ID();

    -- Get the total number of items in the JSON array
    SET item_count = JSON_LENGTH(p_InvoiceDetails);

    -- Loop through each item in the JSON array
    WHILE item_index < item_count DO
        -- Extract the current JSON object
        SET item = JSON_EXTRACT(p_InvoiceDetails, CONCAT('$[', item_index, ']'));

        -- Extract specific fields from the JSON object
        SET v_ProductID = JSON_UNQUOTE(JSON_EXTRACT(item, '$.ProductID'));
        SET v_Quantity = JSON_UNQUOTE(JSON_EXTRACT(item, '$.Quantity'));
        SET v_SupplyPrice = JSON_UNQUOTE(JSON_EXTRACT(item, '$.SupplyPrice'));
        SET v_Discount = JSON_UNQUOTE(JSON_EXTRACT(item, '$.Discount'));

        -- Handle single or stacked discounts
        IF LOCATE('+', v_Discount) > 0 THEN
            -- Stacked discount (e.g., \"10+5\")
            SET v_FirstDiscount = CAST(SUBSTRING_INDEX(v_Discount, '+', 1) AS DECIMAL(10, 2));
            SET v_SecondDiscount = CAST(SUBSTRING_INDEX(v_Discount, '+', -1) AS DECIMAL(10, 2));
        ELSE
            -- Single discount (e.g., \"5\")
            SET v_FirstDiscount = CAST(v_Discount AS DECIMAL(10, 2));
            SET v_SecondDiscount = 0; -- No second discount
        END IF;

        -- Apply discounts sequentially
        SET v_FinalPrice = v_SupplyPrice - (v_SupplyPrice * (v_FirstDiscount / 100)); -- Apply first discount
        SET v_FinalPrice = v_FinalPrice - (v_FinalPrice * (v_SecondDiscount / 100)); -- Apply second discount

        -- Fetch ProductName and ProductUnit from the products table
        SELECT ProductName, productUnit INTO v_ProductName, v_ProductUnit 
        FROM products 
        WHERE ProductID = v_ProductID;

        -- Insert into supply_invoice_details table
        INSERT INTO supply_invoice_details (
            SupplyInvoiceID,
            ProductID,
            ProductName,
            Quantity,
            ProductUnit,
            SupplyPrice,
            Discount,
            FinalPrice
        )
        VALUES (
            v_SupplyInvoiceID,
            v_ProductID,
            v_ProductName,
            v_Quantity,
            v_ProductUnit,
            v_SupplyPrice,
            v_Discount,
            v_FinalPrice
        );

        -- Increment the index
        SET item_index = item_index + 1;
    END WHILE;
END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS CreateSupplyInvoice");
    }
};
