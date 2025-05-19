<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class ownerProduct extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::select([
                'ProductID as id',
                'ProductName as nama_produk',
                'Description as deskripsi',
                'ProductUnit as satuan',
                'CurrentStock as stock',
                'ProductPrice as harga_jual',
                'image as gambar_produk',
            ])
            // ->with(['priceHistory']) // optional jika ada relasi harga
            ->get();

        return Inertia::render('owner/owner-produk', [
            'products' => $products
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
        $validated = $request->validate([
            'nama_produk' => 'required|string|max:255',
            'harga_jual' => 'required|numeric',
            'satuan' => 'required|string|max:50',
            'deskripsi' => 'nullable|string',
            'gambar_produk' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('gambar_produk')) {
            $imagePath = $request->file('gambar_produk')->store('products', 'public');
        }

        Product::create([
            'ProductName' => $validated['nama_produk'],
            'ProductPrice' => $validated['harga_jual'],
            'ProductUnit' => $validated['satuan'],
            'Description' => $validated['deskripsi'],
            'image' => $imagePath,
            'CurrentStock' => 0,
        ]);

        return redirect()->route('owner.produk.index')->with('success', 'Produk berhasil ditambahkan');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    public function edit($id)
    {
        $product = Product::findOrFail($id);

        return Inertia::render('owner/owner-editproduk', [
            'product' => [
                'id' => $product->ProductID,
                'nama' => $product->ProductName,
                'harga' => $product->ProductPrice,
                'satuan' => $product->ProductUnit,
                'deskripsi' => $product->Description,
                'gambar' => $product->image,
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'harga' => 'required|numeric',
            'satuan' => 'required|string|max:50',
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|image|max:2048',
        ]);

        $product = Product::findOrFail($id);
        $product->ProductName = $request->nama;
        $product->ProductPrice = $request->harga;
        $product->ProductUnit = $request->satuan;
        $product->Description = $request->deskripsi;

        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika ada
            if ($product->image && \Storage::disk('public')->exists($product->image)) {
                \Storage::disk('public')->delete($product->image);
            }

            // Simpan gambar baru
            $path = $request->file('gambar')->store('products', 'public');
            $product->image = $path;
        } elseif ($request->gambar === null) {
            // Gambar dihapus oleh user
            if ($product->image && \Storage::disk('public')->exists($product->image)) {
                \Storage::disk('public')->delete($product->image);
            }

            $product->image = null;
        }


        $product->save();

        return redirect()->route('owner.produk.index')->with('success', 'Produk berhasil diperbarui.');
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Hapus gambar jika ada
        if ($product->image && \Storage::disk('public')->exists($product->image)) {
            \Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus.');
    }

}
