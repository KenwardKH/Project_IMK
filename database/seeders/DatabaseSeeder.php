<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Customer;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

// Membuat 1 user dulu
$user = User::factory()->create([
    'name' => 'Test User',
    'email' => 'test@example.com',
]);

        // Mengisi tabel customer berdasarkan user yang barusan dibuat
Customer::create([
    'user_id' => $user->id,
    'CustomerName' => $user->name,
    'CustomerAddress' => 'Jl. Contoh No.123, Jakarta',
    'CustomerContact' => '081234567890',
]);
                // Isi 10 data produk langsung
                for ($i = 1; $i <= 10; $i++) {
                    Product::create([
                        'ProductName'   => 'Produk ' . $i,
                        'Description'     => 'Deskripsi produk ke-' . $i,
                        'ProductUnit'        => 'pcs',
                        'CurrentStock'         => rand(10, 100),
                        'ProductPrice'    => rand(10000, 50000),
                    'image' => 'images/onic-esport.jpg',

                    ]);
                }



    }
}
