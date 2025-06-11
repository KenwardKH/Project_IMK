import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Head, usePage, router } from '@inertiajs/react';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PesananData {
    gambar_produk: string;
    nama_produk: string;
    harga_produk: number;
    jumlah_produk: number;
    satuan_produk: string;
    subtotal: number;
}
interface PemesanData {
    nama_pemesan: string;
    kontak_pemesan: string;
    pesananData: PesananData[];
}
interface RiwayatData {
    id: number;
    invoice_id: string;
    order_type: string;
    previous_status: string;
    new_status: string;
    cashier_name: string;
    updated_at: string;
    pemesanData: PemesanData[];
    [key: string]: any;
}

interface PaginationData {
    current_page: number;
    data: RiwayatData[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface Props {
    riwayatData: PaginationData;
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
        status?: string;
    };
}

const OwnerRiwayatKasir = () => {
    const { props } = usePage<Props>();
    const { riwayatData, filters } = props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [selectedRiwayat, setSelectedRiwayat] = useState<PesananData[]>([]);
    const [selectedNamaProduk, setSelectedNamaProduk] = useState<string>('');
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [pemesanInfo, setPemesanInfo] = useState<{ nama_pemesan: string; kontak_pemesan: string }>({ nama_pemesan: '', kontak_pemesan: '' });

    // Function to handle search and filter
    const handleFilter = () => {
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

        // Reset to first page when filtering
        router.get(window.location.pathname, Object.fromEntries(params), {
            preserveState: true,
            replace: true,
        });
    };

    // Function to handle pagination
    const handlePageChange = (url: string) => {
        if (!url) return;
        
        router.get(url, {}, {
            preserveState: true,
            replace: true,
        });
    };

    // Auto-filter with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleFilter();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, startDate, endDate]);

    const openDetailModal = (pesananData: PemesanData[], invoice_id: string) => {
        setSelectedRiwayat(pesananData[0].pesananData);
        setSelectedNamaProduk(invoice_id);
        setPemesanInfo({
            nama_pemesan: pesananData[0].nama_pemesan,
            kontak_pemesan: pesananData[0].kontak_pemesan,
        });
        setShowPriceModal(true);
    };

    const closeRiwayatModal = () => {
        setShowPriceModal(false);
        setSelectedRiwayat([]);
        setSelectedNamaProduk('');
    };

    const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

    const formatDate = (value: string) => new Date(value).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });

    // Pagination component
    const PaginationComponent = ({ paginationData }: { paginationData: PaginationData }) => {
        if (paginationData.last_page <= 1) return null;

        return (
            <div className="flex flex-col items-center gap-4 mt-6">
                {/* Pagination Info */}
                <div className="text-sm text-gray-600">
                    Menampilkan {paginationData.from} sampai {paginationData.to} dari {paginationData.total} hasil
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <Button
                        onClick={() => handlePageChange(paginationData.prev_page_url || '')}
                        disabled={!paginationData.prev_page_url}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                    >
                        <ChevronLeft size={16} />
                        Sebelumnya
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {paginationData.links
                            .filter(link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')
                            .map((link, index) => (
                                <Button
                                    key={index}
                                    onClick={() => handlePageChange(link.url || '')}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    className={`min-w-[40px] ${link.active ? 'bg-blue-500 text-white' : ''}`}
                                    disabled={!link.url}
                                >
                                    {link.label.includes('...') ? '...' : link.label}
                                </Button>
                            ))}
                    </div>

                    {/* Next Button */}
                    <Button
                        onClick={() => handlePageChange(paginationData.next_page_url || '')}
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
            <Head title="Riwayat" />
            <div className="flex w-full flex-col gap-6 px-6 py-4">
                <h1 className="flex w-full justify-center text-3xl font-bold">Riwayat Aktifitas Kasir</h1>
                <section className="mb-6 w-full rounded-xl bg-[#F8FAFC] p-4 shadow-md">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Start Date */}
                        <div className="flex w-full items-center gap-2 md:w-1/3">
                            <label htmlFor="startDate" className="w-28 text-sm font-semibold whitespace-nowrap">
                                Tanggal Mulai:
                            </label>
                            <div className="relative w-full">
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Search */}
                        <div className="flex w-full items-center gap-2 md:w-1/3">
                            <label htmlFor="searchCashier" className="w-28 text-sm font-semibold whitespace-nowrap">
                                Nama Kasir:
                            </label>
                            <div className="relative w-full">
                                <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    id="searchCashier"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari kasir..."
                                    className="h-9 w-full rounded-md border border-gray-300 pr-3 pl-10 text-sm text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* End Date */}
                        <div className="flex w-full items-center gap-2 md:w-1/3">
                            <label htmlFor="endDate" className="w-28 text-sm font-semibold whitespace-nowrap">
                                Tanggal Akhir:
                            </label>
                            <div className="relative w-full">
                                <input
                                    type="date"
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="relative overflow-hidden rounded-lg shadow-md">
                        <div className="w-full overflow-x-auto rounded-xl shadow-md">
                            <table className="w-full min-w-[1000px] table-auto border-collapse">
                                <thead className="bg-gray-700 text-sm text-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Invoice ID</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Status Sebelum</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Status Sesudah</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Nama Kasir</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Detail Pesanan</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Waktu Status Berubah</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-sm text-gray-700">
                                    {riwayatData.data.length > 0 ? (
                                        riwayatData.data.map((item) => (
                                            <tr key={item.id} className="transition duration-200 hover:bg-gray-100">
                                                <td className="border border-gray-200 p-4 text-center">{item.invoice_id}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.previous_status}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.new_status}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.cashier_name}</td>
                                                <td className="border border-gray-200 p-4 text-center">
                                                    <Button
                                                        onClick={() => openDetailModal(item.pemesanData, item.invoice_id)}
                                                        className="rounded-md bg-blue-500 px-3 py-2 text-xs text-white shadow transition hover:bg-blue-600"
                                                    >
                                                        Detail
                                                    </Button>
                                                </td>
                                                <td className="border border-gray-200 p-4 text-center">{formatDate(item.updated_at)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="border border-gray-200 p-4 text-center">
                                                {searchTerm || startDate || endDate ? 'Data tidak ditemukan' : 'Belum ada riwayat kasir'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Component */}
                    <PaginationComponent paginationData={riwayatData} />
                </section>
            </div>

            {showPriceModal && selectedRiwayat.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeRiwayatModal}>
                    <div
                        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeRiwayatModal}
                            className="absolute top-2 right-2 rounded-full bg-gray-700 p-1 text-white hover:bg-gray-800"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-4 border-b pb-4">
                            <h2 className="text-xl font-bold text-gray-800">Informasi Pemesan</h2>
                            <p className="mt-1 text-sm font-medium text-gray-700">
                                <span className="font-semibold">Nama Pemesan:</span> {pemesanInfo.nama_pemesan}
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                                <span className="font-semibold">Kontak Pemesan:</span> {pemesanInfo.kontak_pemesan}
                            </p>
                        </div>

                        <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">Detail Pesanan</h3>
                        <div className="space-y-4">
                            {selectedRiwayat.map((item, idx) => (
                                <div key={idx} className="flex gap-4 border-b pb-4">
                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded border">
                                        {item.gambar_produk ? (
                                            <img
                                                src={`/storage/${item.gambar_produk}`}
                                                alt={item.nama_produk}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                                                Tidak ada gambar
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 items-center justify-between">
                                        <div>
                                            <h4 className="text-base font-semibold text-gray-800">{item.nama_produk}</h4>
                                            <p className="text-sm text-gray-700">
                                                Harga: <span className="font-semibold text-orange-600">{item.harga_produk}</span>
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                Jumlah:{' '}
                                                <span className="font-semibold text-orange-600">
                                                    {item.jumlah_produk} {item.satuan_produk}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center p-4">
                                            <p className="text-sm font-medium text-gray-800">Subtotal: </p>
                                            <p className="text-sm font-bold text-orange-600">{formatCurrency(item.subtotal)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="text-right">
                                <p className="text-lg font-bold text-gray-800">
                                    Total: {formatCurrency(selectedRiwayat.reduce((acc, item) => acc + item.subtotal, 0))}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </OwnerLayout>
    );
};

export default OwnerRiwayatKasir;