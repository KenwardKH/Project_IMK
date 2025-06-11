import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
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

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData {
    data: RiwayatData[];
    current_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    last_page: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    links: PaginationLinks[];
}

interface Props {
    riwayatTransaksi: PaginatedData;
    availableStatuses?: string[];
    filters?: {
        search?: string;
        status?: string;
        start_date?: string;
        end_date?: string;
        per_page?: number;
    };
}

const OwnerRiwayatTransaksi = ({ riwayatTransaksi, availableStatuses = [], filters = {} }: Props) => {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [statusFilter, setStatusFilter] = useState(filters.status);
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    const [selectedRiwayat, setSelectedRiwayat] = useState<PesananData[]>([]);
    const [selectedInvoiceData, setSelectedInvoiceData] = useState<RiwayatData | null>(null);
    const [showPriceModal, setShowPriceModal] = useState(false);

    const statusOptions = ['Menunggu Pembayaran', 'Diproses', 'Menunggu Pengambilan', 'Diantar', 'Selesai', 'Dibatalkan'];

    // PERBAIKAN: Fungsi applyFilters yang include semua filter termasuk status
    const applyFilters = () => {
        const params = new URLSearchParams();

        if (searchTerm.trim()) {
            params.append('search', searchTerm.trim());
        }
        if (startDate) {
            params.append('start_date', startDate);
        }
        if (endDate) {
            params.append('end_date', endDate);
        }
        // PENTING: Include status filter dalam pagination
        if (statusFilter) {
            params.append('status', statusFilter);
        }
        if (perPage && perPage !== 10) {
            params.append('per_page', perPage.toString());
        }

        // Reset to first page when filtering
        router.get(window.location.pathname, Object.fromEntries(params), {
            preserveState: true,
            replace: true,
        });
    };

    // Auto-apply filters with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            applyFilters();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, startDate, endDate, statusFilter, perPage]);

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

    // PERBAIKAN: handlePageChange dengan preserve semua filter
    const handlePageChange = (url: string | null) => {
        if (!url) return;

        try {
            const urlObj = new URL(url, window.location.origin);

            // Preserve current filters when changing pages
            if (searchTerm.trim()) {
                urlObj.searchParams.set('search', searchTerm.trim());
            }
            if (statusFilter) {
                urlObj.searchParams.set('status', statusFilter);
            }
            if (startDate) {
                urlObj.searchParams.set('start_date', startDate);
            }
            if (endDate) {
                urlObj.searchParams.set('end_date', endDate);
            }
            if (perPage && perPage !== 10) {
                urlObj.searchParams.set('per_page', perPage.toString());
            }

            router.get(
                urlObj.pathname + urlObj.search,
                {},
                {
                    preserveState: true,
                    replace: true,
                },
            );
        } catch (error) {
            console.error('Invalid URL:', url);
        }
    };

    // PERBAIKAN: goToPage function yang lebih konsisten
    const goToPage = (page: number) => {
        const params = new URLSearchParams();

        // Set page parameter
        params.set('page', page.toString());

        // Preserve all current filters
        if (searchTerm.trim()) {
            params.set('search', searchTerm.trim());
        }
        if (statusFilter) {
            params.set('status', statusFilter);
        }
        if (startDate) {
            params.set('start_date', startDate);
        }
        if (endDate) {
            params.set('end_date', endDate);
        }
        if (perPage && perPage !== 10) {
            params.set('per_page', perPage.toString());
        }

        router.get(
            window.location.pathname + '?' + params.toString(),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    //PDF
    const [currentFilters, setCurrentFilters] = useState({
        period: 'month',
        payment_filter: 'all',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const handleFilterChange = (filterType: string, value: string) => {
        const newFilters = {
            ...currentFilters,
            [filterType]: value,
        };
        setCurrentFilters(newFilters);
    };

    const generatePDF = () => {
        setIsGeneratingPDF(true);
        const params = new URLSearchParams(currentFilters);
        const pdfUrl = `/report/generate-pdf?${params.toString()}`;
        window.open(pdfUrl, '_blank');

        setTimeout(() => {
            setIsGeneratingPDF(false);
            setIsDialogOpen(false);
        }, 2000);
    };

    // Fixed Pagination Component
    const PaginationComp = ({ paginationData }: { paginationData: PaginatedData }) => {
        if (paginationData.last_page <= 1) return null;

        const generatePageNumbers = () => {
            const current = paginationData.current_page;
            const total = paginationData.last_page;
            const pages: (number | string)[] = [];

            if (total <= 7) {
                // Show all pages if total is 7 or less
                for (let i = 1; i <= total; i++) {
                    pages.push(i);
                }
            } else {
                // Show first page
                pages.push(1);

                if (current > 4) {
                    pages.push('...');
                }

                // Show pages around current page
                const start = Math.max(2, current - 1);
                const end = Math.min(total - 1, current + 1);

                for (let i = start; i <= end; i++) {
                    if (!pages.includes(i)) {
                        pages.push(i);
                    }
                }

                if (current < total - 3) {
                    pages.push('...');
                }

                // Show last page
                if (!pages.includes(total)) {
                    pages.push(total);
                }
            }

            return pages;
        };

        const pageNumbers = generatePageNumbers();

        return (
            <div className="mt-6 flex flex-col items-center gap-4">
                {/* Pagination Info */}
                <div className="text-sm text-gray-600">
                    Menampilkan {paginationData.from || 0} sampai {paginationData.to || 0} dari {paginationData.total} hasil
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {/* Previous Button */}
                    <Button
                        onClick={() => handlePageChange(paginationData.prev_page_url)}
                        disabled={!paginationData.prev_page_url}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                    >
                        <ChevronLeft size={16} />
                        Sebelumnya
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex flex-wrap items-center gap-1">
                        {pageNumbers.map((page, index) => (
                            <Button
                                key={index}
                                onClick={() => (typeof page === 'number' ? goToPage(page) : undefined)}
                                variant={page === paginationData.current_page ? 'default' : 'outline'}
                                size="sm"
                                className={`min-w-[40px] ${page === paginationData.current_page ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                                disabled={typeof page !== 'number'}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>

                    {/* Next Button */}
                    <Button
                        onClick={() => handlePageChange(paginationData.next_page_url)}
                        disabled={!paginationData.next_page_url}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                    >
                        Selanjutnya
                        <ChevronRight size={16} />
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <OwnerLayout>
            <Head title="Riwayat Transaksi" />
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

                    {/* Filter dan Generate PDF */}
                    {statusFilter === 'Selesai' ? (
                        <div className="my-6 flex justify-end">
                            <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 text-white hover:bg-blue-700">
                                Cetak Laporan
                            </Button>

                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Filter Laporan</DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium">Periode</label>
                                            <select
                                                value={currentFilters.period}
                                                onChange={(e) => handleFilterChange('period', e.target.value)}
                                                className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="day">Hari Ini</option>
                                                <option value="month">Bulan Ini</option>
                                                <option value="year">Tahun Ini</option>
                                                <option value="all">Semua Waktu</option>
                                            </select>
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium">Metode Pembayaran</label>
                                            <select
                                                value={currentFilters.payment_filter}
                                                onChange={(e) => handleFilterChange('payment_filter', e.target.value)}
                                                className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="all">Semua Metode</option>
                                                <option value="tunai">Tunai</option>
                                                <option value="transfer">Transfer</option>
                                            </select>
                                        </div>

                                        <Button
                                            onClick={generatePDF}
                                            disabled={isGeneratingPDF}
                                            className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            {isGeneratingPDF ? (
                                                <>
                                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                                    Membuat PDF...
                                                </>
                                            ) : (
                                                <>Cetak Sekarang</>
                                            )}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    ) : (
                        ''
                    )}
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
                                    {riwayatTransaksi.data && riwayatTransaksi.data.length > 0 ? (
                                        riwayatTransaksi.data.map((item) => (
                                            <tr key={item.id} className="transition duration-200 hover:bg-gray-100">
                                                <td className="border p-4 text-center">{item.InvoiceID}</td>
                                                <td className="border p-4 text-center">{item.CustomerName}</td>
                                                <td className="border p-4 text-center">{item.CustomerContact}</td>
                                                <td className="border p-4 text-center">{item.PaymentOption}</td>
                                                <td className="border p-4 text-center">{formatCurrency(item.TotalAmount)}</td>
                                                <td className="border p-4 text-center">
                                                    {item.PaymentDate ? formatDate(item.PaymentDate) : 'Belum Dibayar'}
                                                </td>
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
                                            <td colSpan={10} className="p-4 text-center text-gray-500">
                                                Data tidak ditemukan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Pagination */}
                <PaginationComp paginationData={riwayatTransaksi} />
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
