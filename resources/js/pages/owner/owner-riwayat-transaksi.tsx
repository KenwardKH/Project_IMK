import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PesananData {
    id: number;
    gambar_produk: string;
    nama_produk: string;
    harga_produk: number;
    jumlah_produk: number;
    satuan_produk: string;
    subtotal: number;
}

interface RiwayatData {
    id: number;
    InvoiceID: string;
    CustomerName: string;
    CustomerContact: string;
    PaymentOption: string;
    TotalAmount: number;
    PaymentDate: string;
    CashierName: string;
    OrderStatus: string;
    InvoiceDate: string;
    pesananData: PesananData[];
    [key: string]: any;
}

interface Props {
    riwayatTransaksi: RiwayatData[];
}

const OwnerRiwayatTransaksi = ({ riwayatTransaksi }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [filteredKasirs, setFilteredKasirs] = useState<RiwayatData[]>(riwayatTransaksi);

    const [selectedRiwayat, setSelectedRiwayat] = useState<PesananData[]>([]);
    const [selectedInvoiceData, setSelectedInvoiceData] = useState<RiwayatData | null>(null);
    const [showPriceModal, setShowPriceModal] = useState(false);

    const statusOptions = ['Menunggu Pembayaran', 'Diproses', 'Menunggu Pengambilan', 'Diantar', 'Selesai', 'Dibatalkan'];

    useEffect(() => {
        let result = riwayatTransaksi;

        if (searchTerm.trim()) {
            result = result.filter(
                (item) =>
                    item.CustomerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.CashierName?.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        if (statusFilter) {
            result = result.filter((item) => item.OrderStatus?.toLowerCase().trim() === statusFilter.toLowerCase().trim());
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            result = result.filter((item) => {
                const tanggal = new Date(item.InvoiceDate);
                return tanggal >= start && tanggal <= end;
            });
        }

        setFilteredKasirs(result);
    }, [searchTerm, startDate, endDate, statusFilter, riwayatTransaksi]);

    const openDetailModal = (transaksi: RiwayatData) => {
        if (!transaksi.pesananData || transaksi.pesananData.length === 0) {
            alert('Data detail pesanan tidak tersedia untuk transaksi ini.');
            return;
        }

        setSelectedRiwayat(transaksi.pesananData);
        setSelectedInvoiceData(transaksi);
        setShowPriceModal(true);
    };

    const closeRiwayatModal = () => {
        setShowPriceModal(false);
        setSelectedRiwayat([]);
        setSelectedInvoiceData(null);
    };

    const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

    const formatDate = (value: string) => new Date(value).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });

    return (
        <OwnerLayout>
            <div className="flex w-full flex-col gap-6 px-6 py-4">
                <h1 className="flex w-full justify-center text-3xl font-bold">Riwayat Transaksi</h1>

                {/* Filter */}
                <section className="mb-6 w-full rounded-xl bg-[#F8FAFC] p-4 shadow-md">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex w-full items-center gap-2 md:w-1/3">
                            <label htmlFor="searchCashier" className="w-28 text-sm font-semibold whitespace-nowrap">
                                Nama Pemesan:
                            </label>
                            <div className="relative w-full">
                                <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    id="searchCashier"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari Pemesan atau Kasir..."
                                    className="h-9 w-full rounded-md border border-gray-300 pr-3 pl-10 text-sm text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex w-full items-center gap-2 md:w-1/3">
                            <label htmlFor="startDate" className="w-28 text-sm font-semibold whitespace-nowrap">
                                Tanggal Mulai:
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="flex w-full items-center gap-2 md:w-1/3">
                            <label htmlFor="endDate" className="w-28 text-sm font-semibold whitespace-nowrap">
                                Tanggal Akhir:
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="flex w-full items-center gap-2 md:w-1/3">
                            <label htmlFor="statusFilter" className="w-28 text-sm font-semibold whitespace-nowrap">
                                Status:
                            </label>
                            <select
                                id="statusFilter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">Pilih Status</option>
                                {statusOptions.map((OrderStatus, i) => (
                                    <option key={i} value={OrderStatus}>
                                        {OrderStatus}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Tabel Riwayat */}
                <section>
                    <div className="relative overflow-hidden rounded-lg shadow-md">
                        <div className="w-full overflow-x-auto rounded-xl">
                            <table className="w-full min-w-[1000px] table-auto border-collapse">
                                <thead className="bg-gray-700 text-sm text-white">
                                    <tr>
                                        {[
                                            'Invoice ID',
                                            'Nama Pemesan',
                                            'Kontak Pemesan',
                                            'Opsi Pembayaran',
                                            'Total',
                                            'Tanggal Pembayaran',
                                            'Nama Kasir',
                                            'Jenis Pesanan',
                                            'Detail',
                                            'Status',
                                            'Tanggal Invoice',
                                        ].map((text, i) => (
                                            <th key={i} className="border border-gray-300 p-4 text-center font-semibold">
                                                {text}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-sm text-gray-700">
                                    {filteredKasirs.length > 0 ? (
                                        filteredKasirs.map((item) => (
                                            <tr key={item.id} className="transition duration-200 hover:bg-gray-100">
                                                <td className="border p-4 text-center">{item.InvoiceID}</td>
                                                <td className="border p-4 text-center">{item.CustomerName}</td>
                                                <td className="border p-4 text-center">{item.CustomerContact}</td>
                                                <td className="border p-4 text-center">{item.PaymentOption}</td>
                                                <td className="border p-4 text-center">{formatCurrency(item.TotalAmount)}</td>
                                                <td className="border p-4 text-center">{formatDate(item.PaymentDate)}</td>
                                                <td className="border p-4 text-center">{item.CashierName ?? 'N/A'}</td>
                                                <td className="border p-4 text-center">{item.CashierName != null ? 'Offline' : 'Online'}</td>
                                                <td className="border p-4 text-center">
                                                    <Button
                                                        onClick={() => openDetailModal(item)}
                                                        className="rounded bg-blue-500 px-3 py-2 text-xs text-white hover:bg-blue-600"
                                                        disabled={!item.pesananData || item.pesananData.length === 0}
                                                    >
                                                        Detail
                                                    </Button>
                                                </td>
                                                <td className="border p-4 text-center">
                                                    <div
                                                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                            item.OrderStatus === 'Selesai'
                                                                ? 'bg-green-100 text-green-800'
                                                                : item.OrderStatus === 'Dibatalkan'
                                                                  ? 'bg-red-100 text-red-800'
                                                                  : item.OrderStatus === 'Diproses'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : item.OrderStatus === 'Diantar'
                                                                      ? 'bg-blue-100 text-blue-800'
                                                                      : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {item.OrderStatus}
                                                    </div>
                                                </td>
                                                <td className="border p-4 text-center">{formatDate(item.InvoiceDate)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={11} className="p-4 text-center text-gray-500">
                                                Data tidak ditemukan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* Modal Detail */}
            {showPriceModal && selectedRiwayat.length > 0 && selectedInvoiceData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeRiwayatModal}>
                    <div
                        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeRiwayatModal}
                            className="absolute top-2 right-2 rounded-full bg-gray-700 p-1 text-white hover:bg-gray-800"
                        >
                            <X size={20} />
                        </button>

                        {/* Header Modal */}
                        <div className="mb-6 border-b pb-4">
                            <h2 className="mb-4 text-center text-2xl font-bold">Detail Transaksi</h2>
                            <div className="flex items-center justify-center">
                                <div className="grid grid-cols-1 gap-4 rounded-xl bg-white p-6 shadow-md md:grid-cols-2">
                                    <div className="flex w-full flex-col justify-center">
                                        <h3 className="mb-2 text-lg font-semibold">Informasi Pemesan</h3>
                                        <p className="mb-1 text-sm">
                                            <strong>Invoice ID:</strong> {selectedInvoiceData.InvoiceID}
                                        </p>
                                        <p className="mb-1 text-sm">
                                            <strong>Nama:</strong> {selectedInvoiceData.CustomerName}
                                        </p>
                                        <p className="mb-1 text-sm">
                                            <strong>Kontak:</strong> {selectedInvoiceData.CustomerContact}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Jenis Pesanan:</strong> {selectedInvoiceData.CashierName != null ? 'Offline' : 'Online'}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="mb-2 text-lg font-semibold">Informasi Pembayaran</h3>
                                        <p className="mb-1 text-sm">
                                            <strong>Opsi Pembayaran:</strong> {selectedInvoiceData.PaymentOption}
                                        </p>
                                        <p className="mb-1 text-sm">
                                            <strong>Total:</strong> {formatCurrency(selectedInvoiceData.TotalAmount)}
                                        </p>
                                        <p className="mb-1 text-sm">
                                            <strong>Tanggal Pembayaran:</strong> {formatDate(selectedInvoiceData.PaymentDate)}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Status:</strong>
                                            <span
                                                className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                                                    selectedInvoiceData.OrderStatus === 'Selesai'
                                                        ? 'bg-green-100 text-green-800'
                                                        : selectedInvoiceData.OrderStatus === 'Dibatalkan'
                                                          ? 'bg-red-100 text-red-800'
                                                          : selectedInvoiceData.OrderStatus === 'Diproses'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : selectedInvoiceData.OrderStatus === 'Diantar'
                                                              ? 'bg-blue-100 text-blue-800'
                                                              : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {selectedInvoiceData.OrderStatus}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detail Pesanan */}
                        <div>
                            <h3 className="mb-4 text-center text-lg font-semibold">Detail Pesanan</h3>
                            <div className="max-h-96 space-y-4 overflow-y-auto">
                                {selectedRiwayat.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="flex gap-4 rounded-lg border bg-gray-50 p-4">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded border bg-white">
                                            {item.gambar_produk ? (
                                                <img
                                                    src={`/storage/${item.gambar_produk}`}
                                                    alt={item.nama_produk}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        target.nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className={`flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400 ${item.gambar_produk ? 'hidden' : ''}`}
                                            >
                                                Tidak ada gambar
                                            </div>
                                        </div>
                                        <div className="flex flex-1 items-center justify-between">
                                            <div>
                                                <h4 className="text-base font-semibold">{item.nama_produk}</h4>
                                                <p className="text-sm text-gray-600">
                                                    Harga: <span className="font-semibold text-orange-600">{formatCurrency(item.harga_produk)}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Jumlah:
                                                    <span className="ml-1 font-semibold text-orange-600">
                                                        {item.jumlah_produk} {item.satuan_produk}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-600">Subtotal</p>
                                                <p className="text-lg font-bold text-orange-600">{formatCurrency(item.subtotal)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="mt-6 border-t pt-4">
                                <div className="text-right">
                                    <p className="text-xl font-bold">
                                        Total Keseluruhan:
                                        <span className="ml-2 text-green-600">
                                            {formatCurrency(selectedRiwayat.reduce((acc, item) => acc + item.subtotal, 0))}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </OwnerLayout>
    );
};

export default OwnerRiwayatTransaksi;
