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
interface PemesanData {
    nama_pemesan: string;
    kontak_pemesan: string;
    pesananData: PesananData[];
}
interface RiwayatData {
    id: number;
    invoiceId: string;
    opsiPengantaran: string;
    statusSebelum: string;
    statusSesudah: string;
    namaKasir: string;
    waktuStatusBerubah: string;
    pemesanData: PemesanData[];
}

const OwnerRiwayatKasir = () => {
    const dummyData: RiwayatData[] = [
        {
            id: 1,
            invoiceId: 'INV-001',
            opsiPengantaran: 'Diantar',
            statusSebelum: 'Diproses',
            statusSesudah: 'Selesai',
            namaKasir: 'Kasir A',
            waktuStatusBerubah: '2025-05-20 14:35',
            pemesanData: [
                {
                    nama_pemesan: 'Budi',
                    kontak_pemesan: '08123456789',
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
                            gambar_produk: 'pensil.jpg',
                            nama_produk: 'Pensil 2B',
                            harga_produk: 50000,
                            jumlah_produk: 20,
                            satuan_produk: 'rim',
                            subtotal: 1000000,
                        },
                    ],
                },
            ],
        },
        {
            id: 2,
            invoiceId: 'INV-002',
            opsiPengantaran: 'Diambil',
            statusSebelum: 'Menunggu',
            statusSesudah: 'Diproses',
            namaKasir: 'Kasir B',
            waktuStatusBerubah: '2025-05-21 09:10',
            pemesanData: [
                {
                    nama_pemesan: 'Siti',
                    kontak_pemesan: '08987654321',
                    pesananData: [
                        {
                            gambar_produk: '',
                            nama_produk: 'Rantang Harian',
                            harga_produk: 30000,
                            jumlah_produk: 1,
                            satuan_produk: 'paket',
                            subtotal: 30000,
                        },
                    ],
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

    const openDetailModal = (pesananData: PemesanData[], invoiceId: string) => {
        setSelectedRiwayat(pesananData[0].pesananData);
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
            <div>
                <section className="flex w-full flex-col gap-4 rounded-md border-b-2 border-gray-300 bg-[#FFD9B3] px-6 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
                    {/* Start Date */}
                    <div className="flex flex-col md:w-1/3 md:flex-row md:items-center md:gap-2">
                        <label htmlFor="startDate" className="mb-1 text-sm font-semibold whitespace-nowrap md:mb-0">
                            Tanggal Mulai:
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            // value={startDate}
                            // onChange={(e) => setStartDate(e.target.value)}
                            className="h-9 w-full rounded-md border border-gray-400 px-3 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-1/3">
                        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Nama Kasir"
                            // value={search}
                            // onChange={(e) => setSearch(e.target.value)}
                            // onKeyDown={handleKeyDown}
                            className="h-9 w-full rounded-md border border-gray-400 pr-4 pl-10 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col md:w-1/3 md:flex-row md:items-center md:gap-2">
                        <label htmlFor="endDate" className="mb-1 text-sm font-semibold whitespace-nowrap md:mb-0">
                            Tanggal Akhir:
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            // value={endDate}
                            // onChange={(e) => setEndDate(e.target.value)}
                            className="h-9 w-full rounded-md border border-gray-400 px-3 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </section>
                {/* Apply filters button */}
                <div className="mt-2 mb-4 flex justify-end px-6">
                    <Button 
                        // onClick={applyFilters} 
                    className="bg-blue-600 text-white hover:bg-blue-700">
                        Terapkan Filter
                    </Button>
                </div>

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
                                                <td className="border border-gray-200 p-4 text-center">{item.invoiceId}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.opsiPengantaran}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.statusSebelum}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.statusSesudah}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.namaKasir}</td>
                                                <td className="border border-gray-200 p-4 text-center">
                                                    <Button
                                                        onClick={() => openDetailModal(item.pemesanData, item.invoiceId)}
                                                        className="rounded-md bg-blue-500 px-3 py-2 text-xs text-white shadow transition hover:bg-blue-600"
                                                    >
                                                        Detail
                                                    </Button>
                                                </td>
                                                <td className="border border-gray-200 p-4 text-center">{formatDate(item.waktuStatusBerubah)}</td>
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
                                {dummyData.find((d) => d.invoiceId === selectedNamaProduk)?.pemesanData[0].nama_pemesan}
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                                <span className="font-semibold">Kontak Pemesan:</span>{' '}
                                {dummyData.find((d) => d.invoiceId === selectedNamaProduk)?.pemesanData[0].kontak_pemesan}
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

export default OwnerRiwayatKasir;
