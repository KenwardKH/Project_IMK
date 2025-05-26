<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create triggers for delivery_order_status table
        
        // Trigger 1: Return stock when delivery order is cancelled
        DB::unprepared("
            CREATE TRIGGER `ReturnStockOnCancelTrigger` 
            AFTER UPDATE ON `delivery_order_status`
            FOR EACH ROW 
            BEGIN
                IF NEW.status = 'dibatalkan' THEN
                    CALL ReturnStockOnCancellation(NEW.invoice_id);
                END IF;
            END
        ");

        // Trigger 2: Log delivery status changes on UPDATE
        DB::unprepared("
            CREATE TRIGGER `log_delivery_status_change` 
            AFTER UPDATE ON `delivery_order_status`
            FOR EACH ROW 
            BEGIN
                DECLARE cashierName VARCHAR(255);
                
                -- Fetch the cashier's name
                SELECT nama_kasir INTO cashierName
                FROM kasir
                WHERE id_kasir = NEW.updated_by;
                
                -- Insert log entry
                INSERT INTO order_status_logs (
                    invoice_id,
                    order_type,
                    previous_status,
                    new_status,
                    cashier_id,
                    cashier_name
                )
                VALUES (
                    NEW.invoice_id,
                    'delivery',
                    OLD.status,
                    NEW.status,
                    NEW.updated_by,
                    cashierName
                );
            END
        ");

        // Trigger 3: Log delivery status on INSERT (new status input)
        DB::unprepared("
            CREATE TRIGGER `new_delivery_status_input` 
            AFTER INSERT ON `delivery_order_status`
            FOR EACH ROW 
            BEGIN
                DECLARE cashierName VARCHAR(255);
                
                -- Fetch the cashier's name
                SELECT nama_kasir INTO cashierName
                FROM kasir
                WHERE id_kasir = NEW.updated_by;
                
                -- Insert log entry
                INSERT INTO order_status_logs (
                    invoice_id,
                    order_type,
                    previous_status,
                    new_status,
                    cashier_id,
                    cashier_name
                )
                VALUES (
                    NEW.invoice_id,
                    'delivery',
                    NULL,
                    NEW.status,
                    NEW.updated_by,
                    cashierName
                );
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the triggers in reverse order
        DB::unprepared("DROP TRIGGER IF EXISTS `new_delivery_status_input`");
        DB::unprepared("DROP TRIGGER IF EXISTS `log_delivery_status_change`");
        DB::unprepared("DROP TRIGGER IF EXISTS `ReturnStockOnCancelTrigger`");
    }
};