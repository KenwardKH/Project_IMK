<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Invoicedetail;
use App\Models\PickupOrderStatus;
use App\Models\DeliveryOrderStatus;
use App\Models\Payment;
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
        $allowedStatuses = ['belum-bayar', 'sedang-proses', 'selesai', 'dibatalkan'];
        
        if (!in_array($status, $allowedStatuses)) {
            abort(404);
        }

        $user = Auth::user();
        
        // Map status to database values for both pickup and delivery
        $statusMap = [
            'belum-bayar' => ['menunggu pembayaran'],
            'sedang-proses' => ['diproses', 'menunggu pengambilan', 'diantar'], // includes pickup waiting and delivery in transit
            'selesai' => ['selesai'],
            'dibatalkan' => ['dibatalkan']
        ];

        $dbStatuses = $statusMap[$status] ?? [$status];

        // Get all invoices for this customer first
        $customer = Customer::where('user_id', $user->id)->first();
        $orders = Invoice::with(['invoicedetails', 'pickup_order_statuses', 'delivery_order_statuses', 'payments'])
            ->where('CustomerID', $customer->CustomerID)
            ->orderBy('InvoiceDate', 'desc')
            ->get()
            ->filter(function($invoice) use ($dbStatuses) {
                // Get latest status from both pickup and delivery
                $latestPickupStatus = $invoice->pickup_order_statuses->sortByDesc('created_at')->first();
                $latestDeliveryStatus = $invoice->delivery_order_statuses->sortByDesc('created_at')->first();
                
                // Check if any of the latest statuses match our filter
                $pickupMatch = $latestPickupStatus && in_array($latestPickupStatus->status, $dbStatuses);
                $deliveryMatch = $latestDeliveryStatus && in_array($latestDeliveryStatus->status, $dbStatuses);
                
                return $pickupMatch || $deliveryMatch;
            })
            ->map(function($invoice) {
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

                return [
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
            });

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
        
        $invoice = Invoice::with(['invoicedetails', 'pickup_order_statuses', 'delivery_order_statuses', 'payments'])
            ->where('InvoiceID', $id)
            ->where('CustomerID', $user->id)
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
        
        $invoice = Invoice::with(['pickup_order_statuses', 'delivery_order_statuses'])
            ->where('InvoiceID', $id)
            ->where('CustomerID', $user->id)
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
        if ($isPickup) {
            PickupOrderStatus::create([
                'invoice_id' => $invoice->InvoiceID,
                'status' => 'dibatalkan',
                'updated_by' => $user->id
            ]);
        } elseif ($isDelivery) {
            // Get the current address from latest status
            $currentAddress = $latestStatus && isset($latestStatus->alamat) ? $latestStatus->alamat : '';
            
            DeliveryOrderStatus::create([
                'invoice_id' => $invoice->InvoiceID,
                'status' => 'dibatalkan',
                'alamat' => $currentAddress,
                'updated_by' => $user->id
            ]);
        }

        return response()->json(['message' => 'Pesanan berhasil dibatalkan']);
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
        
        $invoice = Invoice::with(['pickup_order_statuses', 'delivery_order_statuses'])
            ->where('InvoiceID', $id)
            ->where('CustomerID', $user->id)
            ->firstOrFail();

        // Store the uploaded file
        $imagePath = $request->file('payment_proof')->store('payment_proofs', 'public');

        // Create or update payment record
        $payment = Payment::updateOrCreate(
            ['InvoiceID' => $invoice->InvoiceID],
            [
                'Amount' => $invoice->invoicedetails->sum(function($detail) {
                    return (float)$detail->price * $detail->Quantity;
                }),
                'PaymentDate' => now(),
                'PaymentMethod' => $invoice->payment_option,
                'ProofImage' => $imagePath
            ]
        );

        // Determine order type and update status to processing
        $isPickup = $invoice->type === 'pickup' || $invoice->pickup_order_statuses->count() > 0;
        $isDelivery = $invoice->type === 'delivery' || $invoice->delivery_order_statuses->count() > 0;

        if ($isPickup) {
            PickupOrderStatus::create([
                'invoice_id' => $invoice->InvoiceID,
                'status' => 'diproses',
                'updated_by' => $user->id
            ]);
        } elseif ($isDelivery) {
            // Get the current address from latest status
            $currentAddress = '';
            if ($invoice->delivery_order_statuses->count() > 0) {
                $latestDeliveryStatus = $invoice->delivery_order_statuses->sortByDesc('created_at')->first();
                $currentAddress = $latestDeliveryStatus->alamat ?? '';
            }
            
            DeliveryOrderStatus::create([
                'invoice_id' => $invoice->InvoiceID,
                'status' => 'diproses',
                'alamat' => $currentAddress,
                'updated_by' => $user->id
            ]);
        }

        return response()->json([
            'message' => 'Bukti pembayaran berhasil diupload',
            'payment' => $payment
        ]);
    }

    /**
     * Generate invoice PDF
     */
    public function generateInvoice($id)
    {
        $user = Auth::user();
        
        $invoice = Invoice::with(['invoicedetails', 'pickup_order_statuses', 'delivery_order_statuses', 'payments'])
            ->where('InvoiceID', $id)
            ->where('CustomerID', $user->id)
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
            'invoice_id' => $invoice->InvoiceID,
            'customer_name' => $invoice->customerName,
            'customer_contact' => $invoice->customerContact,
            'invoice_date' => $invoice->InvoiceDate,
            'type' => $invoice->type ?? ($isPickup ? 'pickup' : 'delivery'),
            'payment_option' => $invoice->payment_option,
            'cashier_name' => $invoice->CashierName,
            'status' => $latestStatus->status,
            'delivery_address' => $isDelivery && $latestStatus ? $latestStatus->alamat ?? null : null,
            'items' => $invoice->invoicedetails,
            'total_amount' => $invoice->invoicedetails->sum(function($detail) {
                return (float)$detail->price * $detail->Quantity;
            })
        ];

        return response()->json($invoiceData);
    }

    /**
     * Debug method to check what data exists
     */
    public function debug()
    {
        $user = Auth::user();
        
        $invoices = Invoice::with(['pickup_order_statuses', 'delivery_order_statuses'])
            ->where('CustomerID', $user->id)
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