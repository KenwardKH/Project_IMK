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
        Schema::create('pickup_order_status', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('invoice_id')->index('invoice_id');
            $table->enum('status', ['menunggu pembayaran', 'diproses', 'menunggu pengambilan', 'menunggu konfirmasi', 'selesai', 'dibatalkan']);
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
        Schema::dropIfExists('pickup_order_status');
    }
};
