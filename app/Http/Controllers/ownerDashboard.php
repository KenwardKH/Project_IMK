<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\FinancialReport;
use App\Models\TransactionList;


use Inertia\Inertia;

class ownerDashboard extends Controller
{
    public function index()
    {
        $productCount = Product::count();
        $customerCount = Customer::count();
        $transactionCount = Invoice::count();
        
        // Get financial data from the database
        $financialData = FinancialReport::select('ReportMonth', 'TotalRevenue', 'TotalSpending', 'ProfitLoss')
            ->orderBy('ReportMonth', 'desc')
            ->limit(12) // Get last 12 months
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->ReportMonth,
                    'sales' => $item->TotalRevenue ?? 0,
                    'expenses' => $item->TotalSpending,
                    'profit' => $item->ProfitLoss ?? 0,
                ];
            });

        return Inertia::render('owner/owner-dashboard', [
            'productCount' => $productCount,
            'customerCount' => $customerCount,
            'transactionCount' => $transactionCount,
            'financialData' => $financialData,
        ]);
    }

    public function laporanPenjualan()
    {
        // Get daily sales data from TransactionList view
        $salesData = TransactionList::selectRaw('
                DATE(PaymentDate) as tanggal,
                COUNT(*) as jumlah_penjualan,
                SUM(CASE WHEN OrderStatus = "selesai" THEN AmountPaid ELSE 0 END) as hasil_penjualan
            ')
            ->whereNotNull('PaymentDate') // Only include transactions with payment date
            ->whereDate('PaymentDate', '>=', now()->subDays(30)) // Last 30 days
            ->groupBy('tanggal')
            ->orderBy('tanggal', 'asc')
            ->get()
            ->map(function ($item, $index) {
                return [
                    'id' => $index + 1,
                    'tanggal' => $item->tanggal,
                    'jumlah_penjualan' => $item->jumlah_penjualan,
                    'hasil_penjualan' => $item->hasil_penjualan ?? 0,
                ];
            });

        // Get monthly sales data from TransactionList view (only 'selesai' status)
        $monthlySales = TransactionList::selectRaw('
                DATE_FORMAT(PaymentDate, "%Y-%m") as month,
                SUM(CASE WHEN OrderStatus = "selesai" THEN AmountPaid ELSE 0 END) as sales
            ')
            ->whereNotNull('PaymentDate')
            ->where('OrderStatus', 'selesai')
            ->whereDate('PaymentDate', '>=', now()->subMonths(12)) // Last 12 months
            ->groupBy('month')
            ->get()
            ->keyBy('month');

        // Get financial data from the database (expenses and existing data)
        $financialData = FinancialReport::select('ReportMonth', 'TotalRevenue', 'TotalSpending', 'ProfitLoss')
            ->orderBy('ReportMonth', 'desc')
            ->limit(12) // Get last 12 months
            ->get()
            ->map(function ($item) use ($monthlySales) {
                $month = $item->ReportMonth;
                $salesFromTransactionList = $monthlySales->get($month)->sales ?? 0;
                
                return [
                    'month' => $month,
                    'sales' => $salesFromTransactionList, // Use sales from TransactionList (only 'selesai')
                    'expenses' => $item->TotalSpending ?? 0,
                    'profit' => $salesFromTransactionList - ($item->TotalSpending ?? 0), // Calculate profit: sales - expenses
                ];
            });

        return Inertia::render('owner/owner-laporan-penjualan', [
            'salesData' => $salesData,
            'financialData' => $financialData,
        ]);
    }
}