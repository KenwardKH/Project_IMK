<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


class CreateAfterInvoicedetailsInsertTrigger extends Migration
{
    public function up(): void
    {
        DB::unprepared('
            CREATE TRIGGER `after_invoicedetails_insert`
            AFTER INSERT ON `invoicedetails`
            FOR EACH ROW
            BEGIN
                DECLARE unit_price DECIMAL(10, 2) DEFAULT 0.00;

                SET unit_price = NEW.price;

                IF unit_price IS NOT NULL THEN
                    IF EXISTS (
                        SELECT 1 FROM transaction_log
                        WHERE InvoiceID = NEW.InvoiceID
                    ) THEN
                        UPDATE transaction_log
                        SET TotalAmount = TotalAmount + (NEW.Quantity * unit_price)
                        WHERE InvoiceID = NEW.InvoiceID;
                    END IF;
                END IF;
            END
        ');
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS `after_invoicedetails_insert`');
    }
}