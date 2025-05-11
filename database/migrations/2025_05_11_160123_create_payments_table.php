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
        Schema::create('payments', function (Blueprint $table) {
            $table->integer('PaymentID', true);
            $table->integer('InvoiceID')->nullable()->index('invoiceid');
            $table->dateTime('PaymentDate');
            $table->decimal('AmountPaid', 10);
            $table->text('PaymentImage')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
