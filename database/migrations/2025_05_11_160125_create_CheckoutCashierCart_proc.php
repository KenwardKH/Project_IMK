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
        DB::unprepared("CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckoutCashierCart`(IN `p_cashier_id` INT, IN `p_customer_id` VARCHAR(255), IN `p_customer_name` VARCHAR(255), IN `p_customer_contact` VARCHAR(50), IN `p_shipping_option` ENUM('diantar','pickup'), IN `p_payment_option` ENUM('tunai','transfer'), IN `p_alamat` VARCHAR(255))
BEGIN

    DECLARE done INT DEFAULT FALSE;
    DECLARE p_invoice_id INT;
    DECLARE c_product_id INT;
    DECLARE c_quantity INT;
    DECLARE v_current_stock INT;
    DECLARE cart_item_count INT;
    DECLARE v_customer_name VARCHAR(255);
    DECLARE v_customer_contact VARCHAR(50);
    DECLARE v_cashier_name VARCHAR(255);
    DECLARE cart_cursor CURSOR FOR
        SELECT ProductID, Quantity FROM cashier_cart WHERE CashierID = p_cashier_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Step 0: Check if the cart is empty
    SELECT COUNT(*) INTO cart_item_count
    FROM cashier_cart
    WHERE CashierID = p_cashier_id;

    IF cart_item_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Cart not found or is empty for the given cashier.';
    END IF;

    IF p_customer_id = '' OR p_customer_id IS NULL THEN
        SET p_customer_id = NULL;
    END IF;

    -- Step 1: Determine customer details
    IF p_customer_id IS NOT NULL THEN
        -- Fetch customer details from the customers table
        SELECT CustomerName, CustomerContact
        INTO v_customer_name, v_customer_contact
        FROM customers
        WHERE CustomerID = p_customer_id;

        IF v_customer_name IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Customer not found.';
        END IF;
    ELSE
        -- Use provided customer details
        SET v_customer_name = p_customer_name;
        SET v_customer_contact = p_customer_contact;
    END IF;

    -- Step 2: Fetch cashier name (optional, as this is an offline transaction)
    IF p_cashier_id IS NOT NULL THEN
        SELECT nama_kasir INTO v_cashier_name
        FROM kasir
        WHERE id_kasir = p_cashier_id;

        IF v_cashier_name IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Cashier not found.';
        END IF;
    ELSE
        SET v_cashier_name = NULL;
    END IF;

    -- Start the transaction
    START TRANSACTION;

    -- Step 3: Create a new invoice
    INSERT INTO invoices (
        CustomerID, customerName, customerContact, InvoiceDate, type, payment_option, CashierID, CashierName
    )
    VALUES (
        p_customer_id, -- Nullable customer ID
        v_customer_name,
        v_customer_contact,
        NOW(),
        IF(p_shipping_option = 'diantar', 'delivery', 'pickup'),
        p_payment_option,
        p_cashier_id, -- Nullable cashier ID
        v_cashier_name -- Nullable cashier name
    );
    SET p_invoice_id = LAST_INSERT_ID();

    -- Step 4: Initialize cursor to retrieve cart items
    OPEN cart_cursor;

    read_loop: LOOP
        FETCH cart_cursor INTO c_product_id, c_quantity;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Step 5: Check current stock for the product
        SELECT CurrentStock INTO v_current_stock
        FROM products
        WHERE ProductID = c_product_id;

        -- If stock is insufficient, rollback and exit
        IF v_current_stock < c_quantity THEN
            ROLLBACK;
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Insufficient stock for a product.';
        END IF;

        -- Step 6: Add item to invoicedetails using AddInvoiceDetail procedure
        CALL AddInvoiceDetail(p_invoice_id, c_product_id, c_quantity);

        -- Step 7: Update the stock after adding to invoicedetails
        UPDATE products
        SET CurrentStock = CurrentStock - c_quantity
        WHERE ProductID = c_product_id;
    END LOOP;

    -- Step 8: Clear cashier cart after successful addition of all items to invoice details
    DELETE FROM cashier_cart WHERE CashierID = p_cashier_id;

    -- Step 9: Insert into the appropriate status table
    IF p_shipping_option = 'diantar' THEN
        INSERT INTO delivery_order_status (invoice_id, status, alamat, created_at, updated_at,updated_by)
      	VALUES (p_invoice_id, 'diproses', p_alamat, NOW(), NOW(),p_cashier_id);
    ELSE
       	INSERT INTO pickup_order_status (invoice_id, status, created_at, updated_at,updated_by)
        VALUES (p_invoice_id, 'selesai', NOW(), NOW(),p_cashier_id);
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
        DB::unprepared("DROP PROCEDURE IF EXISTS CheckoutCashierCart");
    }
};
