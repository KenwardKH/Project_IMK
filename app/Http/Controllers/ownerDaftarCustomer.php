<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\User;
use Inertia\Inertia;

class ownerDaftarCustomer extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve all customers with their associated user data
        $customers = Customer::with('user')->get()->map(function ($customer) {
            return [
                'id' => $customer->CustomerID,
                'nama' => $customer->user->name,
                'email' => $customer->user->email,
                'kontak' => $customer->CustomerContact ?? '',
                'alamat' => $customer->CustomerAddress ?? '',
                'userId' => $customer->user_id
            ];
        });

        return Inertia::render('owner/owner-daftar-pelanggan', [
            'customerData' => $customers
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
    
}