import AppLayout from '@/layouts/cashier-layout';
import { Button } from '@/components/ui/button';
import { Link, router, usePage } from '@inertiajs/react';
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
    quantity: string;
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
    const { orders } = usePage<Props>().props;
    const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (order: OrderData) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const filteredOrders = orders.data.filter(order => typeof order.name === 'string' &&
        order.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

   // Step 2: Tentukan data yang akan ditampilkan berdasarkan halaman
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    // Step 3: Fungsi navigasi halaman
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <AppLayout>
            <section id="konfirmasi-pesanan" className="mb-12">
                <div className="flex w-full flex-col gap-6 px-6 py-4">
                    <h1 className="text-3xl font-bold text-center">Daftar Pesanan Online</h1>

                    {/* Search */}
                    <div className="flex justify-end">
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
                                    <th className="border border-gray-300 px-4 py-3 text-center">Detail</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Bukti Pembayaran</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Nama Customer</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Tipe</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-gray-700">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-100 transition duration-200">
                                            <td className="border border-gray-200 px-4 py-3 text-center">{index + 1}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                <Button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                                                >
                                                    Detail
                                                </Button>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                {item.payments.length > 0 ? (
                                                    <ul className="list-disc list-inside text-left">
                                                        {item.payments.map((detail, idx) => (
                                                            <li key={idx}>ID: {detail.gambar}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span className="text-gray-500">Tidak ada gambar</span>
                                                )}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.name}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.type}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                <Link href={`/owner-produk/edit/${item.id}`}>
                                                    <Button
                                                        className="rounded-full bg-yellow-400 p-2 text-white shadow hover:bg-yellow-500"
                                                        size="icon"
                                                    >
                                                        <SquarePen className="h-4 w-4" />
                                                    </Button>
                                                </Link>
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
                            {orders.prev_page_url && (
                                <Button
                                    variant="outline"
                                    onClick={() => router.visit(orders.prev_page_url!)}
                                >
                                    Previous
                                </Button>
                            )}
                            <span className="px-2 py-1 text-sm">
                                Page {orders.current_page} of {orders.last_page}
                            </span>
                            {orders.next_page_url && (
                                <Button
                                    variant="outline"
                                    onClick={() => router.visit(orders.next_page_url!)}
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
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
        </AppLayout>
    );
}
