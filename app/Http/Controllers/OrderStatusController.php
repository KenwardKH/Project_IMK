<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\Invoicedetail;
use App\Models\DeliveryOrderStatus;
use App\Models\PickupOrderStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class OrderStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Invoice::select(
        'InvoiceID as id',
        'InvoiceID as invoice_id',
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

        return Inertia::render('cashier/OrderStatus', [
                'orders' => $orders,
            ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function successOrder(Request $request, $id)
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

        $user = Auth::user(); // Pastikan user ada, atau bisa gunakan user default
        $cashier = $user->kasirs;
        
        
            $pickupStatus = PickupOrderStatus::where('invoice_id', $invoice->InvoiceID)->first();
            if ($pickupStatus) {
                $pickupStatus->update([
                    'status' => 'selesai',
                    'updated_by' => $cashier?->id_kasir ?? null,
                ]);
            }

        return redirect()->back()->with('success', 'Pesanan berhasil dikonfirmasi.');
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
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:diproses,diantar,selesai,dibatalkan',
            'type' => 'required|in:pickup,delivery',
        ]);

        if ($request->type === 'pickup') {
            $pickup = PickupOrderStatus::where('invoice_id', $id)->first();
            if ($pickup) {
                $pickup->status = $request->input('status');
                $pickup->updated_by = auth()->id();
                $pickup->save();
            }
        } elseif ($request->type === 'delivery') {
            $delivery = DeliveryOrderStatus::where('invoice_id', $id)->first();
            if ($delivery) {
                $delivery->status = $request->input('status');
                $delivery->updated_by = auth()->id();
                $delivery->save();
            }
        }

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
