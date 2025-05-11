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
        Schema::create('cancelled_transaction', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('InvoiceId')->nullable()->index('cancelled_ibfk_1');
            $table->text('cancellation_reason')->nullable();
            $table->enum('cancelled_by', ['cashier', 'customer', 'system']);
            $table->dateTime('cancellation_date')->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cancelled_transaction');
    }
};
