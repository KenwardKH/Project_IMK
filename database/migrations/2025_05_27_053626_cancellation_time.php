<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cancellationtime', function (Blueprint $table) {
            $table->id();
            $table->float('paymentTime'); // In hours, e.g., 48.0
            $table->timestamps();
        });

        // Default value: 48 hours
        DB::table('cancellationtime')->insert([
            'paymentTime' => 48.0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cancellationtime');
    }
};
