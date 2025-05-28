<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateProductPriceTriggers extends Migration
{
    public function up()
    {
        DB::unprepared('
            CREATE TRIGGER before_update_product_price
            BEFORE UPDATE ON products
            FOR EACH ROW
            BEGIN
                IF NEW.ProductPrice != OLD.ProductPrice THEN
                    INSERT INTO pricing_logs (ProductID, OldPrice, NewPrice, TimeChanged)
                    VALUES (OLD.ProductID, OLD.ProductPrice, NEW.ProductPrice, NOW());
                END IF;
            END
        ');

        DB::unprepared('
            CREATE TRIGGER before_insert_new_stock
            AFTER INSERT ON products
            FOR EACH ROW
            BEGIN
                INSERT INTO pricing_logs (ProductID, OldPrice, NewPrice, TimeChanged)
                VALUES (NEW.ProductID, 0, NEW.ProductPrice, NOW());
            END
        ');
    }

    public function down()
    {
        DB::unprepared('DROP TRIGGER IF EXISTS before_update_product_price');
        DB::unprepared('DROP TRIGGER IF EXISTS before_insert_new_stock');
    }
}

