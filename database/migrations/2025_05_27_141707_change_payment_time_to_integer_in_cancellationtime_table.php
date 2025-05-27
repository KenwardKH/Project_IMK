<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('cancellationtime', function (Blueprint $table) {
            $table->integer('paymentTime')->change();
        });

        // Optional: convert existing TIME data if needed (skipped here)
    }

    public function down(): void
    {
        Schema::table('cancellationtime', function (Blueprint $table) {
            $table->time('paymentTime')->change();
        });
    }
};
