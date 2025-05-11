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
        Schema::table('supply_invoice_details', function (Blueprint $table) {
            $table->foreign(['SupplyInvoiceId'], 'Supply _invoiceId _details _foreign')->references(['SupplyInvoiceId'])->on('supply_invoices')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('supply_invoice_details', function (Blueprint $table) {
            $table->dropForeign('Supply _invoiceId _details _foreign');
        });
    }
};
