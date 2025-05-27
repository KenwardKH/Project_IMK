<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kasir;
use App\Models\User;
use Inertia\Inertia;

class ownerDaftarKasir extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve all cashiers with their associated user data
        $kasirs = Kasir::with('user')->get()->map(function ($kasir) {
            return [
                'id' => $kasir->id_kasir,
                'nama' => $kasir->user->name,
                'email' => $kasir->user->email,
                'kontak' => $kasir->kontak_kasir ?? '',
                'alamat' => $kasir->alamat_kasir ?? '',
                'userId' => $kasir->user_id
            ];
        });

        return Inertia::render('owner/owner-daftar-kasir', [
            'kasirData' => $kasirs
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'kontak' => 'nullable|string|max:15',
            'alamat' => 'nullable|string|max:255',
        ]);

        // Create new user with role 'kasir'
        $user = User::create([
            'name' => $validated['nama'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'cashier'
        ]);

        // Create kasir record linked to the user
        $kasir = Kasir::create([
            'user_id' => $user->id,
            'nama_kasir' => $validated['nama'],
            'kontak_kasir' => $validated['kontak'] ?? null,
            'alamat_kasir' => $validated['alamat'] ?? null,
        ]);

        return redirect()->route('owner-daftar-kasir.index')->with('success', 'Kasir berhasil ditambahkan');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('owner/owner-tambah-kasir');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $kasir = Kasir::with('user')->findOrFail($id);
        
        $kasirData = [
            'id' => $kasir->id_kasir,
            'nama' => $kasir->nama_kasir,
            'email' => $kasir->user->email,
            'kontak' => $kasir->kontak_kasir ?? '',
            'alamat' => $kasir->alamat_kasir ?? '',
            'userId' => $kasir->user_id
        ];

        return Inertia::render('owner/owner-edit-kasir', [
            'kasir' => $kasirData
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Validate request
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$request->userId,
            'kontak' => 'nullable|string|max:15',
            'alamat' => 'nullable|string|max:255',
        ]);

        // Update kasir record
        $kasir = Kasir::findOrFail($id);
        $kasir->update([
            'nama_kasir' => $validated['nama'],
            'kontak_kasir' => $validated['kontak'] ?? null,
            'alamat_kasir' => $validated['alamat'] ?? null,
        ]);

        // Update associated user
        $user = User::findOrFail($kasir->user_id);
        $user->update([
            'name' => $validated['nama'],
            'email' => $validated['email']
        ]);

        return redirect()->route('owner-daftar-kasir.index')->with('success', 'Kasir berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $kasir = Kasir::findOrFail($id);
        $userId = $kasir->user_id;
        
        // Delete kasir record
        $kasir->delete();
        
        // Delete associated user
        User::destroy($userId);
        
        return redirect()->route('owner-daftar-kasir.index')->with('success', 'Kasir berhasil dihapus');
    }
}