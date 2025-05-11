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
        Schema::create('invoicedetails', function (Blueprint $table) {
            $table->integer('DetailID', true);
            $table->integer('InvoiceID')->nullable()->index('invoiceid');
            $table->integer('ProductID');
            $table->string('productName');
            $table->text('productImage');
            $table->integer('Quantity');
            $table->string('productUnit');
            $table->string('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoicedetails');
    }
};
