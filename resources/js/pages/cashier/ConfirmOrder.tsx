import AppLayout from '@/layouts/cashier-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, SquarePen, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OrderData {
    id: number;
    custid: number;
    name: string;
    contact: string;
    date: string;
    type: string;
    payment: string;
    cid: number
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

interface CancellationData {
    id: string;
    paymentTime: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    orders: PaginatedOrders;
    cancellations: CancellationData;
}

export default function OrderList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalImage, setModalImage] = useState<string | null>(null);
    const { orders, cancellations } = usePage<Props>().props;
    // const { cancellations } = usePage<Props>().props;
    const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'pickup' | 'delivery'>('pickup');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [modalType, setModalType] = useState<'cancel' | 'detail' | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [jumpToPage, setJumpToPage] = useState('');
    const [totalItems, setTotalItems] = useState(0); // Total data dari API/database
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    // const handleOpenModal = (order: OrderData) => {
    //     setSelectedOrder(order);
    //     setIsModalOpen(true);
    // };

    const handleOpenCancelModal = (order: OrderData) => {
        setSelectedOrder(order);
        setModalType('cancel');  // modal cancel
        setIsModalOpen(true);
    };

    const handleOpenDetailModal = (order: OrderData) => {
        setSelectedOrder(order);
        setModalType('detail');  // modal detail
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

    // console.log(cancellations?.paymentTime);

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
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedOrder?.id,   // Kirim ID pesanan
                    cancellation_reason: cancelReason || null,
                    // cancelled_by: selectedOrder?.cid,
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Pembatalan berhasil, silahkan lakukan transaksi lainnya!');
                router.visit('/cashier/orders'); // Redirect ke halaman dashboard atau order
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

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus pesanan ini?')) {
            router.delete(`/cashier/orders/${id}`);
        }
    };

    const handleConfirm = async (orderId: number) => {
        try {
            await router.post(`/cashier/confirm/${orderId}`, {}, {
                onSuccess: () => {
                    alert('Pesanan berhasil dikonfirmasi!');
                    // Optional: reload atau refresh data
                    router.reload({ only: ['orders'] });
                },
                onError: (errors) => {
                    console.error('Gagal mengonfirmasi pesanan:', errors);
                    alert('Terjadi kesalahan saat mengonfirmasi pesanan.');
                }
            });
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('Terjadi kesalahan tak terduga saat mengonfirmasi pesanan.');
        }
    };

    // Step 1: Filter berdasarkan jenis pesanan (pickup/delivery)
    const typeOrders = orders.data.filter(order => order.type === activeTab);

    // Step 2: Filter berdasarkan pencarian nama
    const filteredOrders = typeOrders.filter(order =>
        typeof order.name === 'string' &&
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (
            (Array.isArray(order.pickup) && order.pickup.some(p => p.status === 'diproses')) ||
            (Array.isArray(order.delivery) && order.delivery.some(d => d.status === 'diproses'))
        )
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
    })
    const activeOrders = sortedByDate.filter(order => order.cid == null);

    const deadlineDates = activeOrders.map(item => {
        const itemDate = new Date(item.date).getTime();
        const paymentTimeInMs = (cancellations?.paymentTime ?? 0) * 60 * 60 * 1000;

        const deadlineDate = new Date(itemDate + paymentTimeInMs);

        return deadlineDate.toLocaleString('id-ID');
        
    });
    console.log('cancellations:', cancellations);

    return (
        <AppLayout>
            <Head title="Konfirmasi Pesanan" />
            <section id="konfirmasi-pesanan" className="mb-12">
                <div className="flex w-full flex-col px-6 ">
                    <h1 className="text-3xl font-bold text-center mb-10 mt-5">Daftar Pesanan Online</h1>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
                        {/* Top Row - Status Tabs */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <div className="flex bg-gray-50 rounded-lg p-1 border">
                                <button
                                    onClick={() => setActiveTab('pickup')}
                                    className={`px-6 py-2.5 rounded-md font-medium transition-all duration-200 ${activeTab === 'pickup'
                                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-white'
                                        }`}
                                >
                                    Ambil di Toko
                                </button>
                                <button
                                    onClick={() => setActiveTab('delivery')}
                                    className={`px-6 py-2.5 rounded-md font-medium transition-all duration-200 ${activeTab === 'delivery'
                                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                        : 'text-gray-600 hover:text-red-600 hover:bg-white'
                                        }`}
                                >
                                    Ambil sendiri
                                </button>
                            </div>
                        </div>

                        {/* Bottom Row - Search and Filters */}
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            {/* Left Side - Filters */}
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Sort Button */}
                                <button
                                    onClick={toggleSortOrder}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg px-4 py-2.5 font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                    </svg>
                                    Urutkan ({sortOrder.toUpperCase()})
                                </button>

                                {/* Date Range Picker */}
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="border-0 bg-transparent focus:ring-0 focus:outline-none text-sm text-gray-700"
                                        />
                                    </div>
                                    <span className="text-gray-400 px-1">—</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="border-0 bg-transparent focus:ring-0 focus:outline-none text-sm text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Right Side - Search */}
                            <div className="relative w-full max-w-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari nama customer..."
                                    className="w-full h-12 pl-12 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
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
                            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
                                <span className="text-sm text-gray-500 font-medium">Filter aktif:</span>
                                {searchTerm && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                        Customer: {searchTerm}
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="ml-1 hover:text-blue-600"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {startDate && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                        Dari: {startDate}
                                        <button
                                            onClick={() => setStartDate('')}
                                            className="ml-1 hover:text-green-600"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {endDate && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                        Sampai: {endDate}
                                        <button
                                            onClick={() => setEndDate('')}
                                            className="ml-1 hover:text-green-600"
                                        >
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
                                    <th className="border border-gray-300 px-4 py-3 text-center">Detail</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Total Harga</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Bukti Pembayaran</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Nama Customer</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Opsi Pesanan</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Tanggal Pemesanan</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Tenggat Pembayaran</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Status</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Batal</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-gray-700">
                                {activeOrders.length > 0 ? (
                                    activeOrders.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-100 transition duration-200">
                                            <td className="border border-gray-200 px-4 py-3 text-center">{index + 1}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.id}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                <Button
                                                    onClick={() => handleOpenDetailModal(item)}
                                                    className="rounded bg-green-500 px-3 py-1 text-white hover:bg-blue-600"
                                                >
                                                    Detail
                                                </Button>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 ">
                                                <span> Rp{item.details.reduce((total, detail) => total + detail.price * detail.quantity, 0).toLocaleString('id-ID')}</span>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                {item.payments.length > 0 ? (
                                                    <ul className="list-disc list-inside text-left">
                                                        {item.payments.map((detail, idx) => (
                                                            <li key={idx} className='list-none'>
                                                                <img
                                                                    src={`/storage/${detail.gambar}`}
                                                                    alt={detail.gambar}
                                                                    className="mx-auto h-16 w-16 cursor-pointer rounded-md object-cover shadow-sm transition hover:scale-105"
                                                                    onClick={() => openModal(`/storage/${detail.gambar}`)}
                                                                />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span className="text-gray-500">Tidak ada gambar</span>
                                                )}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.name}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.type}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.date}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                {deadlineDates[index]}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleConfirm(item.id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                                >
                                                    Konfirmasi
                                                </button>
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
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={11} className="border border-gray-200 px-4 py-6 text-center text-gray-500">
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
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Batalkan Pesanan</h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-red-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                <Label className="block text-sm font-medium text-gray-700">Alasan Pembatalan</Label>
                                <Input
                                    id="cancelReason"
                                    type="text"
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)} // Penting! supaya alasan tersimpan
                                    placeholder="Masukkan alasan pembatalan"
                                    className="w-full mt-1 mb-4"
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
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Detail Pesanan</h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-red-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                {selectedOrder.details?.map((detailItem, index) => (
                                    <div key={index} className="border p-4 rounded-lg">
                                        <p><strong>Nama Produk:</strong> {detailItem.name}</p>
                                        <p><strong>Jumlah:</strong> {detailItem.quantity} {detailItem.unit}</p>
                                        <p><strong>Harga:</strong> Rp{detailItem.price}</p>
                                        {detailItem.gambar && (
                                            <img src={`/storage/${detailItem.gambar}`} alt={detailItem.name} className="w-24 h-24 object-cover mt-2 rounded" />
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
        </AppLayout >
    );
}
