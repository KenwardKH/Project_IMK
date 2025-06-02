import AppLayout from '@/layouts/cashier-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, SquarePen, Trash2, X, Filter, Package } from 'lucide-react';
import { useState } from 'react';

interface ProductData {
    id: number;
    name: string;
    description: string;
    unit: string;
    stock: number;
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
    const [stockThreshold, setStockThreshold] = useState('');
    const [filterType, setFilterType] = useState('>');

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

    const activeOrders = filteredOrders.filter((order) => {
        const stock = order.stock; // misalnya order.stock = 12

        if (stockThreshold) {
            if (filterType === '>') {
                return stock > parseInt(stockThreshold, 10);
            } else if (filterType === '<') {
                return stock < parseInt(stockThreshold, 10);
            }
        }

        return true; // kalau threshold kosong, tampilkan semua
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout>
            <Head title="Stok Barang" />
            <section id="stok-barang" className="min-h-screen py-8">
                <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
                                <Package className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                 Daftar Produk
                            </h1>
                        </div>
                        <p className="text-gray-600 text-lg">Kelola inventori produk dengan mudah dan efisien</p>
                    </div>

                    {/* Filter & Search Section */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8 backdrop-blur-sm bg-white/90">
                        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                            {/* Stock Filter */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Filter className="h-4 w-4 text-blue-500" />
                                    <span>📊 Filter Stok:</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <select
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            className="appearance-none bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl px-4 py-3 pr-10 text-gray-700 font-medium focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            <option value=">">📈 Lebih dari</option>
                                            <option value="<">📉 Kurang dari</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="🔢 -Masukkan jumlah..."
                                            value={stockThreshold}
                                            min="0"
                                            onChange={(e) => setStockThreshold(e.target.value)}
                                            className="w-52 px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="relative w-full max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="🔍 Cari nama produk..."
                                    className="w-full h-12 pl-12 pr-12 text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all duration-200 placeholder-gray-400 shadow-sm hover:shadow-md"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors duration-200"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filter Status */}
                        {(stockThreshold || searchTerm) && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-2 text-sm text-blue-800">
                                    <span className="font-medium">🎯 Filter Aktif:</span>
                                    {stockThreshold && (
                                        <span className="px-2 py-1 bg-blue-100 rounded-full text-xs">
                                            Stok {filterType === '>' ? '📈 lebih dari' : '📉 kurang dari'} {stockThreshold}
                                        </span>
                                    )}
                                    {searchTerm && (
                                        <span className="px-2 py-1 bg-blue-100 rounded-full text-xs">
                                            🔍 "{searchTerm}"
                                        </span>
                                    )}
                                    <span className="text-blue-600 font-medium">
                                        ({activeOrders.length} produk ditemukan)
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="overflow-auto">
                            <table className="w-full min-w-[800px] table-auto border-collapse text-sm">
                                <thead className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-4 text-center font-semibold">No.</th>
                                        <th className="border border-gray-300 px-4 py-4 text-center font-semibold">Gambar</th>
                                        <th className="border border-gray-300 px-4 py-4 text-center font-semibold">Nama Produk</th>
                                        <th className="border border-gray-300 px-4 py-4 text-center font-semibold">Harga</th>
                                        <th className="border border-gray-300 px-4 py-4 text-center font-semibold">Stok</th>
                                        <th className="border border-gray-300 px-4 py-4 text-center font-semibold">Satuan</th>
                                        <th className="border border-gray-300 px-4 py-4 text-center font-semibold">Deskripsi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-gray-700">
                                    {activeOrders.length > 0 ? (
                                        activeOrders.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-gray-100">
                                                <td className="border border-gray-200 px-4 py-4 text-center font-medium">{index + 1}</td>
                                                <td className="border border-gray-200 px-4 py-4 text-center">
                                                    <div className="flex justify-center">
                                                        <img
                                                            src={`/storage/${item.image}`}
                                                            alt={item.image}
                                                            className="h-16 w-16 cursor-pointer rounded-xl object-cover shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg border-2 border-gray-100"
                                                            onClick={() => openModal(`/storage/${item.image}`)}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="border border-gray-200 px-4 py-4 text-center font-medium text-gray-800">{item.name}</td>
                                                <td className="border border-gray-200 px-4 py-4 text-center">
                                                    <span className="font-semibold text-green-600">{formatCurrency(item.price)}</span>
                                                </td>
                                                <td className="border border-gray-200 px-4 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        item.stock < 10
                                                            ? 'bg-red-100 text-red-800 border border-red-200'
                                                            : item.stock < 50
                                                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                                : 'bg-green-100 text-green-800 border border-green-200'
                                                    }`}>
                                                        {item.stock}
                                                    </span>
                                                </td>
                                                <td className="border border-gray-200 px-4 py-4 text-center">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">{item.unit}</span>
                                                </td>
                                                <td className="border border-gray-200 px-4 py-4 text-center max-w-xs">
                                                    <div className="truncate text-gray-600" title={item.description}>
                                                        {item.description}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="border border-gray-200 px-4 py-12 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="p-4 bg-gray-100 rounded-full">
                                                        <Package className="h-12 w-12 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 text-lg font-medium">📭 Tidak ada produk yang ditemukan</p>
                                                        <p className="text-gray-400 text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 md:col-start-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Package className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">📊 Total Produk</p>
                                    <p className="text-xl font-bold text-gray-800">{activeOrders.length}</p>
                                </div>
                            </div>
                        </div>
                        {/* <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <span className="text-green-600 font-bold">✓</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">📈 Stok Aman</p>
                                    <p className="text-xl font-bold text-gray-800">
                                        {activeOrders.filter(item => item.stock >= 50).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <span className="text-red-600 font-bold">⚠</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">📉 Stok Rendah</p>
                                    <p className="text-xl font-bold text-gray-800">
                                        {activeOrders.filter(item => item.stock < 10).length}
                                    </p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Image Modal */}
                {isModalOpen && modalImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={closeModal}>
                        <div className="relative w-full max-w-2xl mx-4 rounded-2xl bg-white p-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={closeModal}
                                className="absolute -top-4 -right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all duration-200 hover:bg-red-600 hover:scale-110"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <div className="rounded-xl overflow-hidden">
                                <img
                                    src={modalImage}
                                    alt="Preview"
                                    className="max-h-[80vh] w-full object-contain bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </AppLayout>
    );
}
