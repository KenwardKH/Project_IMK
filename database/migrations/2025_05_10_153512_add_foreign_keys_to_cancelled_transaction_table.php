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
        Schema::table('cancelled_transaction', function (Blueprint $table) {
            $table->foreign(['InvoiceId'], 'cancelled_InvoiceId_foreign')->references(['InvoiceID'])->on('invoices')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cancelled_transaction', function (Blueprint $table) {
            $table->dropForeign('cancelled_InvoiceId_foreign');
        });
    }
};
