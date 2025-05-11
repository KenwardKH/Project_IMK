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
        Schema::table('delivery_order_status', function (Blueprint $table) {
            $table->foreign(['invoice_id'])->references(['InvoiceID'])->on('invoices')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('delivery_order_status', function (Blueprint $table) {
            $table->dropForeign('delivery_order_status_invoice_id_foreign');
        });
    }
};
