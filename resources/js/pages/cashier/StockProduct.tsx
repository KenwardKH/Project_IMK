import AppLayout from '@/layouts/cashier-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, SquarePen, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface ProductData {
    id: number;
    name: string;
    description: string;
    unit: string;
    stock: string;
    price: number;
    image: string;
    // details: DetailData[];
    // payments: PaymentData[];
    // pickup: PickupData[];
    // delivery: DeliveryData[];
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

interface PaginatedOrders {
    data: ProductData[];
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
    products: PaginatedOrders;
}


export default function OrderList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalImage, setModalImage] = useState<string | null>(null);
    const { products } = usePage<Props>().props;
    const [selectedOrder, setSelectedOrder] = useState<ProductData | null>(null);
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const openModal = (imageUrl: string) => {
        setModalImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setModalImage(null);
        setIsModalOpen(false);
    };

    // Step 1: Filter berdasarkan jenis pesanan (pickup/delivery)
    // const typeOrders = orders.data.filter(order => order.type === activeTab);

    // Step 2: Filter berdasarkan pencarian nama
    const filteredOrders = products.data.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Step 3: Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const activeOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    // Step 3: Ambil hanya pesanan yang belum dikonfirmasi
    // const activeOrders = paginatedOrders.filter(order => order.cid == null);

    // Step 4: Fungsi navigasi halaman
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <AppLayout>
            <Head title="Stok Barang" />
            <section id="stok-barang" className="mb-12">
                <div className="flex w-full flex-col px-6 ">
                    <h1 className="text-3xl font-bold text-center">Daftar Produk</h1>
                    <div className="flex justify-between items-center flex-wrap gap-4 mb-4 py-4">
                        {/* Button Type Option */}
                        {/* <div className=" flex gap-4">
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
                        </div> */}
                        {/* Search */}
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari Nama Produk"
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
                                    <th className="border border-gray-300 px-4 py-3 text-center">Gambar Produk</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Nama Produk</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Harga Jual</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Jumlah</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Satuan</th>
                                    <th className="border border-gray-300 px-4 py-3 text-center">Deskripsi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-gray-700">
                                {activeOrders.length > 0 ? (
                                    activeOrders.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-100 transition duration-200">
                                            <td className="border border-gray-200 px-4 py-3 text-center">{index + 1}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">
                                                    <img
                                                        src={`/storage/${item.image}`}
                                                        alt={item.image}
                                                        className="mx-auto h-16 w-16 cursor-pointer rounded-md object-cover shadow-sm transition hover:scale-105"
                                                        onClick={() => openModal(`/storage/${item.image}`)}
                                                    />
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.name}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.price}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.unit}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.stock}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-center">{item.description}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={11} className="border border-gray-200 px-4 py-6 text-center text-gray-500">
                                            Tidak ada produk yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
            </section>
        </AppLayout >
    );
}
