<?php

namespace App\Http\Controllers;

use App\Models\SupplyInvoice;
use App\Models\SupplyInvoiceDetail;
use App\Models\Supplier;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ownerPembelianSupply extends Controller
{
    public function index(Request $request)
    {
        // Get start and end dates from request
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $search = $request->input('search');
        
        // Query base
        $query = SupplyInvoice::with('supply_invoice_details');
        
        // Apply date filters if provided
        if ($startDate) {
            $query->whereDate('SupplyDate', '>=', $startDate);
        }
        
        if ($endDate) {
            $query->whereDate('SupplyDate', '<=', $endDate);
        }
        
        // Apply search filter if provided
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('SupplyInvoiceNumber', 'LIKE', "%{$search}%")
                  ->orWhere('SupplierName', 'LIKE', "%{$search}%");
            });
        }
        
        // Get results
        $invoices = $query->orderBy('SupplyDate', 'desc')->get();
        
        // Transform data for frontend
        $pembelianSupplyData = $invoices->map(function($invoice) {
            // Calculate total price from details
            $totalPrice = $invoice->supply_invoice_details->sum('FinalPrice');
            
            // Transform details
            $detailPesanan = $invoice->supply_invoice_details->map(function($detail) {
                return [
                    'nama_produk' => $detail->ProductName,
                    'harga' => $detail->SupplyPrice,
                    'jumlah' => $detail->Quantity,
                    'diskon' => $detail->discount,
                    'unit' => $detail->productUnit
                ];
            });
            
            return [
                'id_invoice' => $invoice->SupplyInvoiceId,
                'gambar_invoice' => $invoice->SupplyInvoiceImage ?? 'kwitansi.jpg', // Default image if null
                'nomor_invoice' => $invoice->SupplyInvoiceNumber,
                'nama_supplier' => $invoice->SupplierName,
                'jumlah_produk' => $invoice->supply_invoice_details->count(),
                'harga_total' => $totalPrice,
                'tanggal_invoice' => $invoice->SupplyDate,
                'detail_pesanan' => $detailPesanan
            ];
        });
        
        return Inertia::render('owner/owner-pembelian-supply', [
            'pembelianSupplyData' => $pembelianSupplyData,
            'filters' => [
                'startDate' => $startDate,
                'endDate' => $endDate,
                'search' => $search,
            ]
        ]);
    }

    public function create()
{
    $suppliers = Supplier::select('id', 'name')->get();

    return Inertia::render('owner/owner-tambah-pembelian-supply', [
        'suppliers' => $suppliers
    ]);
}

public function store(Request $request)
{
    $request->validate([
        'supplier_id' => 'required|exists:suppliers,id',
        'tanggal_supply' => 'required|date',
        'nomor_invoice' => 'required|string|max:255',
        'gambar_invoice' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'produk' => 'required|array|min:1',
        'produk.*.produk_id' => 'required|string',
        'produk.*.jumlah' => 'required|numeric|min:1',
        'produk.*.harga' => 'required|numeric|min:0',
        'produk.*.diskon' => 'nullable|string'
    ]);

    DB::beginTransaction();

    try {
        // Simpan gambar jika ada
        $gambarPath = null;
        if ($request->hasFile('gambar_invoice')) {
            $gambarPath = $request->file('gambar_invoice')->store('invoice-supply', 'public');
        }

        // Ambil nama supplier berdasarkan id
        $supplier = Supplier::findOrFail($request->supplier_id);

        // Simpan ke tabel SupplyInvoice
        $invoice = SupplyInvoice::create([
            'SupplierId' => $supplier->id,
            'SupplierName' => $supplier->name,
            'SupplyDate' => $request->tanggal_supply,
            'SupplyInvoiceNumber' => $request->nomor_invoice,
            'SupplyInvoiceImage' => $gambarPath,
        ]);

        // Simpan detail produk
        foreach ($request->produk as $produk) {
            $jumlah = floatval($produk['jumlah']);
            $harga = floatval($produk['harga']);
            $diskon = $produk['diskon'] ?? '';
            $finalPrice = $this->hitungDiskonBerlapis($harga, $jumlah, $diskon);

            SupplyInvoiceDetail::create([
                'SupplyInvoiceId' => $invoice->SupplyInvoiceId,
                'ProductName' => $produk['produk_id'], // jika perlu, ubah ke nama dari ID
                'Quantity' => $jumlah,
                'SupplyPrice' => $harga,
                'discount' => $diskon,
                'FinalPrice' => $finalPrice,
                'productUnit' => 'pcs', // default atau bisa ditambahkan ke input
            ]);
        }

        DB::commit();

        return redirect()->route('owner-pembelian-supply.index')->with('success', 'Data supply berhasil disimpan.');
    } catch (\Exception $e) {
        DB::rollBack();
        return back()->withErrors(['error' => 'Terjadi kesalahan saat menyimpan data.'])->withInput();
    }
}
}