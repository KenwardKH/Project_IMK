<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $invoice['InvoiceID'] }} - {{ config('app.company_name', 'SPL') }}</title>
    <style>
        @page {
            size: A5 landscape;
            margin: 10mm;
        }
        * {
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            font-size: 10pt;
            color: #333;
            margin: 0;
            padding: 0;
            width: 100%;
        }
        .invoice-container {
            padding: 10px;
            width: 100%;
        }
        h2 {
            margin-bottom: 5px;
        }
        .invoice-header,
        .invoice-details {
            width: 100%;
            margin-bottom: 10px;
        }
        .invoice-details td {
            vertical-align: top;
            padding: 4px;
            font-size: 9pt;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .items-table th,
        .items-table td {
            border: 1px solid #ddd;
            padding: 6px;
            font-size: 9pt;
            text-align: left;
        }
        .items-table th {
            background-color: #f5f5f5;
        }
        .total-section {
            text-align: right;
            margin-top: 5px;
            font-size: 10pt;
            font-weight: bold;
        }
    </style>
</head>
<body>
    @php
    \Carbon\Carbon::setLocale('id');
@endphp
    <div class="invoice-container">
        <table class="invoice-header">
            <tr>
                <td width="60%">
                    <h2>{{ config('app.company_name', 'Toko Sinar Pelangi') }}</h2>
                    <p>{{ config('app.company_address', 'Jl Bilal No A4, Medan') }}</p>
                </td>
                <td>
                    <p><strong>No. Invoice:</strong> {{ $invoice['InvoiceID'] }}</p>
<p><strong>Tanggal:</strong> {{ \Carbon\Carbon::parse($invoice['InvoiceDate'])->translatedFormat('d F Y, H:i:s') }}</p>

                </td>
            </tr>
        </table>

        <table class="invoice-details">
            <tr>
                <td><strong>Kepada Yth.:</strong> {{ $invoice['customerName'] ?? 'N/A' }}</td>
                <td><strong>Status:</strong> {{ ucfirst($invoice['status'] ?? 'Pending') }}</td>
            </tr>
            <tr>
                <td><strong>No. Telepon:</strong> {{ $invoice['customerContact'] ?? 'N/A' }}</td>
                <td><strong>Metode Pembayaran:</strong> {{ $invoice['payment_option'] ?? 'Tidak diketahui' }}</td>
            </tr>
            {{-- @if($invoice['delivery_address'])
            <tr>
                <td colspan="2"><strong>Alamat Pengiriman:</strong> {{ $invoice['delivery_address'] }}</td>
            </tr>
            @endif --}}
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Harga Satuan</th>
                    <th>Jumlah</th>
                </tr>
            </thead>
            <tbody>
                @php $no = 1; @endphp
                @foreach ($invoice['items'] as $item)
                    <tr>
                        <td>{{ $no++ }}</td>
                        <td>{{ $item['productName'] }}</td>
                        <td>{{ $item['Quantity'] }}</td>
                        <td>Rp{{ number_format($item['price'], 2, ',', '.') }}</td>
                        <td>Rp{{ number_format($item['price'] * $item['Quantity'], 2, ',', '.') }}</td>
                    </tr>
                @endforeach
                <tr>
                    <td colspan="4" class="total-section">Total</td>
                    <td><strong>Rp{{ number_format($invoice['totalAmount'], 2, ',', '.') }}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>
