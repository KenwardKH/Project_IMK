<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Invoice;

use Inertia\Inertia;

class ownerDashboard extends Controller
{
    public function index()
    {
        $productCount = Product::count();
        $customerCount = Customer::count();
        $transactionCount = Invoice::count();
        return Inertia::render('owner/owner-dashboard', [
            'productCount' => $productCount,
            'customerCount' => $customerCount,
            'transactionCount' => $transactionCount,
        ]);
    }
}
