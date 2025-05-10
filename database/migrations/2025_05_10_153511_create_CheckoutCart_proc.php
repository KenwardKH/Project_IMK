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
        DB::unprepared("CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckoutCart`(IN `p_customer_id` INT, IN `p_shipping_option` VARCHAR(50), IN `p_payment_option` VARCHAR(50), IN `p_alamat` VARCHAR(255))
    DETERMINISTIC
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE p_invoice_id INT;
    DECLARE c_product_id INT;
    DECLARE c_quantity INT;
    DECLARE v_current_stock INT;
    DECLARE cart_item_count INT;
    DECLARE cart_cursor CURSOR FOR 
        SELECT ProductID, Quantity FROM customer_cart WHERE CustomerID = p_customer_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Step 0: Check if the cart is empty
    SELECT COUNT(*) INTO cart_item_count 
    FROM customer_cart 
    WHERE CustomerID = p_customer_id;
    
    IF cart_item_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Cart not found or is empty for the given customer.';
    END IF;

    -- Start the transaction
    START TRANSACTION;

    -- Step 1: Create a new invoice
    INSERT INTO invoices (CustomerID, customerName, customerContact, InvoiceDate, type, payment_option)
    SELECT 
    	p_customer_id,
        CustomerName, 
        CustomerContact, 
        NOW(), 
        IF(p_shipping_option = 'diantar', 'delivery', 'pickup'),
        p_payment_option
    FROM customers 
    WHERE CustomerID = p_customer_id;
    SET p_invoice_id = LAST_INSERT_ID();

    -- Step 2: Initialize cursor to retrieve cart items
    OPEN cart_cursor;

    read_loop: LOOP
        FETCH cart_cursor INTO c_product_id, c_quantity;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Step 3: Check current stock for the product
        SELECT CurrentStock INTO v_current_stock
        FROM products
        WHERE ProductID = c_product_id;

        -- If stock is insufficient, rollback and exit
        IF v_current_stock < c_quantity THEN
            ROLLBACK;
        END IF;

        -- Step 4: Add item to invoicedetails using AddInvoiceDetail procedure
        CALL AddInvoiceDetail(p_invoice_id, c_product_id, c_quantity);

        -- Step 5: Update the stock after adding to invoicedetails
        UPDATE products 
        SET CurrentStock = CurrentStock - c_quantity
        WHERE ProductID = c_product_id;
    END LOOP;

    -- Step 6: Clear customer cart after successful addition of all items to invoice details
    DELETE FROM customer_cart WHERE CustomerID = p_customer_id;

    -- Step 7: Insert into the appropriate status table
    IF p_shipping_option = 'diantar' THEN
    	INSERT INTO delivery_order_status (invoice_id, status, alamat, created_at, updated_at)
        VALUES (p_invoice_id, 'menunggu pembayaran', p_alamat, NOW(), NOW());
           
    ELSE
      	INSERT INTO pickup_order_status (invoice_id, status, created_at, updated_at)
        VALUES (p_invoice_id, 'menunggu pembayaran', NOW(), NOW());
       
    END IF;

    -- Commit the transaction
    COMMIT;

    -- Close the cursor
    CLOSE cart_cursor;

END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS CheckoutCart");
    }
};
