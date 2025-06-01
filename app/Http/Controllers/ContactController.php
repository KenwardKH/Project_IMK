<?php

namespace App\Http\Controllers;

use App\Models\Contacts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('footer/ContactUsPage');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|min:10',
        ], [
            'name.required' => 'Nama lengkap wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'message.required' => 'Pesan wajib diisi',
            'message.min' => 'Pesan minimal 10 karakter',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            Contacts::create([
                'name' => $request->name,
                'email' => $request->email,
                'message' => $request->message,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pesan berhasil dikirim! Tim customer service akan merespon dalam waktu 24 jam.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.',
            ], 500);
        }
    }

    // ADMIN

    public function indexAdmin(Request $request)
    {
        $query = Contacts::query();

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('message', 'like', '%' . $request->search . '%');
            });
        }

        $customers = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total' => Contacts::count(),
            'unread' => Contacts::unread()->count(),
            'read' => Contacts::read()->count(),
            'replied' => Contacts::replied()->count(),
        ];

        return Inertia::render('owner/owner-contacts-us', [
            'customers' => $customers,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function showAdmin(Contacts $customer)
    {
        // Mark as read if it's unread
        if ($customer->status === 'unread') {
            $customer->markAsRead();
        }

        return Inertia::render('Admin/Customers/Show', [
            'customer' => $customer,
        ]);
    }

    public function updateStatusAdmin(Request $request, Contacts $customer)
    {
        $request->validate([
            'status' => 'required|in:unread,read,replied',
            'reply_message' => 'nullable|string|max:1000',
        ]);

        if ($request->status === 'replied') {
            $customer->markAsReplied($request->reply_message);
        } else {
            $customer->update(['status' => $request->status]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Status berhasil diperbarui',
        ]);
    }

    public function destroyAdmin(Contacts $customer)
    {
        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data customer berhasil dihapus',
        ]);
    }

}
