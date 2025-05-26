<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TransactionList;
use App\Models\Invoice;
use App\Models\InvoiceDetail;

class OwnerTransaksiController extends Controller
{
    public function index(Request $request)
    {
        // Optional: Filtering berdasarkan nama pelanggan, kasir, atau tanggal
        $query = TransactionList::query();

        if ($request->has('search') && !empty($request->input('search'))) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('CustomerName', 'like', "%$search%")
                ->orWhere('CashierName', 'like', "%$search%");
            });
        }

        if ($request->has('status') && !empty($request->input('status'))) {
            $status = $request->input('status');
            $query->where('OrderStatus', $status);
        }

        if ($request->has('start_date') && $request->has('end_date') && 
            !empty($request->input('start_date')) && !empty($request->input('end_date'))) {
            $query->whereBetween('InvoiceDate', [
                $request->input('start_date'),
                $request->input('end_date')
            ]);
        }

        $riwayatTransaksi = $query->orderBy('InvoiceDate', 'desc')->get();

        // Debug: Log available statuses
        $availableStatuses = TransactionList::distinct()->pluck('OrderStatus')->filter()->values();
        \Log::info('Available Order Statuses:', $availableStatuses->toArray());

        // Tambahkan detail pesanan untuk setiap transaksi
        $riwayatTransaksi = $riwayatTransaksi->map(function ($transaksi) {
            // Ambil invoice berdasarkan InvoiceID
            $invoice = Invoice::where('InvoiceID', $transaksi->InvoiceID)->first();
            
            if ($invoice) {
                // Ambil detail invoice dari tabel invoicedetails
                $invoiceDetails = InvoiceDetail::where('InvoiceID', $invoice->InvoiceID)
                    ->get()
                    ->map(function ($detail) {
                        return [
                            'id' => $detail->DetailID,
                            'nama_produk' => $detail->productName,
                            'gambar_produk' => $detail->productImage,
                            'harga_produk' => (float) $detail->price,
                            'jumlah_produk' => $detail->Quantity,
                            'satuan_produk' => $detail->productUnit,
                            'subtotal' => (float) $detail->price * $detail->Quantity
                        ];
                    });
                
                $transaksi->pesananData = $invoiceDetails->toArray();
            } else {
                $transaksi->pesananData = [];
            }
            
            return $transaksi;
        });

        return Inertia::render('owner/owner-riwayat-transaksi', [
            'riwayatTransaksi' => $riwayatTransaksi,
            'availableStatuses' => $availableStatuses,
        ]);
    }
}