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
        Schema::create('pricing_logs', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('ProductID');
            $table->decimal('OldPrice', 10);
            $table->decimal('NewPrice', 10);
            $table->dateTime('TimeChanged');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricing_logs');
    }
};
