import AppLayout from '@/layouts/cashier-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, SquarePen, Trash2, X, Filter, Package, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState, useMemo } from 'react';

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
    const itemsPerPage = 10; // Jumlah item per halaman
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

    // Step 1: Filter berdasarkan pencarian nama
    const filteredOrders = products.data.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Step 2: Filter berdasarkan stok
    const activeOrders = filteredOrders.filter((order) => {
        const stock = order.stock;

        if (stockThreshold) {
            if (filterType === '>') {
                return stock > parseInt(stockThreshold, 10);
            } else if (filterType === '<') {
                return stock < parseInt(stockThreshold, 10);
            }
        }

        return true;
    });

    // Pagination logic
    const totalPages = Math.ceil(activeOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = activeOrders.slice(startIndex, endIndex);

    // Reset to first page when filters change
    const handleFilterChange = (callback: () => void) => {
        callback();
        setCurrentPage(1);
    };

    // Pagination handlers
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToPage = (page: number) => setCurrentPage(page);

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Pagination info
    const paginationInfo = useMemo(() => {
        const start = startIndex + 1;
        const end = Math.min(endIndex, activeOrders.length);
        return { start, end, total: activeOrders.length };
    }, [startIndex, endIndex, activeOrders.length]);

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
                    <div className="rounded-2xl shadow-xl border border-gray-100 p-6 mb-8 backdrop-blur-sm bg-white/90">
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
                                            onChange={(e) => handleFilterChange(() => setFilterType(e.target.value))}
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
                                            placeholder="🔢 Masukkan jumlah..."
                                            value={stockThreshold}
                                            min="0"
                                            onChange={(e) => handleFilterChange(() => setStockThreshold(e.target.value))}
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
                                        handleFilterChange(() => setSearchTerm(e.target.value));
                                    }}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => handleFilterChange(() => setSearchTerm(''))}
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
                                    {currentItems.length > 0 ? (
                                        currentItems.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-gray-100">
                                                <td className="border border-gray-200 px-4 py-4 text-center font-medium">
                                                    {startIndex + index + 1}
                                                </td>
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

                        {/* Pagination Section */}
                        {activeOrders.length > 0 && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    {/* Pagination Info */}
                                    <div className="text-sm text-gray-600">
                                        Menampilkan <span className="font-medium">{paginationInfo.start}</span> sampai{' '}
                                        <span className="font-medium">{paginationInfo.end}</span> dari{' '}
                                        <span className="font-medium">{paginationInfo.total}</span> produk
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center gap-2">
                                            {/* First Page */}
                                            <button
                                                onClick={goToFirstPage}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                title="Halaman Pertama"
                                            >
                                                <ChevronsLeft className="h-4 w-4" />
                                            </button>

                                            {/* Previous Page */}
                                            <button
                                                onClick={goToPrevPage}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                title="Halaman Sebelumnya"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>

                                            {/* Page Numbers */}
                                            <div className="flex items-center gap-1">
                                                {getPageNumbers().map((pageNum) => (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => goToPage(pageNum)}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                            currentPage === pageNum
                                                                ? 'bg-blue-500 text-white border border-blue-500'
                                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Next Page */}
                                            <button
                                                onClick={goToNextPage}
                                                disabled={currentPage === totalPages}
                                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                title="Halaman Berikutnya"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>

                                            {/* Last Page */}
                                            <button
                                                onClick={goToLastPage}
                                                disabled={currentPage === totalPages}
                                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                title="Halaman Terakhir"
                                            >
                                                <ChevronsRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Items per page selector */}
                                <div className="flex items-center justify-center sm:justify-end gap-2 mt-4 sm:mt-0">
                                    <span className="text-sm text-gray-600">Item per halaman:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            const newItemsPerPage = Number(e.target.value);
                                            // Update itemsPerPage state if you want to make it dynamic
                                            // For now, it's hardcoded to 10
                                            setCurrentPage(1);
                                        }}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                            </div>
                        )}
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
