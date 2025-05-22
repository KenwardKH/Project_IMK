import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface PesananData {
    gambar_produk: string;
    nama_produk: string;
    harga_produk: number;
    jumlah_produk: number;
    satuan_produk: string;
    subtotal: number;
}
interface RiwayatData {
    id: number;
    invoiceId: string;
    namaPemesan: string;
    kontakPemesan: string;
    opsiPembayaran: string;
    totalPembayaran: number;
    tanggalPembayaran: string;
    namaKasir: string;
    jenisPesanan: string;
    status: string;
    tanggalInvoice: string;
    pesananData: PesananData[];
}
const OwnerRiwayatTransaksi = () => {
    const dummyData: RiwayatData[] = [
        {
            id: 1,
            invoiceId: 'INV-001',
            namaPemesan: 'Budi',
            kontakPemesan: '08123456789',
            opsiPembayaran: 'Transfer',
            totalPembayaran: 1620000,
            tanggalPembayaran: '2025-05-20 14:30',
            namaKasir: 'Kasir A',
            jenisPesanan: 'Online',
            status: 'Selesai',
            tanggalInvoice: '2025-05-20 16:00',
            pesananData: [
                {
                    gambar_produk: 'kertas.jpg',
                    nama_produk: 'Kertas A4',
                    harga_produk: 50000,
                    jumlah_produk: 20,
                    satuan_produk: 'rim',
                    subtotal: 1000000,
                },
                {
                    gambar_produk: 'pen.jpg',
                    nama_produk: 'Pen Greebel Hitam',
                    harga_produk: 24000,
                    jumlah_produk: 20,
                    satuan_produk: 'lusin',
                    subtotal: 480000,
                },
            ],
        },
        {
            id: 2,
            invoiceId: 'INV-002',
            namaPemesan: 'Andiana',
            kontakPemesan: '08123456129',
            opsiPembayaran: 'Tunai',
            totalPembayaran: 1620000,
            tanggalPembayaran: '2025-05-22 11:00',
            namaKasir: 'Kasir B',
            jenisPesanan: 'Offline',
            status: 'Menunggu Pembayaran',
            tanggalInvoice: '2025-05-22 14:00',
            pesananData: [
                {
                    gambar_produk: 'spidol.jpg',
                    nama_produk: 'Spidol Snowman Hitam',
                    harga_produk: 36000,
                    jumlah_produk: 25,
                    satuan_produk: 'lusin',
                    subtotal: 900000,
                },
                {
                    gambar_produk: 'pen.jpg',
                    nama_produk: 'Pen Greebel Hitam',
                    harga_produk: 24000,
                    jumlah_produk: 30,
                    satuan_produk: 'lusin',
                    subtotal: 720000,
                },
            ],
        },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredKasirs, setFilteredKasirs] = useState<RiwayatData[]>(dummyData);
    const [selectedRiwayat, setSelectedRiwayat] = useState<PesananData[]>([]);
    const [selectedNamaProduk, setSelectedNamaProduk] = useState<string>('');
    const [showPriceModal, setShowPriceModal] = useState(false);

    // useEffect(() => {
    //     const filtered = dummyData.filter((item) => item.namaKasir.toLowerCase().includes(searchTerm.toLowerCase()));
    //     setFilteredKasirs(filtered);
    // }, [searchTerm]);

    const statusOptions = ['Menunggu Pembayaran', 'Diproses', 'Menunggu Pengambilan', 'Diantar', 'Selesai', 'Dibatalkan'];

    const openDetailModal = (pesananData: PesananData[], invoiceId: string) => {
        setSelectedRiwayat(pesananData);
        setSelectedNamaProduk(invoiceId);
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
                <h1 className="flex w-full justify-center text-3xl font-bold">Riwayat Transaksi</h1>
                <section className="mb-6 w-full rounded-xl bg-[#F8FAFC] p-4 shadow-md">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Search */}
                        <div className="flex w-full items-center gap-2 md:w-1/3">
                            <label htmlFor="searchCashier" className="w-28 text-sm font-semibold whitespace-nowrap">
                                Nama Pemesan:
                            </label>
                            <div className="relative w-full">
                                <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    id="searchCashier"
                                    placeholder="Cari Pemesan..."
                                    className="h-9 w-full rounded-md border border-gray-300 pr-3 pl-10 text-sm text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Start Date */}
                        <div className="flex w-full items-center gap-2 md:w-1/3">
                            <label htmlFor="startDate" className="w-28 text-sm font-semibold whitespace-nowrap">
                                Tanggal Mulai:
                            </label>
                            <div className="relative w-full">
                                <input
                                    type="date"
                                    id="startDate"
                                    className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Search */}
                        <div className="flex w-full items-center gap-2 md:w-1/3">
                            <label htmlFor="statusFilter" className="w-28 text-sm font-semibold whitespace-nowrap">
                                Status Pesanan:
                            </label>
                            <div className="relative w-full">
                                <select
                                    id="statusFilter"
                                    className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="">Pilih Status</option>
                                    {statusOptions.map((status, index) => (
                                        <option key={index} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="mt-4 flex justify-end">
                        <Button className="bg-blue-600 text-white hover:bg-blue-700">Terapkan Filter</Button>
                    </div>
                </section>
                <section>
                    <div className="relative overflow-hidden rounded-lg shadow-md">
                        <div className="w-full overflow-x-auto rounded-xl shadow-md">
                            <table className="w-full min-w-[1000px] table-auto border-collapse">
                                <thead className="bg-gray-700 text-sm text-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Invoice ID</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Nama Pemesan</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Kontak Pemesan</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Opsi Pembayaran</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Total Pembayaran</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Tanggal Pembayaran</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Nama Kasir</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Jenis Pesanan</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Detail</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Status</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Tanggal Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-sm text-gray-700">
                                    {filteredKasirs.length > 0 ? (
                                        filteredKasirs.map((item) => (
                                            <tr key={item.id} className="transition duration-200 hover:bg-gray-100">
                                                <td className="border border-gray-200 p-4 text-center">{item.invoiceId}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.namaPemesan}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.kontakPemesan}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.opsiPembayaran}</td>
                                                <td className="border border-gray-200 p-4 text-center">{formatCurrency(item.totalPembayaran)}</td>
                                                <td className="border border-gray-200 p-4 text-center">{formatDate(item.tanggalPembayaran)}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.namaKasir}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.jenisPesanan}</td>
                                                <td className="border border-gray-200 p-4 text-center">
                                                    <Button
                                                        onClick={() => openDetailModal(item.pesananData, item.invoiceId)}
                                                        className="rounded-md bg-blue-500 px-3 py-2 text-xs text-white shadow transition hover:bg-blue-600"
                                                    >
                                                        Detail
                                                    </Button>
                                                </td>
                                                <td className="border border-gray-200 p-4 text-center">{item.status}</td>
                                                <td className="border border-gray-200 p-4 text-center">{formatDate(item.tanggalInvoice)}</td>
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
                                <span className="font-semibold">Nama Pemesan:</span>{' '}
                                {dummyData.find((d) => d.invoiceId === selectedNamaProduk)?.namaPemesan}
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                                <span className="font-semibold">Kontak Pemesan:</span>{' '}
                                {dummyData.find((d) => d.invoiceId === selectedNamaProduk)?.kontakPemesan}
                            </p>
                        </div>

                        <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">Detail Pesanan</h3>
                        <div className="space-y-4">
                            {selectedRiwayat.map((item, idx) => (
                                <div key={idx} className="flex gap-4 border-b pb-4">
                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded border">
                                        {item.gambar_produk ? (
                                            <img
                                                src={`/images/products/${item.gambar_produk}`}
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

export default OwnerRiwayatTransaksi;
