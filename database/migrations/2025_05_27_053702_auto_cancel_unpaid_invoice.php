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
        // Create the MySQL event for auto-canceling unpaid invoices
        DB::unprepared("
            CREATE EVENT IF NOT EXISTS `AutoCancelUnpaidInvoices` 
            ON SCHEDULE EVERY 1 MINUTE 
            STARTS '2025-05-25 00:00:00' 
            ON COMPLETION NOT PRESERVE 
            ENABLE 
            DO BEGIN
                DECLARE timeout_hours DECIMAL(5,2) DEFAULT 48.0;
                
                -- Get timeout from cancellationtime table (direct float/decimal value)
                SELECT COALESCE(paymentTime, 48.0) INTO timeout_hours 
                FROM cancellationtime 
                ORDER BY id DESC 
                LIMIT 1;
                
                -- Update delivery orders
                UPDATE delivery_order_status dos
                JOIN invoices i ON dos.invoice_id = i.InvoiceID
                LEFT JOIN payments p ON i.InvoiceID = p.InvoiceID
                SET dos.status = 'dibatalkan'
                WHERE dos.status = 'menunggu pembayaran' 
                  AND p.PaymentID IS NULL 
                  AND i.InvoiceDate < NOW() - INTERVAL timeout_hours HOUR;
                  
                -- Update pickup orders  
                UPDATE pickup_order_status pos
                JOIN invoices i ON pos.invoice_id = i.InvoiceID
                LEFT JOIN payments p ON i.InvoiceID = p.InvoiceID
                SET pos.status = 'dibatalkan'
                WHERE pos.status = 'menunggu pembayaran' 
                  AND p.PaymentID IS NULL 
                  AND i.InvoiceDate < NOW() - INTERVAL timeout_hours HOUR;
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the MySQL event
        DB::unprepared("DROP EVENT IF EXISTS `AutoCancelUnpaidInvoices`");
    }
};