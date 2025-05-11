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
        Schema::table('invoicedetails', function (Blueprint $table) {
            $table->foreign(['InvoiceID'], 'invoicedetails_InvoiceID_foreign')->references(['InvoiceID'])->on('invoices')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoicedetails', function (Blueprint $table) {
            $table->dropForeign('invoicedetails_InvoiceID_foreign');
        });
    }
};
