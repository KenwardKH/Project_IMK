<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OwnerSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Owner',
            'email' => 'owner@gmail.com',
            'password' => Hash::make('admin123'), // Ganti dengan password yang aman
            'role' => 'owner',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
