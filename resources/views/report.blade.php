<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Pesanan</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
        }

        .header {
            text-align: center;
            margin-top: 30px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
        }

        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 5px;
        }

        .report-title {
            font-size: 18px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 10px;
        }

        .report-info {
            font-size: 12px;
            color: #6b7280;
        }

        .statistics {
            display: table;
            width: 100%;
            margin-bottom: 25px;
            border-collapse: collapse;
        }

        .stat-row {
            display: table-row;
        }

        .stat-item {
            display: table-cell;
            width: 25%;
            padding: 15px;
            text-align: center;
            background: #f8fafc;
            border: 1px solid #e5e7eb;
        }

        .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #1e40af;
            display: block;
        }

        .stat-label {
            font-size: 11px;
            color: #6b7280;
            margin-top: 5px;
        }

        .filters-info {
            background: #eff6ff;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #2563eb;
        }

        .filters-info h3 {
            font-size: 14px;
            color: #1e40af;
            margin-bottom: 8px;
        }

        .filter-item {
            display: inline-block;
            margin-right: 20px;
            font-size: 12px;
        }

        .filter-label {
            font-weight: bold;
            color: #374151;
        }

        .table-container {
            margin-top: 20px;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 10px;
        }

        .data-table th {
            background: #374151;
            color: white;
            padding: 10px 6px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #4b5563;
        }

        .data-table td {
            padding: 8px 6px;
            text-align: center;
            border: 1px solid #d1d5db;
            vertical-align: middle;
        }

        .data-table tbody tr:nth-child(even) {
            background: #f9fafb;
        }

        .data-table tbody tr:hover {
            background: #f3f4f6;
        }

        .invoice-id {
            font-weight: bold;
            color: #1e40af;
        }

        .customer-name {
            font-weight: 600;
            color: #374151;
        }

        .payment-method {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .payment-tunai {
            background: #dcfce7;
            color: #166534;
        }

        .payment-transfer {
            background: #dbeafe;
            color: #1e40af;
        }

        .total-price {
            font-weight: bold;
            color: #059669;
        }

        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
        }

        .generated-info {
            margin-top: 10px;
        }

        .page-break {
            page-break-after: always;
        }

        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }

        .no-data {
            text-align: center;
            padding: 40px;
            color: #6b7280;
            font-style: italic;
        }

        .summary-section {
            margin-top: 25px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }

        .summary-title {
            font-size: 14px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 10px;
        }

        .payment-summary {
            display: table;
            width: 100%;
        }

        .payment-row {
            display: table-row;
        }

        .payment-cell {
            display: table-cell;
            padding: 5px 10px;
            border-bottom: 1px solid #e5e7eb;
        }

        .payment-method-name {
            font-weight: 600;
        }

        .payment-count {
            text-align: right;
            font-weight: bold;
            color: #1e40af;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">Toko ATK Sinar Pelangi</div>
        <div class="report-title">LAPORAN PESANAN</div>
        <div class="report-info">
            Dicetak pada: {{ date('d F Y') }} WIB
        </div>
    </div>

    <div class="filters-info">
        {{-- <h3>Filter Laporan</h3> --}}
        <div class="filter-item">
            <span class="filter-label">Periode:</span> {{ $statistics['period_text'] }}
        </div>
        <div class="filter-item">
            <span class="filter-label">Metode Pembayaran:</span> {{ $statistics['payment_filter_text'] }}
        </div>
    </div>

    <div class="statistics">
        <div class="stat-row">
            <div class="stat-item">
                <span class="stat-value">{{ number_format($statistics['total_orders']) }}</span>
                <div class="stat-label">Total Pesanan</div>
            </div>
            <div class="stat-item">
                <span class="stat-value">{{ number_format($statistics['total_products']) }}</span>
                <div class="stat-label">Total Produk Terjual</div>
            </div>
            <div class="stat-item">
                <span class="stat-value">Rp {{ number_format($statistics['total_revenue'], 0, ',', '.') }}</span>
                <div class="stat-label">Total Pendapatan</div>
            </div>
            <div class="stat-item">
                <span class="stat-value">Rp {{ $statistics['total_orders'] > 0 ? number_format($statistics['total_revenue'] / $statistics['total_orders'], 0, ',', '.') : '0' }}</span>
                <div class="stat-label">Rata-rata per Pesanan</div>
            </div>
        </div>
    </div>

    @if(count($statistics['payment_methods']) > 0)
    <div class="summary-section">
        <div class="summary-title">Ringkasan Metode Pembayaran</div>
        <div class="payment-summary">
            @foreach($statistics['payment_methods'] as $method => $count)
            <div class="payment-row">
                <div class="payment-cell payment-method-name">{{ ucfirst($method) }}</div>
                <div class="payment-cell payment-count">{{ number_format($count) }} pesanan ({{ round(($count / $statistics['total_orders']) * 100, 1) }}%)</div>
            </div>
            @endforeach
        </div>
    </div>
    @endif

    <div class="table-container">
        @if(count($orders) > 0)
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 4%;">No</th>
                    <th style="width: 12%;">Invoice ID</th>
                    <th style="width: 18%;">Nama Pemesan</th>
                    <th style="width: 12%;">No. Telepon</th>
                    <th style="width: 8%;">Jml Produk</th>
                    <th style="width: 15%;">Total Harga</th>
                    <th style="width: 10%;">Pembayaran</th>
                    {{-- <th style="width: 8%;">Tipe</th> --}}
                    <th style="width: 13%;">Tanggal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($orders as $index => $order)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td class="invoice-id">{{ $order->invoice_id }}</td>
                    <td class="customer-name">{{ $order->name }}</td>
                    <td>{{ $order->contact }}</td>
                    <td>
                        @php
                            $totalQty = 0;
                            foreach($order->details as $detail) {
                                $totalQty += $detail['quantity'];
                            }
                        @endphp
                        {{ $totalQty }}
                    </td>
                    <td class="total-price">
                        @php
                            $totalPrice = 0;
                            foreach($order->details as $detail) {
                                $totalPrice += $detail['price'] * $detail['quantity'];
                            }
                        @endphp
                        Rp {{ number_format($totalPrice, 0, ',', '.') }}
                    </td>
                    <td>
                        <span class="payment-method payment-{{ strtolower($order->payment) }}">
                            {{ ucfirst($order->payment) }}
                        </span>
                    </td>
                    {{-- <td>{{ ucfirst($order->type) }}</td> --}}
                    <td>{{ date('d/m/Y H:i', strtotime($order->date)) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @else
        <div class="no-data">
            <p>Tidak ada data pesanan yang ditemukan untuk periode dan filter yang dipilih.</p>
        </div>
        @endif
    </div>

    <div class="footer">
        <div>
            <strong>Toko Sinar Pelangi</strong>
        </div>
        <div class="generated-info">
            Laporan ini dibuat secara otomatis oleh sistem pada {{ date('d F Y, H:i:s') }} WIB
        </div>
    </div>
</body>
</html>
