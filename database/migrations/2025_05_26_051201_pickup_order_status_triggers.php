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
        // Create triggers for pickup_order_status table
        
        // Trigger 1: Return stock when pickup order is cancelled
        DB::unprepared("
            CREATE TRIGGER `ReturnStockOnPickupCancelTrigger` 
            AFTER UPDATE ON `pickup_order_status`
            FOR EACH ROW 
            BEGIN
                IF NEW.status = 'dibatalkan' THEN
                    CALL ReturnStockOnCancellation(NEW.invoice_id);
                END IF;
            END
        ");

        // Trigger 2: Log pickup status changes on UPDATE
        DB::unprepared("
            CREATE TRIGGER `log_pickup_status_change` 
            AFTER UPDATE ON `pickup_order_status`
            FOR EACH ROW 
            BEGIN
                DECLARE cashierName VARCHAR(255);
                
                SELECT nama_kasir INTO cashierName
                FROM kasir
                WHERE id_kasir = NEW.updated_by;
                
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
                    'pickup',
                    OLD.status,
                    NEW.status,
                    NEW.updated_by,
                    cashierName
                );
            END
        ");

        // Trigger 3: Log pickup status on INSERT (new status input)
        DB::unprepared("
            CREATE TRIGGER `new_pickup_status_input` 
            AFTER INSERT ON `pickup_order_status`
            FOR EACH ROW 
            BEGIN
                DECLARE cashierName VARCHAR(255);
                
                SELECT nama_kasir INTO cashierName
                FROM kasir
                WHERE id_kasir = NEW.updated_by;
                
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
                    'pickup',
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
        DB::unprepared("DROP TRIGGER IF EXISTS `new_pickup_status_input`");
        DB::unprepared("DROP TRIGGER IF EXISTS `log_pickup_status_change`");
        DB::unprepared("DROP TRIGGER IF EXISTS `ReturnStockOnPickupCancelTrigger`");
    }
};