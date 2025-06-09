<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\CashierCart;
use App\Models\Kasir;
use App\Models\Invoice;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class CashierController extends Controller
{
/**
     * Display the cashier interface
     */
    public function index()
    {
        try {
            // Get all products with stock > 0
            $products = Product::where('CurrentStock', '>', 0)
                ->orderBy('ProductName')
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->ProductID,
                        'name' => $product->ProductName,
                        'description' => $product->Description,
                        'price' => $product->ProductPrice,
                        'stock' => $product->CurrentStock,
                        'image' => $product->image,
                    ];
                });


            $user = Auth::user();
            $cashier = $user->kasirs()->first();

            // // Get current cart items with product details

            $cartItems = CashierCart::with('product')
                ->where('CashierID', $cashier->id_kasir) // ⬅️ Hanya data milik kasir login
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->CartID,
                        'product_id' => $item->ProductID,
                        'quantity' => $item->Quantity,
                        'product' => [
                            'id' => $item->product?->ProductID,
                            'name' => $item->product?->ProductName,
                            'price' => $item->product?->ProductPrice,
                            'stock' => $item->product?->CurrentStock,
                            'image' => $item->product?->Image,
                        ],
                        'subtotal' => $item->product->ProductPrice * $item->Quantity
                    ];
                });
                // dd($cartItems);
                // dd($cartItems->toArray());

            // Calculate totals
            $subtotal = $cartItems->sum('subtotal');

            $total = $subtotal; // You can add tax or discount calculation here

            return Inertia::render('cashier/CashierCart', [
                'products' => $products,
                'cartItems' => $cartItems,
                'subtotal' => $subtotal,
                'total' => $total,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading cashier page: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memuat halaman kasir.');
        }
    }

    /**
     * Update cart quantity (increment/decrement)
     */
    public function updateCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,ProductID',
            'action' => 'required|in:increment,decrement',
        ]);
        $user = Auth::user();
        $cashier = $user->kasirs()->first();
        try {
            DB::beginTransaction();

            $product = Product::where('ProductID', $request->product_id)->firstOrFail();
            $cartItem = CashierCart::where('ProductID', $request->product_id)->first();

            if ($request->action === 'increment') {
                // Check stock availability
                $currentQuantityInCart = $cartItem ? $cartItem->Quantity : 0;

                if ($currentQuantityInCart >= $product->CurrentStock) {
                    return redirect()->back()->with('error', 'Stok tidak mencukupi!');
                }

                if ($cartItem) {
                    // Update existing cart item
                    $cartItem->Quantity += 1;
                    $cartItem->save();
                } else {
                    // Create new cart item
                    CashierCart::create([
                        'ProductID' => $product->ProductID,
                        'Quantity' => 1,
                        'CashierID' => $cashier->id_kasir,
                    ]);
                }
            } else if ($request->action === 'decrement') {
                if (!$cartItem) {
                    return redirect()->back()->with('error', 'Item tidak ditemukan di keranjang!');
                }

                if ($cartItem->Quantity <= 1) {
                    // Remove item if quantity becomes 0
                    $cartItem->delete();
                } else {
                    // Decrease quantity
                    $cartItem->Quantity -= 1;
                    $cartItem->save();
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Keranjang berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating cart: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memperbarui keranjang.');
        }
    }

    public function batchUpdateCart(Request $request)
{
    $request->validate([
        'updates' => 'required|array',
        'updates.*.product_id' => 'required|exists:products,ProductID',
        'updates.*.quantity' => 'required|integer|min:0',
    ]);

    $user = Auth::user();
    $cashier = $user->kasirs()->first();

    if (!$cashier) {
        return response()->json(['error' => 'Kasir tidak ditemukan'], 400);
    }

    try {
        DB::beginTransaction();

        foreach ($request->updates as $update) {
            $productId = $update['product_id'];
            $newQuantity = $update['quantity'];

            $product = Product::where('ProductID', $productId)->firstOrFail();
            $cartItem = CashierCart::where('ProductID', $productId)
                                  ->where('CashierID', $cashier->id_kasir)
                                  ->first();

            // Validasi stock
            if ($newQuantity > $product->CurrentStock) {
                DB::rollBack();
                return response()->json([
                    'error' => "Stok tidak mencukupi untuk produk {$product->ProductName}! Stok tersedia: {$product->CurrentStock}"
                ], 400);
            }

            if ($newQuantity <= 0) {
                // Hapus item jika quantity 0 atau kurang
                if ($cartItem) {
                    $cartItem->delete();
                }
            } else {
                if ($cartItem) {
                    // Update existing cart item
                    $cartItem->Quantity = $newQuantity;
                    $cartItem->save();
                } else {
                    // Create new cart item
                    CashierCart::create([
                        'ProductID' => $productId,
                        'Quantity' => $newQuantity,
                        'CashierID' => $cashier->id_kasir,
                    ]);
                }
            }
        }

        DB::commit();

        // Return updated cart data
        $updatedCartItems = CashierCart::with('product')
                                      ->where('CashierID', $cashier->id_kasir)
                                      ->get();

        $total = $updatedCartItems->sum(function ($item) {
            return $item->Quantity * $item->product->Price;
        });

        return response()->json([
            'success' => true,
            'message' => 'Keranjang berhasil diperbarui!',
            'cart_items' => $updatedCartItems,
            'total' => $total,
            'subtotal' => $total
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Error batch updating cart: ' . $e->getMessage());
        return response()->json(['error' => 'Terjadi kesalahan saat memperbarui keranjang.'], 500);
    }
}

    /**
     * Remove specific item from cart
     */
    public function removeFromCart($productId)
    {
        try {
            $cartItem = CashierCart::where('ProductID', $productId)->first();

            if (!$cartItem) {
                return redirect()->back()->with('error', 'Item tidak ditemukan di keranjang!');
            }

            $cartItem->delete();

            return redirect()->back()->with('success', 'Item berhasil dihapus dari keranjang!');
        } catch (\Exception $e) {
            Log::error('Error removing item from cart: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus item.');
        }
    }

    /**
     * Clear all items from cart
     */
    public function clearCart()
    {
         $kasir = Kasir::where('user_id', Auth::id())->first();

        if (!$kasir) {
            return redirect()->back()->with('error', 'Kasir tidak ditemukan.');
        }

        // Hapus data dari cart berdasarkan CashierID
        CashierCart::where('CashierID', $kasir->id_kasir)->delete();

        return redirect()->back()->with('success', 'Keranjang berhasil dikosongkan!');
    }

    /**
     * Process checkout
     */
    // public function checkout(Request $request)
    // {
    //     try {
    //         DB::beginTransaction();

    //         // Get cart items
    //         $cartItems = CashierCart::with('product')->get();

    //         if ($cartItems->isEmpty()) {
    //             return redirect()->back()->with('error', 'Keranjang belanja kosong!');
    //         }

    //         // Validate stock availability for all items
    //         foreach ($cartItems as $cartItem) {
    //             if ($cartItem->quantity > $cartItem->product->CurrentStock) {
    //                 DB::rollBack();
    //                 return redirect()->back()->with('error', "Stok {$cartItem->product->name} tidak mencukupi!");
    //             }
    //         }

    //         // Calculate totals
    //         $subtotal = $cartItems->sum(function ($item) {
    //             return $item->price * $item->quantity;
    //         });
    //         $tax = 0; // You can calculate tax here if needed
    //         $discount = 0; // You can calculate discount here if needed
    //         $total = $subtotal + $tax - $discount;

    //         // Generate transaction number
    //         $transactionNumber = 'TRX-' . date('Ymd') . '-' . str_pad(
    //             Transaction::whereDate('created_at', today())->count() + 1,
    //             4,
    //             '0',
    //             STR_PAD_LEFT
    //         );

    //         // Create transaction
    //         $transaction = Transaction::create([
    //             'transaction_number' => $transactionNumber,
    //             'subtotal' => $subtotal,
    //             'tax' => $tax,
    //             'discount' => $discount,
    //             'total' => $total,
    //             'payment_method' => $request->payment_method ?? 'cash',
    //             'status' => 'completed',
    //             'cashier_id' => auth()->id(), // Assuming you have authentication
    //             'customer_name' => $request->customer_name,
    //             'notes' => $request->notes,
    //         ]);

    //         // Create transaction details and update product stock
    //         foreach ($cartItems as $cartItem) {
    //             // Create transaction detail
    //             TransactionDetail::create([
    //                 'transaction_id' => $transaction->id,
    //                 'product_id' => $cartItem->product_id,
    //                 'quantity' => $cartItem->quantity,
    //                 'unit_price' => $cartItem->price,
    //                 'total_price' => $cartItem->price * $cartItem->quantity,
    //             ]);

    //             // Update product stock
    //             $product = Product::find($cartItem->product_id);
    //             $product->CurrentStock -= $cartItem->quantity;
    //             $product->save();
    //         }

    //         // Clear cart after successful checkout
    //         CashierCart::truncate();

    //         DB::commit();

    //         return redirect()->back()->with([
    //             'success' => 'Checkout berhasil!',
    //             'transaction_number' => $transactionNumber,
    //             'total' => $total
    //         ]);

    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error('Error during checkout: ' . $e->getMessage());
    //         return redirect()->back()->with('error', 'Terjadi kesalahan saat checkout. Silakan coba lagi.');
    //     }
    // }

public function checkout(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Please login to checkout'], 401);
        }

        $request->validate([
            'customer_name' => 'required_without:customer_id|string|max:255',
            'customer_contact' => 'required_without:customer_id|string|max:50',
            'shipping_option' => 'required|in:pickup,diantar',
            'payment_option' => 'required|string',
            'alamat' => 'nullable|string|required_if:shipping_option,diantar'
        ]);

        $user = Auth::user();
        $cashier = $user->kasirs;

        if (!$cashier) {
            return response()->json(['error' => 'Customer profile not found'], 400);
        }

        // Check if cart is not empty
        $cartItemCount = CashierCart::where('CashierID', $cashier->id_kasir)->count();
        if ($cartItemCount === 0) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        $cartItems = CashierCart::with('product')
            ->where('CashierID', $cashier->id_kasir)
            ->get();

        $totalAmount = $cartItems->sum(function ($item) {
            return $item->Quantity * $item->product->ProductPrice;
        });


        try {
            // Call the stored procedure
            DB::statement('CALL CheckoutCashierCart(?, ?, ?, ?, ?, ?, ?)', [
                $cashier->id_kasir,
                null,
                $request->customer_name ?? null,
                $request->customer_contact ?? null,
                $request->shipping_option,
                $request->payment_option,
                $request->alamat
            ]);

            // Get the latest invoice created for this cashier
            $latestInvoice = Invoice::where('CashierID', $cashier->id_kasir)
                ->orderBy('InvoiceID', 'desc')
                ->first();

            if ($latestInvoice) {
                // Create payment record
                $paymentData = [
                    'InvoiceID' => $latestInvoice->InvoiceID,
                    'PaymentDate' => Carbon::now(),
                    'AmountPaid' => $totalAmount,
                    'PaymentImage' => null // Will be null for cash payments, can be updated later for transfer
                ];

                Payment::create($paymentData);
            }
            return response()->json(['success' => 'Checkout completed successfully']);
        } catch (\Exception $e) {
            // Check if it's a stock error or other database error
            $errorMessage = $e->getMessage();

            if (strpos($errorMessage, 'Cart not found or is empty') !== false) {
                return response()->json(['error' => 'Keranjang kosong atau tidak ditemukan'], 400);
            }

            if (strpos($errorMessage, 'stock') !== false || strpos($errorMessage, 'Stock') !== false) {
                return response()->json(['error' => 'Stok produk tidak mencukupi'], 400);
            }

            \Log::error('Checkout error: ' . $errorMessage);
            return response()->json(['error' => 'Terjadi kesalahan saat checkout. Silakan coba lagi.'], 500);
        }
    }

    /**
     * Get cart summary (for AJAX requests)
     */
    public function getCartSummary()
    {
        try {
            $cartItems = CashierCart::with('product')->get();

            $subtotal = $cartItems->sum(function ($item) {
                return $item->product->price * $item->Quantity;
            });

            return response()->json([
                'success' => true,
                'cart_items' => $cartItems,
                'subtotal' => $subtotal,
                'total' => $subtotal,
                'item_count' => $cartItems->sum('Quantity'),
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting cart summary: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data keranjang.'
            ], 500);
        }
    }

    /**
     * Search products (for AJAX requests)
     */
    public function searchProducts(Request $request)
    {
        try {
            $query = $request->get('q', '');

            $products = Product::where('CurrentStock', '>', 0)
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                      ->orWhere('code', 'like', "%{$query}%")
                      ->orWhere('category', 'like', "%{$query}%");
                })
                ->orderBy('name')
                ->limit(20)
                ->get();

            return response()->json([
                'success' => true,
                'products' => $products
            ]);
        } catch (\Exception $e) {
            Log::error('Error searching products: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mencari produk.'
            ], 500);
        }
    }

    /**
     * Get transaction history
     */
    // public function getTransactionHistory(Request $request)
    // {
    //     try {
    //         $perPage = $request->get('per_page', 10);
    //         $dateFrom = $request->get('date_from');
    //         $dateTo = $request->get('date_to');

    //         $query = Transaction::with(['details.product', 'cashier'])
    //             ->orderBy('created_at', 'desc');

    //         if ($dateFrom) {
    //             $query->whereDate('created_at', '>=', $dateFrom);
    //         }

    //         if ($dateTo) {
    //             $query->whereDate('created_at', '<=', $dateTo);
    //         }

    //         $transactions = $query->paginate($perPage);

    //         return response()->json([
    //             'success' => true,
    //             'transactions' => $transactions
    //         ]);
    //     } catch (\Exception $e) {
    //         Log::error('Error getting transaction history: ' . $e->getMessage());
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Terjadi kesalahan saat mengambil riwayat transaksi.'
    //         ], 500);
    //     }
    // }

    /**
     * Print receipt
     */
    // public function printReceipt($transactionId)
    // {
    //     try {
    //         $transaction = Transaction::with(['details.product'])
    //             ->findOrFail($transactionId);

    //         return Inertia::render('Cashier/Receipt', [
    //             'transaction' => $transaction
    //         ]);
    //     } catch (\Exception $e) {
    //         Log::error('Error loading receipt: ' . $e->getMessage());
    //         return redirect()->back()->with('error', 'Terjadi kesalahan saat memuat struk.');
    //     }
    // }
}
