<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\PricingLog;

class CustomerDashboard extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get all products from database with proper field mappings
        $products = Product::select(
                'ProductID as id',
                'ProductName as nama_produk',
                'Description as deskripsi',
                'ProductUnit as satuan',
                'CurrentStock as stock',
                'ProductPrice as harga_jual',
                'image as gambar_produk'
            )
            ->get();

        // Pass the products and auth data to the LandingPage component
        return Inertia::render('LandingPage', [
            'products' => $products,
            'auth' => [
                'user' => auth()->user() ? [
                    'id' => auth()->user()->id,
                    'name' => auth()->user()->name,
                    'email' => auth()->user()->email,
                ] : null
            ]
        ]);
    }

    /**
     * Display a single product.
     */
    public function showProduct($id)
    {
        // Get the specific product by ID
        $product = Product::select(
                'ProductID as id',
                'ProductName as nama_produk',
                'Description as deskripsi',
                'ProductUnit as satuan',
                'CurrentStock as stock',
                'ProductPrice as harga_jual',
                'image as gambar_produk'
            )
            ->findOrFail($id);
            
        // Load price history for the product if PricingLog exists
        try {
            $priceHistory = PricingLog::where('ProductID', $product->id)
                ->select('LogID as id', 'NewPrice as harga', 'TimeChanged as tanggal')
                ->orderBy('TimeChanged', 'desc')
                ->limit(10)
                ->get();
                    
            $product->riwayat_harga = $priceHistory;
        } catch (\Exception $e) {
            // If PricingLog doesn't exist or there's an error, provide empty array
            $product->riwayat_harga = [];
        }

        // Render the product detail page with auth data
        return Inertia::render('customer/productDetail', [
            'product' => $product,
            'auth' => [
                'user' => auth()->user() ? [
                    'id' => auth()->user()->id,
                    'name' => auth()->user()->name,
                    'email' => auth()->user()->email,
                ] : null
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}