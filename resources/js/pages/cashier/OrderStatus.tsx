import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/cashier-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Check, Search, X } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

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
    const pickupStatuses = ['diproses', 'menunggu pengambilan'];
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
    const [totalItems, setTotalItems] = useState(0);

    // Updated sorting states - default to date desc
    const [sortBy, setSortBy] = useState<'name' | 'date' | 'price'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // New price filter states
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handlePrintInvoice = (orderId: number) => {
        const invoiceUrl = `/order/${orderId}/invoice-other`;
        window.open(invoiceUrl, '_blank');
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    const handleSortChange = (newSortBy: 'name' | 'date' | 'price') => {
        if (sortBy === newSortBy) {
            toggleSortOrder();
        } else {
            setSortBy(newSortBy);
            setSortOrder('asc');
        }
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
        setModalType('cancel');
        setIsModalOpen(true);
    };

    const handleOpenDetailModal = (order: OrderData) => {
        setSelectedOrder(order);
        setModalType('detail');
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

    const handleConfirm = async (orderId: number) => {
        try {
            const result = await Swal.fire({
                title: 'Konfirmasi',
                text: 'Apakah Anda yakin ingin menyelesaikan pesanan ini?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Selesaikan!',
                cancelButtonText: 'Batal',
            });

            if (result.isConfirmed) {
                await router.post(
                    `/cashier/success/${orderId}`,
                    {},
                    {
                        onSuccess: async () => {
                            await Swal.fire({
                                icon: 'success',
                                title: 'Berhasil!',
                                text: 'Pesanan berhasil diselesaikan!',
                            });
                            router.reload({ only: ['orders'] });
                        },
                        onError: async (errors) => {
                            console.error('Gagal menyelesaikan pesanan:', errors);
                            await Swal.fire({
                                icon: 'error',
                                title: 'Gagal!',
                                text: 'Terjadi kesalahan saat menyelesaikan pesanan.',
                            });
                        },
                    },
                );
            } else {
                console.log('Aksi dibatalkan oleh pengguna.');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            await Swal.fire({
                icon: 'error',
                title: 'Kesalahan Tak Terduga',
                text: 'Terjadi kesalahan tak terduga saat menyelesaikan pesanan.',
            });
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
                    Swal.fire({
                        icon: 'success',
                        title: 'Status Diperbarui',
                        text: `Status berhasil diubah menjadi "${capitalize(newStatus)}"`,
                        showConfirmButton: true,
                    });
                    router.reload({ only: ['orders'] });
                },
                onError: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: 'Gagal mengubah status. Silakan coba lagi.',
                    });
                },
            },
        );
    };

    const processCancel = async () => {
        if (!cancelReason.trim()) {
            const result = await Swal.fire({
                icon: 'warning',
                title: 'Alasan pembatalan belum diisi',
                text: 'Apakah kamu ingin melanjutkan mengisi alasan pembatalan?',
                showCancelButton: true,
                confirmButtonText: 'Ya, isi dulu',
                cancelButtonText: 'Batal',
            });

            if (!result.isConfirmed) return;
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
                    id: selectedOrder?.id,
                    cancellation_reason: cancelReason || null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Pembatalan Berhasil',
                    text: 'Silakan lakukan transaksi lainnya!',
                });
                router.visit('/cashier/orders/status');
            } else {
                console.error('Response error:', data);
                await Swal.fire({
                    icon: 'error',
                    title: 'Pembatalan Gagal',
                    text: data.error || 'Gagal melakukan pembatalan.',
                });
            }
        } catch (error) {
            console.error('Error during cancel:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Terjadi kesalahan saat pembatalan.',
            });
        } finally {
            setIsProcessingCheckout(false);
        }
    };

    // Helper function to calculate total price of an order
    const calculateOrderTotal = (order: OrderData): number => {
        if (order.payments.length > 0) {
            return parseFloat(order.payments[0].amount.replace(/[^\d]/g, '')) || 0;
        }
        return order.details.reduce((total, detail) => total + detail.price * detail.quantity, 0);
    };

    // Step 1: Filter berdasarkan jenis pesanan (pickup/delivery)
    const typeOrders = orders.data.filter((order) => order.type === activeTab);

    // Step 2: Filter berdasarkan pencarian nama
    const nameFilteredOrders = typeOrders.filter(
        (order) =>
            typeof order.name === 'string' &&
            order.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            ((Array.isArray(order.pickup) && order.pickup.some((p) => p.status !== 'menunggu pembayaran' && p.status !== 'menunggu konfirmasi')) ||
                (Array.isArray(order.delivery) && order.delivery.some((d) => d.status !== 'menunggu pembayaran' && d.status !== 'diproses'))),
    );

    // Step 3: Filter berdasarkan tanggal
    const dateFilteredOrders = nameFilteredOrders.filter((order) => {
        const orderDate = new Date(order.date).getTime();

        if (startDate && endDate) {
            return orderDate >= new Date(startDate).getTime() && orderDate <= new Date(endDate).getTime();
        }

        if (startDate) {
            return orderDate >= new Date(startDate).getTime();
        }

        if (endDate) {
            return orderDate <= new Date(endDate).getTime();
        }

        return true;
    });

    // Step 4: Filter berdasarkan harga
    const priceFilteredOrders = dateFilteredOrders.filter((order) => {
        const orderTotal = calculateOrderTotal(order);
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;

        return orderTotal >= min && orderTotal <= max;
    });

    // Step 5: Sorting
    const sortedOrders = priceFilteredOrders.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'date':
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                break;
            case 'price':
                comparison = calculateOrderTotal(a) - calculateOrderTotal(b);
                break;
            default:
                comparison = 0;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const activeOrders = sortedOrders;

    // Clear all filters function
    const clearAllFilters = () => {
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
        setMinPrice('');
        setMaxPrice('');
        setSortBy('date');
        setSortOrder('desc');
        setCurrentPage(1);
    };

    return (
        <AppLayout>
            <Head title="Status Pesanan" />
            <section id="status-pesanan" className="mb-12">
                <div className="flex w-full flex-col px-6">
                    <h1 className="mt-5 mb-10 text-center text-3xl font-bold">Status Pesanan</h1>
                    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                        {/* Filter Controls */}
                        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
                            {/* Left Side - Filters */}
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Sort Buttons */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-600">Urutkan:</span>
                                    <button
                                        onClick={() => handleSortChange('date')}
                                        className={`flex transform cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 font-medium shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                                            sortBy === 'date'
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                                                : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 hover:from-gray-400 hover:to-gray-500'
                                        }`}
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Tanggal {sortBy === 'date' && `(${sortOrder.toUpperCase()})`}
                                    </button>
                                    {/* <button
                                        onClick={() => handleSortChange('name')}
                                        className={`flex transform cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 font-medium shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                                            sortBy === 'name'
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                                                : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 hover:from-gray-400 hover:to-gray-500'
                                        }`}
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Nama {sortBy === 'name' && `(${sortOrder.toUpperCase()})`}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange('price')}
                                        className={`flex transform cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 font-medium shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                                            sortBy === 'price'
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                                                : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 hover:from-gray-400 hover:to-gray-500'
                                        }`}
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                            />
                                        </svg>
                                        Harga {sortBy === 'price' && `(${sortOrder.toUpperCase()})`}
                                    </button> */}
                                </div>

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

                        {/* Price Filter Row
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                            {/* Price Filters */}
                            {/* <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-600">Filter Harga:</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 rounded-lg border bg-gray-50 p-2">
                                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                            />
                                        </svg>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            min={1}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="w-20 border-0 bg-transparent text-sm text-gray-700 focus:ring-0 focus:outline-none"
                                        />
                                    </div>
                                    <span className="text-gray-400">—</span>
                                    <div className="flex items-center gap-2 rounded-lg border bg-gray-50 p-2">
                                        <input
                                            type="number"
                                            min={1}
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-20 border-0 bg-transparent text-sm text-gray-700 focus:ring-0 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div> */}

                            {/* Clear Filters Button */}
                            {/* <button
                                onClick={clearAllFilters}
                                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors duration-200 hover:border-red-300 hover:bg-red-100"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                Reset Filter
                            </button> */}
                        {/* </div>  */}

                        {/* Active Filters Display */}
                        {(searchTerm || startDate || endDate || minPrice || maxPrice) && (
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
                                {minPrice && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                                        Min: Rp{parseInt(minPrice).toLocaleString('id-ID')}
                                        <button onClick={() => setMinPrice('')} className="ml-1 hover:text-purple-600">
                                            ×
                                        </button>
                                    </span>
                                )}
                                {maxPrice && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                                        Max: Rp{parseInt(maxPrice).toLocaleString('id-ID')}
                                        <button onClick={() => setMaxPrice('')} className="ml-1 hover:text-purple-600">
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
                                    <th className="border border-gray-300 px-4 py-3 text-center">Opsi Pembayaran</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Detail</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Tanggal Pemesanan</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Selesaikan</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Batalkan</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-gray-700">
                                {activeOrders.length > 0 ? (
                                    activeOrders
                                        .filter(
                                            (item) =>
                                                !(
                                                    item.delivery?.some((d) => d.status === 'selesai' || d.status === 'dibatalkan') ||
                                                    item.pickup?.some((p) => p.status === 'selesai' || p.status === 'dibatalkan')
                                                ),
                                        )
                                        // .sort((a, b) => new Date(b.date) - new Date(a.date))
                                        .map((item, index) => (
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
                                                {/* <td className="border border-gray-200 px-4 py-3 text-center">
                                                    {item.delivery.length > 0 ? (
                                                        item.delivery.map((detail, idx) => <span key={idx}>{detail.alamat}</span>)
                                                    ) : (
                                                        <span>Diambil di Toko</span>
                                                    )}
                                                </td> */}
                                                <td className="border border-gray-200 px-4 py-3 text-center">{item.payment}</td>
                                                <td className="border border-gray-200 px-4 py-3 text-center">
                                                    <Button
                                                        onClick={() => handleOpenDetailModal(item)}
                                                        className="rounded bg-green-500 px-3 py-1 text-white hover:bg-blue-600"
                                                    >
                                                        Detail
                                                    </Button>
                                                </td>
                                                <td className="border border-gray-200 px-4 py-3 text-center whitespace-nowrap">{item.date}</td>

                                                <td className="border border-gray-200 px-4 py-3 text-center">
                                                    <Button
                                                        className="h-8 rounded-md bg-blue-500 px-4 text-xs font-medium text-white hover:bg-blue-600"
                                                        onClick={() => handleConfirm(item.id)}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                </td>
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
                                                    {/* {item.delivery?.[0]?.status === 'dibatalkan' ? (
                                                        <span className="text-gray-400 italic">Telah dibatalkan</span>
                                                    ) : ( */}
                                                    <select
                                                        value={item.pickup?.[0]?.status}
                                                        onChange={(e) =>
                                                            handleStatusChange(item.id, e.target.value, item.type as 'pickup' | 'delivery')
                                                        }
                                                        className="rounded border bg-white px-3 py-1 text-sm shadow-sm transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                                    >
                                                        {pickupStatuses.map((status) => (
                                                            <option key={status} value={status}>
                                                                {capitalize(status)}
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
                                <button onClick={processCancel} className="cursor-pointer text-gray-500 hover:text-red-700">
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
