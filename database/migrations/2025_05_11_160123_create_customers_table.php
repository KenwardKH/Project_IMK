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
        Schema::create('customers', function (Blueprint $table) {
            $table->integer('CustomerID', true);
            $table->unsignedBigInteger('user_id')->index('fk_user_customer')->nullable();
            $table->string('CustomerName');
            $table->string('CustomerAddress')->nullable();
            $table->string('CustomerContact', 50)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
