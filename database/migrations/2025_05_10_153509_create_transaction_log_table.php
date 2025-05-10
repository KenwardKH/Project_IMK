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
        Schema::create('transaction_log', function (Blueprint $table) {
            $table->integer('TransactionID', true);
            $table->integer('InvoiceID')->nullable()->index('invoiceid');
            $table->integer('CustomerID')->nullable();
            $table->string('customerName');
            $table->string('customerContact', 50);
            $table->decimal('TotalAmount', 10)->nullable()->default(0);
            $table->timestamp('TransactionDate')->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_log');
    }
};
