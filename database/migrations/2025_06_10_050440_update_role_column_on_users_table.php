<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateRoleColumnOnUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Ubah ke ENUM jika belum
            $table->enum('role', ['owner', 'customer', 'cashier', 'blocked'])->default('customer')->change();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Rollback ke enum sebelumnya (ubah sesuai enum lama jika ada)
            $table->enum('role', ['owner', 'customer', 'cashier'])->default('customer')->change();
        });
    }
}

