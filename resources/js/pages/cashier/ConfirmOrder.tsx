import AppLayout from '@/layouts/cashier-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, SquarePen, Trash2, X } from 'lucide-react';
import { useState } from 'react';

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
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'pickup' | 'delivery'>('pickup');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenModal = (order: OrderData) => {
        setSelectedOrder(order);
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
        order.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Step 3: Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    // Step 3: Ambil hanya pesanan yang belum dikonfirmasi
    const activeOrders = paginatedOrders.filter(order => order.cid == null);

    // Step 4: Fungsi navigasi halaman
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <AppLayout>
            <Head title="Konfirmasi Pesanan" />
            <section id="konfirmasi-pesanan" className="mb-12">
                <div className="flex w-full flex-col px-6 ">
                    <h1 className="text-3xl font-bold text-center">Daftar Pesanan Online</h1>
                    <div className="flex justify-between items-center flex-wrap gap-4 mb-4 py-4">
                        {/* Button Type Option */}
                        <div className=" flex gap-4">
                            <button
                                onClick={() => setActiveTab('pickup')}
                                className={`px-4 py-2 rounded ${activeTab === 'pickup' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            >
                                Pickup
                            </button>
                            <button
                                onClick={() => setActiveTab('delivery')}
                                className={`px-4 py-2 rounded ${activeTab === 'delivery' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            >
                                Delivery
                            </button>
                        </div>
                        {/* Search */}
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari Nama Customer"
                                className="h-12 w-full rounded-md border border-gray-300 pr-4 pl-10 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    //setCurrentPage(1); // Reset halaman saat pencarian berubah
                                }}
                            />
                        </div>
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
                                                    onClick={() => handleOpenModal(item)}
                                                    className="rounded bg-green-500 px-3 py-1 text-white hover:bg-blue-600"
                                                >
                                                    Detail
                                                </Button>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                {item.payments.length > 0 ? (
                                                    item.payments.map((detail, idx) => (
                                                        <span key={idx}>{detail.amount}</span>
                                                    ))
                                                ) : (
                                                    <span> Rp{item.details.reduce((total, detail) => total + detail.price * detail.quantity, 0).toLocaleString('id-ID')}</span>
                                                )}
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
                                            <td className="border border-gray-200 px-4 py-3 text-center"></td>
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
                                                    onClick={() => handleDelete(item.id)}
                                                    className="rounded-full bg-red-500 p-2 text-white shadow transition hover:cursor-pointer hover:bg-red-600"
                                                    size="icon"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="border border-gray-200 px-4 py-6 text-center text-gray-500">
                                            Tidak ada pesanan yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="mt-4 flex justify-center gap-2">
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
                {isModalOpen && selectedOrder && (
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
