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
        Schema::table('customer_cart', function (Blueprint $table) {
            $table->foreign(['CustomerID'], 'customer_cart_CustomerID_foreign')->references(['CustomerID'])->on('customers')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign(['ProductID'], 'customer_cart_ProductID_foreign')->references(['ProductID'])->on('products')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_cart', function (Blueprint $table) {
            $table->dropForeign('customer_cart_CustomerID_foreign');
            $table->dropForeign('customer_cart_ProductID_foreign');
        });
    }
};
