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
                -- Update delivery orders using PaymentDeadline column
                UPDATE delivery_order_status dos
                JOIN invoices i ON dos.invoice_id = i.InvoiceID
                LEFT JOIN payments p ON i.InvoiceID = p.InvoiceID
                SET dos.status = 'dibatalkan'
                WHERE dos.status = 'menunggu pembayaran' 
                AND p.PaymentID IS NULL 
                AND i.PaymentDeadline < NOW();
                
                -- Update pickup orders using PaymentDeadline column
                UPDATE pickup_order_status pos
                JOIN invoices i ON pos.invoice_id = i.InvoiceID
                LEFT JOIN payments p ON i.InvoiceID = p.InvoiceID
                SET pos.status = 'dibatalkan'
                WHERE pos.status = 'menunggu pembayaran' 
                AND p.PaymentID IS NULL 
                AND i.PaymentDeadline < NOW();
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