<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Supplier;

class ownerSupplier extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $suppliers = Supplier::all();

        return Inertia::render('owner/owner-supplier',[
            'suppliers' => $suppliers
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
        $request->validate([
            'SupplierName' => 'required|string|max:255',
            'SupplierContact' => 'required|string|max:20',
            'SupplierAddress' => 'required|string|max:255',
        ]);

        Supplier::create([
            'SupplierName' => $request->SupplierName,
            'SupplierContact' => $request->SupplierContact,
            'SupplierAddress' => $request->SupplierAddress,
        ]);

        return redirect()->route('owner-supplier.index')->with('success', 'Supplier berhasil ditambahkan.');
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
    public function edit($id)
    {
        $supplier = Supplier::findOrFail($id);

        return Inertia::render('owner/owner-edit-supplier', [
            'supplier' => $supplier,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'SupplierName' => 'required|string|max:255',
            'SupplierContact' => 'required|string|max:20',
            'SupplierAddress' => 'required|string|max:255',
        ]);

        $supplier = Supplier::findOrFail($id);
        $supplier->SupplierName = $request->SupplierName;
        $supplier->SupplierContact = $request->SupplierContact;
        $supplier->SupplierAddress = $request->SupplierAddress;
        $supplier->save();

        return redirect()->route('owner-supplier.index')->with('success', 'Supplier berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();

        return redirect()->route('owner-supplier.index')->with('success', 'Supplier berhasil dihapus.');
    }

}
