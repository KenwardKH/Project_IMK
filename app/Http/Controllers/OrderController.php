<?php

namespace App\Http\Controllers;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Invoice;
use App\Models\Invoicedetail;
use App\Models\PickupOrderStatus;
use App\Models\DeliveryOrderStatus;
use App\Models\Payment;
use App\Models\User;
use App\Models\Customer;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Display orders by status
     */
    public function index($status)
{
    $allowedStatuses = ['belum-bayar', 'sedang-proses', 'proses','selesai', 'dibatalkan'];

    if (!in_array($status, $allowedStatuses)) {
        abort(404);
    }

    $user = Auth::user();

    // Map frontend status to database values
  $statusMap = [
    'belum-bayar' => ['menunggu pembayaran', 'pending', 'belum_bayar'],
    'sedang-proses' => ['diproses', 'processing', 'sedang_proses', 'confirmed'], // hanya status awal
    'proses' => ['menunggu pengambilan', 'diantar'], // status proses pengambilan/pengiriman
    'selesai' => ['selesai', 'completed'],
    'dibatalkan' => ['dibatalkan', 'cancelled']
];


    $dbStatuses = $statusMap[$status] ?? [$status];

    // Get customer
    $customer = Customer::where('user_id', $user->id)->first();

    if (!$customer) {
        return Inertia::render('orders/OrderPage', [
            'status' => $status,
            'orders' => []
        ]);
    }

    // Get all invoices for this customer
    $invoices = Invoice::with(['invoicedetails', 'pickup_order_statuses', 'delivery_order_statuses', 'payments'])
        ->where('CustomerID', $customer->CustomerID)
        ->orderBy('InvoiceDate', 'desc')
        ->get();

    // Filter and map invoices based on status
    $orders = $invoices->filter(function($invoice) use ($dbStatuses) {
        // Get latest status from both pickup and delivery
        $latestPickupStatus = $invoice->pickup_order_statuses
            ->sortByDesc('created_at')
            ->first();
        $latestDeliveryStatus = $invoice->delivery_order_statuses
            ->sortByDesc('created_at')
            ->first();

        // Determine which status to use
        $currentStatus = null;

        // If both exist, use the most recent one
        if ($latestPickupStatus && $latestDeliveryStatus) {
            $currentStatus = $latestPickupStatus->created_at > $latestDeliveryStatus->created_at
                ? $latestPickupStatus->status
                : $latestDeliveryStatus->status;
        } elseif ($latestPickupStatus) {
            $currentStatus = $latestPickupStatus->status;
        } elseif ($latestDeliveryStatus) {
            $currentStatus = $latestDeliveryStatus->status;
        }

        // If no status found, check if invoice has payments (might be pending payment)
        if (!$currentStatus) {
            $hasPayment = $invoice->payments->count() > 0;
            $currentStatus = $hasPayment ? 'diproses' : 'menunggu pembayaran';
        }

        // Check if current status matches any of the required statuses
        return in_array($currentStatus, $dbStatuses);
    })
    ->map(function($invoice) {
        // Determine order type
        $hasPickupStatus = $invoice->pickup_order_statuses->count() > 0;
        $hasDeliveryStatus = $invoice->delivery_order_statuses->count() > 0;

        // Get the latest status
        $latestPickupStatus = $hasPickupStatus
            ? $invoice->pickup_order_statuses->sortByDesc('created_at')->first()
            : null;
        $latestDeliveryStatus = $hasDeliveryStatus
            ? $invoice->delivery_order_statuses->sortByDesc('created_at')->first()
            : null;

        // Determine current status and type
        $currentStatus = null;
        $orderType = 'pickup'; // default
        $deliveryAddress = null;

        if ($latestPickupStatus && $latestDeliveryStatus) {
            if ($latestPickupStatus->created_at > $latestDeliveryStatus->created_at) {
                $currentStatus = $latestPickupStatus->status;
                $orderType = 'pickup';
            } else {
                $currentStatus = $latestDeliveryStatus->status;
                $orderType = 'delivery';
                $deliveryAddress = $latestDeliveryStatus->alamat ?? null;
            }
        } elseif ($latestPickupStatus) {
            $currentStatus = $latestPickupStatus->status;
            $orderType = 'pickup';
        } elseif ($latestDeliveryStatus) {
            $currentStatus = $latestDeliveryStatus->status;
            $orderType = 'delivery';
            $deliveryAddress = $latestDeliveryStatus->alamat ?? null;
        } else {
            // No status found, determine based on payment
            $hasPayment = $invoice->payments->count() > 0;
            $currentStatus = $hasPayment ? 'diproses' : 'menunggu pembayaran';
            $orderType = $invoice->type ?? 'pickup';
        }

        // Calculate total amount
        $totalAmount = $invoice->invoicedetails->sum(function($detail) {
            return (float)$detail->price * $detail->Quantity;
        });

        return [
            'invoice_id' => $invoice->InvoiceID,
            'customer_name' => $invoice->customerName,
            'customer_contact' => $invoice->customerContact,
            'invoice_date' => $invoice->InvoiceDate,
            'type' => $orderType === 'pickup' ? 'Ambil Sendiri' : 'Antar',
            'payment_option' => $invoice->payment_option,
            'cashier_name' => $invoice->CashierName,
            'status' => $currentStatus,
            'delivery_address' => $deliveryAddress,
            'total_amount' => $totalAmount,
            'items' => $invoice->invoicedetails->map(function($detail) {
                return [
                    'product_id' => $detail->ProductID,
                    'product_name' => $detail->productName,
                    'product_image' => $detail->productImage,
                    'quantity' => $detail->Quantity,
                    'unit' => $detail->productUnit,
                    'price' => (float)$detail->price,
                    'subtotal' => (float)$detail->price * $detail->Quantity
                ];
            }),
            'payments' => $invoice->payments->map(function($payment) {
                return [
                    'payment_id' => $payment->PaymentID,
                    'amount' => (float)$payment->AmountPaid, // Sesuaikan dengan nama field di database
                    'payment_date' => $payment->PaymentDate,
                    'payment_method' => $payment->payment_option, // Ambil dari invoice karena payment tidak punya method
                    'proof_image' => $payment->PaymentImage // Sesuaikan dengan nama field di database
                ];
            })
        ];
    })
    ->values(); // Re-index array

    return Inertia::render('orders/OrderPage', [
        'status' => $status,
        'orders' => $orders
    ]);
}
    /**
     * Show specific order details
     */
    public function show($id)
    {
        $user = Auth::user();
        $customer = Customer::where('user_id', $user->id)->firstOrFail();
        $invoice = Invoice::with(['invoicedetails', 'pickup_order_statuses', 'delivery_order_statuses', 'payments'])
            ->where('InvoiceID', $id)
            ->where('CustomerID', $customer->CustomerID)
            ->firstOrFail();

        // Determine if this is pickup or delivery order
        $isPickup = $invoice->type === 'pickup' || $invoice->pickup_order_statuses->count() > 0;
        $isDelivery = $invoice->type === 'delivery' || $invoice->delivery_order_statuses->count() > 0;

        // Get the latest status from appropriate table
        $latestStatus = null;
        if ($isPickup && $invoice->pickup_order_statuses->count() > 0) {
            $latestStatus = $invoice->pickup_order_statuses->sortByDesc('created_at')->first();
        } elseif ($isDelivery && $invoice->delivery_order_statuses->count() > 0) {
            $latestStatus = $invoice->delivery_order_statuses->sortByDesc('created_at')->first();
        }

        $totalAmount = $invoice->invoicedetails->sum(function($detail) {
            return (float)$detail->price * $detail->Quantity;
        });

        $orderDetail = [
            'invoice_id' => $invoice->InvoiceID,
            'customer_name' => $invoice->customerName,
            'customer_contact' => $invoice->customerContact,
            'invoice_date' => $invoice->InvoiceDate,
            'type' => $invoice->type ?? ($isPickup ? 'pickup' : 'delivery'),
            'payment_option' => $invoice->payment_option,
            'cashier_name' => $invoice->CashierName,
            'status' => $latestStatus->status ?? 'unknown',
            'delivery_address' => $isDelivery && $latestStatus ? $latestStatus->alamat ?? null : null,
            'total_amount' => $totalAmount,
            'items' => $invoice->invoicedetails->map(function($detail) {
                return [
                    'product_id' => $detail->ProductID,
                    'product_name' => $detail->productName,
                    'product_image' => $detail->productImage,
                    'quantity' => $detail->Quantity,
                    'unit' => $detail->productUnit,
                    'price' => (float)$detail->price,
                    'subtotal' => (float)$detail->price * $detail->Quantity
                ];
            }),
            'payments' => $invoice->payments->map(function($payment) {
                return [
                    'payment_id' => $payment->PaymentID,
                    'amount' => $payment->Amount,
                    'payment_date' => $payment->PaymentDate,
                    'payment_method' => $payment->PaymentMethod,
                    'proof_image' => $payment->ProofImage
                ];
            })
        ];

        return response()->json($orderDetail);
    }

    /**
     * Cancel an order
     */
    public function cancel(Request $request, $id)
    {
        $user = Auth::user();
        $customer = Customer::where('user_id', $user->id)->firstOrFail();
        $invoice = Invoice::with(['pickup_order_statuses', 'delivery_order_statuses'])
            ->where('InvoiceID', $id)
            ->where('CustomerID', $customer->CustomerID)
            ->firstOrFail();

        // Determine order type and get latest status
        $isPickup = $invoice->type === 'pickup' || $invoice->pickup_order_statuses->count() > 0;
        $isDelivery = $invoice->type === 'delivery' || $invoice->delivery_order_statuses->count() > 0;

        $latestStatus = null;
        if ($isPickup && $invoice->pickup_order_statuses->count() > 0) {
            $latestStatus = $invoice->pickup_order_statuses->sortByDesc('created_at')->first();
        } elseif ($isDelivery && $invoice->delivery_order_statuses->count() > 0) {
            $latestStatus = $invoice->delivery_order_statuses->sortByDesc('created_at')->first();
        }

    // Check if order can be cancelled
        if ($latestStatus && in_array($latestStatus->status, ['selesai', 'dibatalkan'])) {
            return response()->json(['error' => 'Pesanan tidak dapat dibatalkan'], 400);
        }

        // Create cancellation status in appropriate table
        if ($isPickup && $latestStatus) {
            $latestStatus->update([
                'status' => 'dibatalkan',
                'updated_by' => $user->id
            ]);
        } elseif ($isDelivery) {
            // Get the current address from latest status
            $currentAddress = $latestStatus && isset($latestStatus->alamat) ? $latestStatus->alamat : '';
            $latestStatus->update([
                'status' => 'dibatalkan',
                'alamat' => $latestStatus->alamat, // Pertahankan alamat sebelumnya
                'updated_by' => $user->id
            ]);
        } else {
            return response()->json(['error' => 'Status tidak ditemukan untuk diperbarui'], 400);
        }
        return redirect()->back()->with('success', 'Pesanan berhasil dibatalkan');

    }

    /**
     * Upload payment proof
     */
    public function uploadPaymentProof(Request $request, $id)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $user = Auth::user();
        $customer = Customer::where('user_id', $user->id)->firstOrFail();
        $invoice = Invoice::with(['pickup_order_statuses', 'delivery_order_statuses'])
            ->where('InvoiceID', $id)
            ->where('CustomerID', $customer->CustomerID)
            ->firstOrFail();

        // Store the uploaded file
        $imagePath = $request->file('payment_proof')->store('payment_proofs', 'public');

        // Create or update payment record
        $payment = Payment::updateOrCreate(
            ['InvoiceID' => $invoice->InvoiceID],
            [
                'AmountPaid' => $invoice->invoicedetails->sum(function($detail) {
                    return (float)$detail->price * $detail->Quantity;
                }),
                'PaymentDate' => now(),
                'InvoiceID' => $invoice->InvoiceID,
                'PaymentImage' => $imagePath
            ]
        );

        // Determine order type and update status to processing
        $isPickup = $invoice->type === 'pickup' || $invoice->pickup_order_statuses->count() > 0;
        $isDelivery = $invoice->type === 'delivery' || $invoice->delivery_order_statuses->count() > 0;

        if ($isPickup) {
            $pickupStatus = PickupOrderStatus::where('invoice_id', $invoice->InvoiceID)->first();
            if ($pickupStatus) {
                $pickupStatus->update([
                    'status' => 'diproses',
                    'updated_by' => $user->id
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
                    'status' => 'diproses',
                    'alamat' => $currentAddress,
                    'updated_by' => $user->id
                ]);
            }
        }

        return redirect()->back()->with('success', 'Bukti pembayaran berhasil diupload');
    }

    /**
     * Generate invoice PDF
     */
    public function generateInvoice($id)
    {
        $user = Auth::user();
        $customer = Customer::where('user_id', $user->id)->firstOrFail();
        $invoice = Invoice::with(['invoicedetails', 'pickup_order_statuses', 'delivery_order_statuses', 'payments'])
            ->where('InvoiceID', $id)
            ->where('CustomerID', $customer->CustomerID)
            ->firstOrFail();

        // Determine order type and get latest status
        $isPickup = $invoice->type === 'pickup' || $invoice->pickup_order_statuses->count() > 0;
        $isDelivery = $invoice->type === 'delivery' || $invoice->delivery_order_statuses->count() > 0;

        $latestStatus = null;
        if ($isPickup && $invoice->pickup_order_statuses->count() > 0) {
            $latestStatus = $invoice->pickup_order_statuses->sortByDesc('created_at')->first();
        } elseif ($isDelivery && $invoice->delivery_order_statuses->count() > 0) {
            $latestStatus = $invoice->delivery_order_statuses->sortByDesc('created_at')->first();
        }

        // Check if order is completed or cancelled
        if (!$latestStatus || !in_array($latestStatus->status, ['selesai', 'dibatalkan'])) {
            return response()->json(['error' => 'Invoice hanya dapat dicetak untuk pesanan yang selesai atau dibatalkan'], 400);
        }

        // Return invoice data for PDF generation
        $invoiceData = [
            'InvoiceID' => $invoice->InvoiceID,
            'customerName' => $invoice->customerName,
            'customerContact' => $invoice->customerContact,
            'InvoiceDate' => $invoice->InvoiceDate,
            'type' => $invoice->type ?? ($isPickup ? 'pickup' : 'delivery'),
            'payment_option' => $invoice->payment_option,
            'CashierName' => $invoice->CashierName,
            'status' => $latestStatus->status,
            'delivery_address' => $isDelivery && $latestStatus ? $latestStatus->alamat ?? null : null,
            'items' => $invoice->invoicedetails,
            'totalAmount' => $invoice->invoicedetails->sum(function($detail) {
                return (float)$detail->price * $detail->Quantity;
            })
        ];

        $pdf = Pdf::loadView('print', ['invoice' => $invoiceData]);
       return $pdf->stream('invoice-'.$invoiceData['InvoiceID'].'.pdf');
    }

    public function generateInvoiceOther($id)
{
    $invoice = Invoice::with([
        'invoicedetails',
        'pickup_order_statuses',
        'delivery_order_statuses',
        'payments'
    ])->where('InvoiceID', $id)->firstOrFail();

    // Determine order type and get latest status
    $isPickup = $invoice->type === 'pickup' || $invoice->pickup_order_statuses->count() > 0;
    $isDelivery = $invoice->type === 'delivery' || $invoice->delivery_order_statuses->count() > 0;

    $latestStatus = null;
    if ($isPickup && $invoice->pickup_order_statuses->count() > 0) {
        $latestStatus = $invoice->pickup_order_statuses->sortByDesc('created_at')->first();
    } elseif ($isDelivery && $invoice->delivery_order_statuses->count() > 0) {
        $latestStatus = $invoice->delivery_order_statuses->sortByDesc('created_at')->first();
    }

    // Check if order is completed or cancelled
    if (!$latestStatus || !in_array($latestStatus->status, ['selesai', 'dibatalkan'])) {
        return response()->json(['error' => 'Invoice hanya dapat dicetak untuk pesanan yang selesai atau dibatalkan'], 400);
    }

    // Return invoice data for PDF generation
    $invoiceData = [
        'InvoiceID' => $invoice->InvoiceID,
        'customerName' => $invoice->customerName,
        'customerContact' => $invoice->customerContact,
        'InvoiceDate' => $invoice->InvoiceDate,
        'type' => $invoice->type ?? ($isPickup ? 'pickup' : 'delivery'),
        'payment_option' => $invoice->payment_option,
        'CashierName' => $invoice->CashierName,
        'status' => $latestStatus->status,
        'delivery_address' => $isDelivery && $latestStatus ? $latestStatus->alamat ?? null : null,
        'items' => $invoice->invoicedetails,
        'totalAmount' => $invoice->invoicedetails->sum(function ($detail) {
            return (float) $detail->price * $detail->Quantity;
        })
    ];

    $pdf = Pdf::loadView('print', ['invoice' => $invoiceData]);
    return $pdf->stream('invoice-' . $invoiceData['InvoiceID'] . '.pdf');
}


    /**
     * Debug method to check what data exists
     */
    public function debug()
    {
        $user = Auth::user();
        $customer = Customer::where('user_id', $user->id)->firstOrFail();
        $invoices = Invoice::with(['pickup_order_statuses', 'delivery_order_statuses'])
            ->where('CustomerID', $customer->CustomerID)
            ->get();

        $debug_data = [];

        foreach($invoices as $invoice) {
            $pickup_statuses = $invoice->pickup_order_statuses->pluck('status')->toArray();
            $delivery_statuses = $invoice->delivery_order_statuses->pluck('status')->toArray();

            $debug_data[] = [
                'invoice_id' => $invoice->InvoiceID,
                'type' => $invoice->type,
                'pickup_statuses' => $pickup_statuses,
                'delivery_statuses' => $delivery_statuses,
                'latest_pickup' => $invoice->pickup_order_statuses->sortByDesc('created_at')->first()?->status,
                'latest_delivery' => $invoice->delivery_order_statuses->sortByDesc('created_at')->first()?->status,
            ];
        }

        return response()->json([
            'user_id' => $user->id,
            'total_invoices' => $invoices->count(),
            'invoices' => $debug_data
        ]);
    }

    /**
     * Get status options for frontend
     */
    public function getStatusOptions()
    {
        return response()->json([
            'pickup_statuses' => [
                'menunggu pembayaran',
                'diproses',
                'menunggu pengambilan',
                'selesai',
                'dibatalkan'
            ],
            'delivery_statuses' => [
                'menunggu pembayaran',
                'diproses',
                'diantar',
                'selesai',
                'dibatalkan'
            ]
        ]);
    }
}
