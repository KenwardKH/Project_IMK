<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\Invoicedetail;
use App\Models\DeliveryOrderStatus;
use App\Models\PickupOrderStatus;
use App\Models\CancellationTime;
use App\Models\CancelledTransaction;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ConfirmOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Invoice::select(
        'InvoiceID as id',
        'CustomerID as custid',
        'customerName as name',
        'customerContact as contact',
        'InvoiceDate as date',
        'type as type',
        'payment_option as payment',
        'CashierID as cid',
        'CashierName as cname',
        )
        ->paginate(100);

        //Memanggil data InvoiceDetail
        foreach ($orders as $order) {
        $details = Invoicedetail::where('InvoiceID', $order->id)
            ->select(
                'InvoiceID',
                'DetailID as id',
                'productName as name',
                'productImage as gambar',
                'Quantity as quantity',
                'productUnit as unit',
                'price'
            )
            ->limit(10)
            ->get()
            ->toArray();

        // Assign to key matching frontend interface
        $order->details = $details;
        }

        //Memanggil data Payment
        foreach ($orders as $order) {
        $payment = Payment::where('InvoiceID', $order->id)
            ->select(
                'InvoiceID',
                'PaymentID as id',
                'PaymentDate as date',
                'AmountPaid as amount',
                'PaymentImage as gambar',
            )
            ->limit(10)
            ->get()
            ->toArray();

        // Assign to key matching frontend interface
        $order->payments = $payment;
        }

        foreach ($orders as $order) {
            $pickupStatus = PickupOrderStatus::where('invoice_id', $order->id)
            ->select(
                'id',
                'invoice_id as invid',
                'status',
                'updated_at',
                'created_at',
                'updated_by'
            )
            ->get()
            ->toArray();
            $order->pickup = $pickupStatus;
        }

        foreach ($orders as $order) {
            $deliveryStatus = DeliveryOrderStatus::where('invoice_id', $order->id)
            ->select(
                'id',
                'invoice_id as invid',
                'status',
                'alamat',
                'updated_at',
                'created_at',
                'updated_by'
            )
            ->get()
            ->toArray();
            $order->delivery = $deliveryStatus;
        }

        $cancellations = CancellationTime::select(
            'id',
            'paymentTime',
            'created_at',
            'updated_at'
        )
        ->first();
        // dd($cancellations->paymentTime);

        return Inertia::render('cashier/ConfirmOrder', [
                'orders' => $orders,
                'cancellations' => $cancellations,
            ]);
    }

    public function confirmOrder(Request $request, $id)
    {
        // Ambil invoice beserta relasi pickup/delivery
        $invoice = Invoice::with(['pickup_order_statuses', 'delivery_order_statuses'])
            ->where('InvoiceID', $id)
            ->firstOrFail();

        // Optional: Jika kamu tetap ingin validasi agar hanya invoice yang memiliki customer yang valid
        if (!$invoice->CustomerID) {
            return redirect()->back()->withErrors('Invoice tidak memiliki CustomerID.');
        }

        // Tentukan tipe order
        $isPickup = $invoice->type === 'pickup' || $invoice->pickup_order_statuses->count() > 0;
        $isDelivery = $invoice->type === 'delivery' || $invoice->delivery_order_statuses->count() > 0;

        $user = Auth::user(); // Pastikan user ada, atau bisa gunakan user default
        $cashier = $user->kasirs;
        
        if ($isPickup) {
            $pickupStatus = PickupOrderStatus::where('invoice_id', $invoice->InvoiceID)->first();
            if ($pickupStatus) {
                $pickupStatus->update([
                    'status' => 'menunggu pengambilan',
                    'updated_by' => $cashier?->id_kasir ?? null,
                ]);
            }
        } elseif ($isDelivery) {
            $currentAddress = '';
            if ($invoice->delivery_order_statuses->count() > 0) {
                $latestDeliveryStatus = $invoice->delivery_order_statuses->sortByDesc('created_at')->first();
                $currentAddress = $latestDeliveryStatus->alamat ?? '';
            }

            $deliveryStatus = DeliveryOrderStatus::where('invoice_id', $invoice->InvoiceID)->first();
            if ($deliveryStatus) {
                $deliveryStatus->update([
                    'status' => 'diantar',
                    'alamat' => $currentAddress,
                    'updated_by' => $cashier?->id_kasir ?? null,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Pesanan berhasil dikonfirmasi.');
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
    public function storeCancelReason(Request $request)
    {
        $id = $request->input('id');
        $invoice = Invoice::with(['pickup_order_statuses', 'delivery_order_statuses'])
                    ->where('InvoiceID', $id)
                    ->firstOrFail();

        if (!$invoice->CustomerID) {
            return response()->json(['error' => 'Invoice tidak memiliki CustomerID.'], 422);
        }

        $isPickup = $invoice->type === 'pickup' || $invoice->pickup_order_statuses->count() > 0;
        $isDelivery = $invoice->type === 'delivery' || $invoice->delivery_order_statuses->count() > 0;

        $user = Auth::user(); // Pastikan user ada, atau bisa gunakan user default
        $cashier = $user->kasirs;

        $cancelled = CancelledTransaction::where('InvoiceId', $invoice->InvoiceID)->first();

        if ($cancelled) {
            // Update alasan pembatalan
            $cancelled->update([
                'cancellation_reason' => $request->input('cancellation_reason'),
                'cancelled_by' => $cashier->id_kasir,
                'cancellation_date' => now(),
            ]);
        } else {
            CancelledTransaction::create([
                'InvoiceId' => $invoice->InvoiceID,
                'cancellation_reason' => $request->input('cancellation_reason'),
                'cancelled_by' => $cashier->id_kasir,
                'cancellation_date' => now(),
            ]);
        }

        if ($isPickup) {
            $pickupStatus = PickupOrderStatus::where('invoice_id', $invoice->InvoiceID)->first();
            if ($pickupStatus) {
                $pickupStatus->update([
                    'status' => 'dibatalkan',
                    'updated_by' => $cashier?->id_kasir ?? null,
                ]);
            }
        } elseif ($isDelivery) {
            $currentAddress = '';
            if ($invoice->delivery_order_statuses->count() > 0) {
                $latestDeliveryStatus = $invoice->delivery_order_statuses->sortByDesc('created_at')->first();
                $currentAddress = $latestDeliveryStatus->alamat ?? '';
            }

            $deliveryStatus = DeliveryOrderStatus::where('invoice_id', $invoice->InvoiceID)->first();
            if ($deliveryStatus) {
                $deliveryStatus->update([
                    'status' => 'dibatalkan',
                    'alamat' => $currentAddress,
                    'updated_by' => $cashier?->id_kasir ?? null,
                ]);
            }
        }

        return response()->json(['success' => 'Pesanan berhasil dibatalkan.']);
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
        $invoice = Invoice::findOrFail($id);

        // Hapus semua invoice detail terkait
        foreach ($invoice->invoicedetails as $detail) {
            $detail->delete();
        }

        // Hapus semua payment terkait
        foreach ($invoice->payments as $payment) {
            if ($payment->PaymentImage && \Storage::disk('public')->exists($payment->PaymentImage)) {
                \Storage::disk('public')->delete($payment->PaymentImage);
            }
            $payment->delete();
        }

        // Terakhir, hapus invoice utama
        $invoice->delete();

        return redirect()->back()->with('success', 'Invoice dan seluruh relasinya berhasil dihapus.');
    }

}
