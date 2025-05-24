<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CustomerCart;
use App\Models\Product;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CustomerCartController extends Controller
{
    /**
     * Display the user's cart
     */
    public function index()
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('message', 'Please login to view your cart');
        }

        $user = Auth::user();
        $customer = $user->customer;

        // if (!$customer) {
        //     return redirect()->route('dashboard')->with('error', 'Customer profile not found');
        // }

        // Get cart items with product details
        $cartItems = CustomerCart::with(['product'])
            ->where('CustomerID', $customer->CustomerID)
            ->get()
            ->map(function ($cartItem) {
                return [
                    'id' => $cartItem->CartID,
                    'product_id' => $cartItem->ProductID,
                    'quantity' => $cartItem->Quantity,
                    'product' => [
                        'id' => $cartItem->product->ProductID,
                        'nama_produk' => $cartItem->product->ProductName,
                        'harga_jual' => $cartItem->product->ProductPrice,
                        'gambar_produk' => $cartItem->product->image,
                        'stock' => $cartItem->product->CurrentStock,
                        'satuan' => $cartItem->product->ProductUnit,
                    ],
                    'subtotal' => $cartItem->product->ProductPrice * $cartItem->Quantity
                ];
            });

        $totalAmount = $cartItems->sum('subtotal');

        return Inertia::render('CartPage', [
            'cartItems' => $cartItems,
            'totalAmount' => $totalAmount,
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ] : null
            ]
        ]);
    }

    /**
     * Add item to cart
     */
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Please login to add items to cart'], 401);
        }

        $request->validate([
            'product_id' => 'required|exists:products,ProductID',
            'quantity' => 'required|integer|min:1'
        ]);

        $user = Auth::user();
        $customer = $user->customer;

        if (!$customer) {
            return response()->json(['error' => 'Customer profile not found'], 400);
        }

        $product = Product::find($request->product_id);

        if ($request->quantity > $product->CurrentStock) {
            return response()->json(['error' => 'Quantity exceeds available stock'], 400);
        }

        // Check if item already exists in cart
        $existingCartItem = CustomerCart::where('CustomerID', $customer->CustomerID)
            ->where('ProductID', $request->product_id)
            ->first();

        if ($existingCartItem) {
            // Update quantity
            $newQuantity = $existingCartItem->Quantity + $request->quantity;

            if ($newQuantity > $product->CurrentStock) {
                return response()->json(['error' => 'Total quantity exceeds available stock'], 400);
            }

            $existingCartItem->update(['Quantity' => $newQuantity]);
        } else {
            // Create new cart item
            CustomerCart::create([
                'CustomerID' => $customer->CustomerID,
                'ProductID' => $request->product_id,
                'Quantity' => $request->quantity
            ]);
        }

        return response()->json(['success' => 'Item added to cart successfully']);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $user = Auth::user();
        $customer = $user->customer;

        $cartItem = CustomerCart::where('CartID', $id)
            ->where('CustomerID', $customer->CustomerID)
            ->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        $product = Product::find($cartItem->ProductID);

        if ($request->quantity > $product->CurrentStock) {
            return response()->json(['error' => 'Quantity exceeds available stock'], 400);
        }

        $cartItem->update(['Quantity' => $request->quantity]);

        return response()->json(['success' => 'Cart updated successfully']);
    }

    /**
     * Remove item from cart
     */
    public function destroy($id)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = Auth::user();
        $customer = $user->customer;

        $cartItem = CustomerCart::where('CartID', $id)
            ->where('CustomerID', $customer->CustomerID)
            ->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        $cartItem->delete();

        return response()->json(['success' => 'Item removed from cart']);
    }

    /**
     * Get cart count for navbar
     */
    public function getCartCount()
    {
        if (!Auth::check()) {
            return response()->json(['count' => 0]);
        }

        $user = Auth::user();
        $customer = $user->customer;

        if (!$customer) {
            return response()->json(['count' => 0]);
        }

        $count = CustomerCart::where('CustomerID', $customer->CustomerID)->sum('Quantity');

        return response()->json(['count' => $count]);
    }

    /**
     * Process checkout
     */
    public function checkout(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Please login to checkout'], 401);
        }

        $request->validate([
            'shipping_option' => 'required|in:pickup,diantar',
            'payment_option' => 'required|string',
            'alamat' => 'nullable|string|required_if:shipping_option,diantar'
        ]);

        $user = Auth::user();
        $customer = $user->customer;

        if (!$customer) {
            return response()->json(['error' => 'Customer profile not found'], 400);
        }

        // Check if cart is not empty
        $cartItemCount = CustomerCart::where('CustomerID', $customer->CustomerID)->count();
        if ($cartItemCount === 0) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        try {
            // Call the stored procedure
            DB::statement('CALL CheckoutCart(?, ?, ?, ?)', [
                $customer->CustomerID,
                $request->shipping_option,
                $request->payment_option,
                $request->alamat
            ]);

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
}
