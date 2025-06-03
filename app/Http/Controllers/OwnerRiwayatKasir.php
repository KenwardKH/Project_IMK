<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\OrderStatusLog;
use App\Models\Invoice;
use App\Models\InvoiceDetail;

class OwnerRiwayatKasir extends Controller
{
    public function index(Request $request)
    {
        // Optional: Filtering berdasarkan nama pelanggan, kasir, atau tanggal
        $query = OrderStatusLog::query();
        $query->whereNotNull('cashier_name');   

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
            $query->whereBetween('updated_at', [
                $request->input('start_date'),
                $request->input('end_date')
            ]);
        }

        $riwayatKasir = $query->orderBy('updated_at', 'desc')->get();

        // Transform data to match frontend structure
        $transformedData = $riwayatKasir->map(function ($riwayatKasir) {
        $invoice = Invoice::with('invoicedetails')->find($riwayatKasir->invoice_id);

        if (!$invoice) return null;

        $pesananData = $invoice->invoicedetails->map(function ($detail) {
            return [
                'gambar_produk' => $detail->productImage ?? '',
                'nama_produk' => $detail->productName,
                'harga_produk' => (float) $detail->price,
                'jumlah_produk' => $detail->Quantity,
                'satuan_produk' => $detail->productUnit,
                'subtotal' => $detail->price * $detail->Quantity,
            ];
        });

        return [
            'id' => $riwayatKasir->id,
            'invoice_id' => $riwayatKasir->invoice_id,
            'order_type' => $riwayatKasir->order_type,
            'previous_status' => $riwayatKasir->previous_status ?? '-',
            'new_status' => $riwayatKasir->new_status,
            'cashier_name' => $riwayatKasir->cashier_name ?? 'Unknown',
            'updated_at' => $riwayatKasir->updated_at,
            'pemesanData' => [[
                'nama_pemesan' => $invoice->customerName ?? 'Tidak diketahui',
                'kontak_pemesan' => $invoice->customerContact ?? 'Tidak diketahui',
                'pesananData' => $pesananData->toArray(),
            ]],
        ];
    })->filter(function ($item) {
        // Hanya ambil data dengan nama kasir yang valid
        return !empty($item['cashier_name']);
    });


        return Inertia::render('owner/owner-riwayat-kasir', [
            'riwayatData' => $transformedData,
            'filters' => [
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'search' => $request->search,
                'status' => $request->status,
            ]
        ]);
    }

}