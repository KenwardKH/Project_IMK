<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAfterInvoiceInsertTrigger extends Migration
{
    public function up(): void
    {
        DB::unprepared('
            CREATE TRIGGER after_invoice_insert
            AFTER INSERT ON invoices
            FOR EACH ROW
            BEGIN
                INSERT INTO transaction_log (
                    InvoiceID,
                    CustomerID,
                    CustomerName,
                    customerContact,
                    TotalAmount,
                    TransactionDate
                ) VALUES (
                    NEW.InvoiceID,
                    NEW.CustomerID,
                    NEW.CustomerName,
                    NEW.CustomerContact,
                    0.00,
                    NOW()
                );
            END
        ');
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS after_invoice_insert');
    }
}