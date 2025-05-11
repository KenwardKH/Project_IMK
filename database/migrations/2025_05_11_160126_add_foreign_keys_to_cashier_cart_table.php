<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cashier_cart', function (Blueprint $table) {
            $table->foreign(['CashierID'], 'cashier_cart _CashierID _foreign')->references(['id_kasir'])->on('kasir')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign(['ProductID'], 'cashier_cart _ProductID_foreign')->references(['ProductID'])->on('products')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cashier_cart', function (Blueprint $table) {
            $table->dropForeign('cashier_cart _CashierID _foreign');
            $table->dropForeign('cashier_cart _ProductID_foreign');
        });
    }
};
