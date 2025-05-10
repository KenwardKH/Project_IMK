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
        Schema::create('invoices', function (Blueprint $table) {
            $table->integer('InvoiceID', true);
            $table->integer('CustomerID')->nullable();
            $table->string('customerName');
            $table->string('customerContact');
            $table->dateTime('InvoiceDate');
            $table->enum('type', ['delivery', 'pickup'])->nullable();
            $table->string('payment_option');
            $table->integer('CashierID')->nullable();
            $table->string('CashierName')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
