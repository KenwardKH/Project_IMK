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
        Schema::table('kasir', function (Blueprint $table) {
            $table->foreign(['user_id'], 'kasir_user _id_foreign')->references(['id'])->on('users')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kasir', function (Blueprint $table) {
            $table->dropForeign('kasir_user _id_foreign');
        });
    }
};
