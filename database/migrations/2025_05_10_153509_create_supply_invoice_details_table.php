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
        Schema::create('supply_invoice_details', function (Blueprint $table) {
            $table->integer('SupplyInvoiceDetailId', true);
            $table->integer('SupplyInvoiceId')->index('supply_invoice_details_ibfk_1');
            $table->integer('ProductID')->nullable()->index('productid');
            $table->string('ProductName');
            $table->integer('Quantity');
            $table->string('productUnit');
            $table->decimal('SupplyPrice', 10);
            $table->string('discount', 50)->default('0');
            $table->decimal('FinalPrice', 10);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supply_invoice_details');
    }
};
