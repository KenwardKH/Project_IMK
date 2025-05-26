import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
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



const OwnerRiwayatKasir = () => {
    const { props } = usePage<{ riwayatData: RiwayatData[] }>();
    const riwayatKasir = props.riwayatData;
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredKasirs, setFilteredKasirs] = useState<RiwayatData[]>(riwayatKasir);
    const [selectedRiwayat, setSelectedRiwayat] = useState<PesananData[]>([]);
    const [selectedNamaProduk, setSelectedNamaProduk] = useState<string>('');
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [pemesanInfo, setPemesanInfo] = useState<{ nama_pemesan: string; kontak_pemesan: string }>({ nama_pemesan: '', kontak_pemesan: '' });

    useEffect(() => {
        let result = riwayatKasir;

        if (searchTerm.trim()) {
            result = result.filter(
                (item) =>
                    item.cashier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.cashier_name?.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            result = result.filter((item) => {
                const tanggal = new Date(item.updated_at);
                return tanggal >= start && tanggal <= end;
            });
        }
        setFilteredKasirs(result);
    }, [searchTerm, startDate, endDate, riwayatKasir]);

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

    return (
        <OwnerLayout>
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
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Opsi Pengiriman</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Status Sebelum</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Status Sesudah</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Nama Kasir</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Detail Pesanan</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Waktu Status Berubah</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-sm text-gray-700">
                                    {filteredKasirs.length > 0 ? (
                                        filteredKasirs.map((item) => (
                                            <tr key={item.id} className="transition duration-200 hover:bg-gray-100">
                                                <td className="border border-gray-200 p-4 text-center">{item.invoice_id}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.order_type}</td>
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
                                            <td colSpan={7} className="border border-gray-200 p-4 text-center">
                                                {searchTerm ? 'Data tidak ditemukan' : 'Belum ada riwayat kasir'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
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
