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
        Schema::create('cancellationtime', function (Blueprint $table) {
            $table->id();
            $table->time('paymentTime');
            $table->timestamps(); // Optional: adds created_at and updated_at
        });

        // Insert default data
        DB::table('cancellationtime')->insert([
            'paymentTime' => '22:00:00',
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