import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/cashier-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface OrderData {
    id: number;
    custid: number;
    name: string;
    contact: string;
    date: string;
    type: string;
    payment: string;
    cid: number;
    cname: string;
    details: DetailData[];
    payments: PaymentData[];
    pickup: PickupData[];
    delivery: DeliveryData[];
}

interface DetailData {
    InvoiceID: number;
    id: number;
    name: string;
    gambar: string;
    quantity: number;
    unit: string;
    price: number;
}

interface PickupData {
    id: number;
    invid: number;
    status: string;
    updated_at: string;
    created_at: string;
    updated_by: number;
}

interface DeliveryData {
    id: number;
    invid: number;
    status: string;
    alamat: string;
    updated_at: string;
    created_at: string;
    updated_by: number;
}

interface PaymentData {
    InvoiceID: number;
    id: number;
    date: string;
    amount: string;
    gambar: string;
}

interface PaginatedOrders {
    data: OrderData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    // Tambahan jika dibutuhkan:
    from: number;
    to: number;
}

interface Props {
    orders: PaginatedOrders;
}

export default function OrderList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalImage, setModalImage] = useState<string | null>(null);
    const { orders } = usePage<Props>().props;
    const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
    const pickupStatuses = ['menunggu pengambilan', 'selesai'];
    const deliveryStatuses = ['diproses', 'diantar', 'selesai'];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'pickup' | 'delivery'>('pickup');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [modalType, setModalType] = useState<'cancel' | 'detail' | null>(null);
    const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [jumpToPage, setJumpToPage] = useState('');
    const [totalItems, setTotalItems] = useState(0); // Total data dari API/database
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handlePrintInvoice = (orderId: number) => {
        const invoiceUrl = `/order/${orderId}/invoice-other`;
        window.open(invoiceUrl, '_blank');
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    const getCurrentStatus = (order: OrderData): string => {
        if (order.type === 'pickup') {
            return order.pickup?.[0]?.status ?? '';
        } else if (order.type === 'delivery') {
            return order.delivery?.[0]?.status ?? '';
        }
        return '';
    };

    const handleOpenCancelModal = (order: OrderData) => {
        setSelectedOrder(order);
        setModalType('cancel'); // modal cancel
        setIsModalOpen(true);
    };

    const handleOpenDetailModal = (order: OrderData) => {
        setSelectedOrder(order);
        setModalType('detail'); // modal detail
        setIsModalOpen(true);
    };

    const openModal = (imageUrl: string) => {
        setModalImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setModalImage(null);
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus produk ini?')) {
            router.delete(`/cashier/orders/${id}`);
        }
    };

    const handleStatusChange = (orderId: number, newStatus: string, type: 'pickup' | 'delivery') => {
        router.post(
            `/cashier/update-status/${orderId}`,
            {
                status: newStatus,
                type: type,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Status berhasil diupdate');
                    router.reload({ only: ['orders'] }); // opsional agar data terupdate
                },
                onError: () => {
                    alert('Gagal mengubah status');
                },
            },
        );
    };

    const processCancel = async () => {
        // Validasi jika customerName atau contact diperlukan
        if (!cancelReason.trim()) {
            const confirmLanjut = confirm('Data pelanggan belum lengkap. Lanjutkan mengisi!');
            if (!confirmLanjut) return;
        }

        setIsProcessingCheckout(true);

        try {
            const response = await fetch('/cashier/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    id: selectedOrder?.id, // Kirim ID pesanan
                    cancellation_reason: cancelReason || null,
                    // cancelled_by: selectedOrder?.cid,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Pembatalan berhasil, silahkan lakukan transaksi lainnya!');
                router.visit('/cashier/orders/status'); // Redirect ke halaman dashboard atau order
            } else {
                console.error('Response error:', data);
                alert(data.error || 'Gagal melakukan pembatalan');
            }
        } catch (error) {
            console.error('Error during cancel:', error);
            alert('Terjadi kesalahan saat pembatalan');
        } finally {
            setIsProcessingCheckout(false);
        }
    };

    // Step 1: Filter berdasarkan jenis pesanan (pickup/delivery)
    const typeOrders = orders.data.filter((order) => order.type === activeTab);

    // Step 2: Filter berdasarkan pencarian nama
    const filteredOrders = typeOrders.filter(
        (order) =>
            typeof order.name === 'string' &&
            order.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            ((Array.isArray(order.pickup) && order.pickup.some((p) => p.status !== 'menunggu pembayaran')) ||
                (Array.isArray(order.delivery) && order.delivery.some((d) => d.status !== 'menunggu pembayaran'))),
    );

    const sortedOrder = filteredOrders.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });
    const sortedByDate = sortedOrder.filter((order) => {
        const orderDate = new Date(order.date).getTime();

        if (startDate && endDate) {
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();
            return orderDate >= start && orderDate <= end;
        }

        if (startDate) {
            const start = new Date(startDate).getTime();
            return orderDate >= start;
        }

        if (endDate) {
            const end = new Date(endDate).getTime();
            return orderDate <= end;
        }

        return true; // kalau dua-duanya kosong
    });
    const activeOrders = sortedByDate;

    return (
        <AppLayout>
            <Head title="Status Pesanan" />
            <section id="status-pesanan" className="mb-12">
                <div className="flex w-full flex-col px-6">
                    <h1 className="mt-5 mb-10 text-center text-3xl font-bold">Status Pesanan</h1>
                    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                        {/* Top Row - Status Tabs */}
                        <div className="mb-6 flex flex-wrap gap-3">
                            <div className="flex rounded-lg border bg-gray-50 p-1">
                                <button
                                    onClick={() => setActiveTab('pickup')}
                                    className={`rounded-md px-6 py-2.5 font-medium transition-all duration-200 ${
                                        activeTab === 'pickup'
                                            ? 'scale-105 transform bg-blue-600 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-white hover:text-blue-600'
                                    }`}
                                >
                                    Ambil di Toko
                                </button>
                                <button
                                    onClick={() => setActiveTab('delivery')}
                                    className={`rounded-md px-6 py-2.5 font-medium transition-all duration-200 ${
                                        activeTab === 'delivery'
                                            ? 'scale-105 transform bg-blue-600 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-white hover:text-red-600'
                                    }`}
                                >
                                    Ambil sendiri
                                </button>
                            </div>
                        </div>

                        {/* Bottom Row - Search and Filters */}
                        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
                            {/* Left Side - Filters */}
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Sort Button */}
                                <button
                                    onClick={toggleSortOrder}
                                    className="flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                                        />
                                    </svg>
                                    Urutkan ({sortOrder.toUpperCase()})
                                </button>

                                {/* Date Range Picker */}
                                <div className="flex items-center gap-2 rounded-lg border bg-gray-50 p-2">
                                    <div className="flex items-center gap-2">
                                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="border-0 bg-transparent text-sm text-gray-700 focus:ring-0 focus:outline-none"
                                        />
                                    </div>
                                    <span className="px-1 text-gray-400">—</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="border-0 bg-transparent text-sm text-gray-700 focus:ring-0 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Right Side - Search */}
                            <div className="relative w-full max-w-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari nama customer..."
                                    className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 pr-4 pl-12 text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(searchTerm || startDate || endDate) && (
                            <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
                                <span className="text-sm font-medium text-gray-500">Filter aktif:</span>
                                {searchTerm && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                        Customer: {searchTerm}
                                        <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-blue-600">
                                            ×
                                        </button>
                                    </span>
                                )}
                                {startDate && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                        Dari: {startDate}
                                        <button onClick={() => setStartDate('')} className="ml-1 hover:text-green-600">
                                            ×
                                        </button>
                                    </span>
                                )}
                                {endDate && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                        Sampai: {endDate}
                                        <button onClick={() => setEndDate('')} className="ml-1 hover:text-green-600">
                                            ×
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Table */}
                    <div className="overflow-auto rounded-lg shadow-md">
                        <table className="w-full min-w-[800px] table-auto border-collapse text-sm">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-3 text-center">No.</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Invoice ID</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Nama Pemesan</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">No. Telepon</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Jumlah Produk</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Total Harga</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Alamat</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Opsi Pembayaran</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Detail</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Cetak Invoice</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Tanggal Pemesanan</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Hapus</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-gray-700">
                                {activeOrders.length > 0 ? (
                                    activeOrders.map((item, index) => (
                                        <tr key={item.id} className="transition duration-200 hover:bg-gray-100">
                                            <td className="border border-gray-200 px-4 py-3 text-center">{index + 1}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.id}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.name}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.contact}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                {item.details.reduce((sum, detail) => sum + detail.quantity, 0)}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                {item.payments.length > 0 ? (
                                                    item.payments.map((detail, idx) => <span key={idx}>{detail.amount}</span>)
                                                ) : (
                                                    <span>
                                                        {' '}
                                                        Rp
                                                        {item.details
                                                            .reduce((total, detail) => total + detail.price * detail.quantity, 0)
                                                            .toLocaleString('id-ID')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                {item.delivery.length > 0 ? (
                                                    item.delivery.map((detail, idx) => <span key={idx}>{detail.alamat}</span>)
                                                ) : (
                                                    <span>Diambil di Toko</span>
                                                )}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.payment}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                <Button
                                                    onClick={() => handleOpenDetailModal(item)}
                                                    className="rounded bg-green-500 px-3 py-1 text-white hover:bg-blue-600"
                                                >
                                                    Detail
                                                </Button>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                {item.delivery?.some((d) => d.status === 'selesai') ||
                                                item.pickup?.some((p) => p.status === 'selesai') ? (
                                                    item.invoice_id ? (
                                                        <Button
                                                            className="h-8 rounded-md bg-blue-500 px-4 text-xs font-medium text-white hover:bg-blue-600"
                                                            onClick={() => handlePrintInvoice(item.invoice_id)}
                                                        >
                                                            Cetak Invoice
                                                        </Button>
                                                    ) : (
                                                        'Tidak tersedia!'
                                                    )
                                                ) : (
                                                    'Tidak tersedia!'
                                                )}
                                            </td>

                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.date}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                <Button
                                                    onClick={() => handleOpenCancelModal(item)}
                                                    className="rounded-full bg-red-500 p-2 text-white shadow transition hover:cursor-pointer hover:bg-red-600"
                                                    size="icon"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                <select
                                                    value={item.type === 'pickup' ? item.pickup?.[0]?.status : item.delivery?.[0]?.status}
                                                    onChange={(e) => handleStatusChange(item.id, e.target.value, item.type as 'pickup' | 'delivery')}
                                                    className="rounded border px-2 py-1"
                                                >
                                                    {item.delivery?.[0]?.status !== 'dibatalkan' &&
                                                        (item.type === 'pickup' ? pickupStatuses : deliveryStatuses).map((status) => (
                                                            <option key={status} value={status}>
                                                                {status}
                                                            </option>
                                                        ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={13} className="border border-gray-200 px-4 py-6 text-center text-gray-500">
                                            Tidak ada pesanan yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {/* <div className="mt-4 flex justify-center gap-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span>Halaman {currentPage} dari {totalPages}</span>
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div> */}
                    </div>
                    {/* Pagination */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            {/* Pagination Info */}
                            <div className="text-sm text-gray-600">
                                Menampilkan <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> -{' '}
                                <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari{' '}
                                <span className="font-semibold text-gray-900">{totalItems}</span> pesanan
                            </div>

                            {/* Items Per Page Selector */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Tampilkan:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="rounded-md border border-gray-200 px-3 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-sm text-gray-600">per halaman</span>
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center gap-2">
                                {/* First Page Button */}
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        currentPage === 1
                                            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                            : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                    title="Halaman Pertama"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                    </svg>
                                </button>

                                {/* Previous Page Button */}
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        currentPage === 1
                                            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                            : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                    title="Halaman Sebelumnya"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                    {(() => {
                                        const totalPages = Math.ceil(totalItems / itemsPerPage);
                                        const pages = [];
                                        let startPage = Math.max(1, currentPage - 2);
                                        let endPage = Math.min(totalPages, currentPage + 2);

                                        // Adjust if we're near the beginning or end
                                        if (currentPage <= 3) {
                                            endPage = Math.min(5, totalPages);
                                        }
                                        if (currentPage >= totalPages - 2) {
                                            startPage = Math.max(totalPages - 4, 1);
                                        }

                                        // Add first page and ellipsis if needed
                                        if (startPage > 1) {
                                            pages.push(
                                                <button
                                                    key={1}
                                                    onClick={() => setCurrentPage(1)}
                                                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                                                >
                                                    1
                                                </button>,
                                            );
                                            if (startPage > 2) {
                                                pages.push(
                                                    <span key="ellipsis1" className="px-2 py-2 text-gray-400">
                                                        ...
                                                    </span>,
                                                );
                                            }
                                        }

                                        // Add page numbers
                                        for (let i = startPage; i <= endPage; i++) {
                                            pages.push(
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i)}
                                                    className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                                        currentPage === i
                                                            ? 'scale-105 transform bg-blue-600 text-white shadow-md'
                                                            : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {i}
                                                </button>,
                                            );
                                        }

                                        // Add last page and ellipsis if needed
                                        if (endPage < totalPages) {
                                            if (endPage < totalPages - 1) {
                                                pages.push(
                                                    <span key="ellipsis2" className="px-2 py-2 text-gray-400">
                                                        ...
                                                    </span>,
                                                );
                                            }
                                            pages.push(
                                                <button
                                                    key={totalPages}
                                                    onClick={() => setCurrentPage(totalPages)}
                                                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                                                >
                                                    {totalPages}
                                                </button>,
                                            );
                                        }

                                        return pages;
                                    })()}
                                </div>

                                {/* Next Page Button */}
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalItems / itemsPerPage)))}
                                    disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        currentPage === Math.ceil(totalItems / itemsPerPage)
                                            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                            : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                    title="Halaman Selanjutnya"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {/* Last Page Button */}
                                <button
                                    onClick={() => setCurrentPage(Math.ceil(totalItems / itemsPerPage))}
                                    disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        currentPage === Math.ceil(totalItems / itemsPerPage)
                                            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                            : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                    title="Halaman Terakhir"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Quick Jump to Page (Mobile-friendly) */}
                        <div className="mt-4 flex flex-col items-center justify-center gap-4 border-t border-gray-100 pt-4 sm:flex-row">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Lompat ke halaman:</span>
                                <input
                                    type="number"
                                    min="1"
                                    max={Math.ceil(totalItems / itemsPerPage)}
                                    value={jumpToPage || ''}
                                    onChange={(e) => setJumpToPage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            const page = parseInt(jumpToPage);
                                            if (page >= 1 && page <= Math.ceil(totalItems / itemsPerPage)) {
                                                setCurrentPage(page);
                                                setJumpToPage('');
                                            }
                                        }
                                    }}
                                    placeholder="No"
                                    className="w-16 rounded-md border border-gray-200 px-2 py-1 text-center text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => {
                                        const page = parseInt(jumpToPage);
                                        if (page >= 1 && page <= Math.ceil(totalItems / itemsPerPage)) {
                                            setCurrentPage(page);
                                            setJumpToPage('');
                                        }
                                    }}
                                    className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-blue-700"
                                >
                                    Go
                                </button>
                            </div>

                            <div className="text-xs text-gray-500">Total {Math.ceil(totalItems / itemsPerPage)} halaman</div>
                        </div>
                    </div>
                </div>
                {isModalOpen && modalImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeModal}>
                        <div className="relative w-full max-w-lg rounded-lg bg-white p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 rounded-full bg-black/60 px-4 py-1 text-3xl font-bold text-white transition hover:cursor-pointer hover:bg-black/80"
                            >
                                &times;
                            </button>
                            <img src={modalImage} alt="Preview" className="max-h-[80vh] w-full rounded-lg object-contain" />
                        </div>
                    </div>
                )}
                {isModalOpen && selectedOrder && modalType === 'cancel' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={handleCloseModal}>
                        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold">Batalkan Pesanan</h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-red-500">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="max-h-[400px] space-y-4 overflow-y-auto">
                                <Label className="block text-sm font-medium text-gray-700">Alasan Pembatalan</Label>
                                <Input
                                    id="cancelReason"
                                    type="text"
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)} // Penting! supaya alasan tersimpan
                                    placeholder="Masukkan alasan pembatalan"
                                    className="mt-1 mb-4 w-full"
                                />
                                <button onClick={processCancel} className="text-gray-500 hover:text-red-500">
                                    Batalkan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {isModalOpen && selectedOrder && modalType === 'detail' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={handleCloseModal}>
                        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold">Detail Pesanan</h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-red-500">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="max-h-[400px] space-y-4 overflow-y-auto">
                                {selectedOrder.details?.map((detailItem, index) => (
                                    <div key={index} className="rounded-lg border p-4">
                                        <p>
                                            <strong>Nama Produk:</strong> {detailItem.name}
                                        </p>
                                        <p>
                                            <strong>Jumlah:</strong> {detailItem.quantity} {detailItem.unit}
                                        </p>
                                        <p>
                                            <strong>Harga:</strong> Rp{detailItem.price}
                                        </p>
                                        {detailItem.gambar && (
                                            <img
                                                src={`/storage/${detailItem.gambar}`}
                                                alt={detailItem.name}
                                                className="mt-2 h-24 w-24 rounded object-cover"
                                            />
                                        )}
                                    </div>
                                ))}
                                {selectedOrder.details?.length === 0 && (
                                    <p className="text-center text-gray-500">Tidak ada detail untuk pesanan ini.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </AppLayout>
    );
}
