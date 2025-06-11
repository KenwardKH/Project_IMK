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
        // Query builder untuk OrderStatusLog
        $query = OrderStatusLog::query();
        $query->whereNotNull('cashier_name');   

        // Filter berdasarkan pencarian nama kasir
        if ($request->has('search') && !empty($request->input('search'))) {
            $search = $request->input('search');
            $query->where('cashier_name', 'like', "%$search%");
        }

        // Filter berdasarkan status (jika diperlukan)
        if ($request->has('status') && !empty($request->input('status'))) {
            $status = $request->input('status');
            $query->where('new_status', $status);
        }

        // Filter berdasarkan rentang tanggal
        if ($request->has('start_date') && $request->has('end_date') && 
            !empty($request->input('start_date')) && !empty($request->input('end_date'))) {
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');
            
            // Tambahkan waktu untuk memastikan pencarian sehari penuh
            $query->whereBetween('updated_at', [
                $startDate . ' 00:00:00',
                $endDate . ' 23:59:59'
            ]);
        }

        // Urutkan berdasarkan updated_at terbaru dan paginate
        $perPage = $request->input('per_page', 10); // Default 10 items per page
        $riwayatKasir = $query->orderBy('updated_at', 'desc')->paginate($perPage);

        // Transform data untuk setiap item di halaman saat ini
        $transformedData = $riwayatKasir->getCollection()->map(function ($riwayatKasir) {
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
            // Filter out null items
            return $item !== null && !empty($item['cashier_name']);
        });

        // Update collection dengan data yang sudah ditransform
        $riwayatKasir->setCollection($transformedData);

        // Append query parameters untuk pagination links
        $riwayatKasir->appends($request->query());

        return Inertia::render('owner/owner-riwayat-kasir', [
            'riwayatData' => [
                'current_page' => $riwayatKasir->currentPage(),
                'data' => $riwayatKasir->items(),
                'first_page_url' => $riwayatKasir->url(1),
                'from' => $riwayatKasir->firstItem(),
                'last_page' => $riwayatKasir->lastPage(),
                'last_page_url' => $riwayatKasir->url($riwayatKasir->lastPage()),
                'links' => $riwayatKasir->linkCollection()->toArray(),
                'next_page_url' => $riwayatKasir->nextPageUrl(),
                'path' => $riwayatKasir->path(),
                'per_page' => $riwayatKasir->perPage(),
                'prev_page_url' => $riwayatKasir->previousPageUrl(),
                'to' => $riwayatKasir->lastItem(),
                'total' => $riwayatKasir->total(),
            ],
            'filters' => [
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'search' => $request->search,
                'status' => $request->status,
                'per_page' => $perPage,
            ]
        ]);
    }
}