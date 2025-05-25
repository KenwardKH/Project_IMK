<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\Invoicedetail;
use App\Models\DeliveryOrderStatus;
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
        ->paginate(5);
        // dd($orders);

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

        return Inertia::render('cashier/ConfirmOrder', [
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
