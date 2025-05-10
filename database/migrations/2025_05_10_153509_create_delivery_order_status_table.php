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
        Schema::create('delivery_order_status', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('invoice_id')->index('invoice_id');
            $table->enum('status', ['menunggu pembayaran', 'diproses', 'diantar', 'selesai', 'dibatalkan']);
            $table->string('alamat');
            $table->timestamp('updated_at')->useCurrentOnUpdate()->nullable()->useCurrent();
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->unsignedBigInteger('updated_by')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_order_status');
    }
};
