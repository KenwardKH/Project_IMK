import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';

const OwnerPembelianSupply = () => {
    interface detailPesanan {
        nama_produk: string;
        harga: number;
        jumlah: number;
        diskon: string | number;
    }

    interface pembelianSupplyData {
        id_invoice: string;
        gambar_invoice: string;
        nomor_invoice: string;
        nama_supplier: string;
        jumlah_produk: number;
        harga_total: number;
        tanggal_invoice: Date;
        detail_pesanan: detailPesanan[];
    }

    const [modalImage, setModalImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<detailPesanan[] | null>(null);
    const [selectedIdInvoice, setSelectedIdInvoice] = useState<string>('');

    const openModal = (imageUrl: string) => {
        setModalImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setModalImage(null);
        setIsModalOpen(false);
    };

    const openDetailModal = (detail: detailPesanan[], idInvoice: string) => {
        setSelectedDetail(detail);
        setSelectedIdInvoice(idInvoice);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedDetail(null);
        setSelectedIdInvoice('');
    };

    const hitungDiskonBerlapis = (harga: number, jumlah: number, diskon: string | number): number => {
        let total = harga * jumlah;

        if (typeof diskon === 'number') {
            total = total - total * (diskon / 100);
        } else {
            const diskonList = diskon
                .split('+')
                .map((d) => parseFloat(d.trim()))
                .filter((d) => !isNaN(d));

            for (const d of diskonList) {
                total -= total * (d / 100);
            }
        }

        return total;
    };

    // State to manage window width for responsive design
    // const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

    // useEffect(() => {
    //     const handleResize = () => {
    //         setWindowWidth(window.innerWidth);
    //     };

    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

    // Format numbers for display
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const productData: pembelianSupplyData[] = [
        {
            id_invoice: '1',
            gambar_invoice: 'kwitansi.jpg',
            nomor_invoice: 'AMJ-101',
            nama_supplier: 'ATK Medan Jaya',
            jumlah_produk: 3,
            harga_total: 19413000,
            tanggal_invoice: new Date('2025-05-01'),
            detail_pesanan: [
                { nama_produk: 'Pensil 2B', harga: 24000, jumlah: 400, diskon: 10 },
                { nama_produk: 'Spidol Snowman Merah', harga: 36000, jumlah: 350, diskon: '10+5' },
            ],
        },
        {
            id_invoice: '2',
            gambar_invoice: 'kwitansi.jpg',
            nomor_invoice: 'AMJ-101',
            nama_supplier: 'ATK Medan Jaya',
            jumlah_produk: 3,
            harga_total: 19413000,
            tanggal_invoice: new Date('2025-05-01'),
            detail_pesanan: [
                { nama_produk: 'Pensil 2B', harga: 24000, jumlah: 400, diskon: 10 },
                { nama_produk: 'Spidol Snowman Merah', harga: 36000, jumlah: 350, diskon: '10+5' },
            ],
        },
        {
            id_invoice: '3',
            gambar_invoice: 'kwitansi.jpg',
            nomor_invoice: 'AMJ-101',
            nama_supplier: 'ATK Medan Jaya',
            jumlah_produk: 3,
            harga_total: 19413000,
            tanggal_invoice: new Date('2025-05-01'),
            detail_pesanan: [
                { nama_produk: 'Pensil 2B', harga: 24000, jumlah: 400, diskon: 10 },
                { nama_produk: 'Spidol Snowman Merah', harga: 36000, jumlah: 350, diskon: '10+5' },
            ],
        },
    ];

    return (
        <OwnerLayout>
            <div>
                <section className="flex w-full items-center justify-end px-4 py-3">
                    <Link href={'/owner-pembelian-supply/tambah'}>
                        <button className="flex h-12 w-45 cursor-pointer items-center justify-center rounded-lg bg-[#009a00] text-lg font-bold text-[#ffffff] hover:bg-[#008000]">
                            <Plus size={25} /> Pesan Supply
                        </button>
                    </Link>
                </section>
                <section>
                    <div className="relative overflow-hidden rounded-lg shadow-md">
                        <div className="w-full overflow-x-auto rounded-xl shadow-md">
                            <table className="w-full min-w-[1000px] table-auto border-collapse">
                                <thead className="bg-gray-700 text-sm text-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">No.</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Gambar Invoice</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Nomor Invoice</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Nama Supplier</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Jumlah Produk</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Harga Total</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Tanggal Invoice</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Detail Pesanan</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Edit</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Hapus</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-sm text-gray-700">
                                    {productData.map((item, index) => (
                                        <tr key={index} className="transition duration-200 hover:bg-gray-100">
                                            <td className="border border-gray-200 p-4 text-center">{index + 1}</td>
                                            <td className="border border-gray-200 p-4 text-center">
                                                <img
                                                    src={`/images/supply-invoices/${item.gambar_invoice}`}
                                                    alt={item.nomor_invoice}
                                                    className="mx-auto h-16 w-16 cursor-pointer rounded-md object-cover shadow-sm transition hover:scale-105"
                                                    onClick={() => openModal(`/images/supply-invoices/${item.gambar_invoice}`)}
                                                />
                                            </td>
                                            <td className="border border-gray-200 p-4 text-center whitespace-nowrap">{item.nomor_invoice}</td>
                                            <td className="border border-gray-200 p-4 text-center">{item.nama_supplier}</td>
                                            <td className="border border-gray-200 p-4 text-center">{item.jumlah_produk}</td>
                                            <td className="border border-gray-200 p-4 text-center">{formatCurrency(item.harga_total)}</td>
                                            <td className="border border-gray-200 p-4 text-center">
                                                {item.tanggal_invoice.toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="border border-gray-200 p-4 text-center">
                                                <Button
                                                    onClick={() => openDetailModal(item.detail_pesanan, item.id_invoice)}
                                                    className="rounded-md bg-blue-500 px-3 py-2 text-xs text-white shadow transition hover:bg-blue-600 hover:cursor-pointer"
                                                >
                                                    Detail Harga
                                                </Button>
                                            </td>
                                            <td className="border border-gray-200 p-4 text-center">
                                                <Link href="/owner-pembelian-supply/edit">
                                                    <Button
                                                        className="rounded-full bg-yellow-400 p-2 text-white shadow transition hover:cursor-pointer hover:bg-yellow-500"
                                                        size="icon"
                                                    >
                                                        <SquarePen className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </td>
                                            <td className="border border-gray-200 p-4 text-center">
                                                <Button
                                                    className="rounded-full bg-red-500 p-2 text-white shadow transition hover:cursor-pointer hover:bg-red-600"
                                                    size="icon"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
            {isModalOpen && modalImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" // lebih terang dari bg-black/70
                    onClick={closeModal} // klik di background menutup modal
                >
                    <div
                        className="relative w-full max-w-lg rounded-lg bg-white p-4 shadow-lg"
                        onClick={(e) => e.stopPropagation()} // mencegah modal menutup saat klik gambar/modal
                    >
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

            {/* Modal Detail */}
            {showDetailModal && selectedDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeDetailModal}>
                    <div className="relative w-full max-w-2xl rounded-lg bg-gray-100 p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">Detail Pesanan</h2>

                        <div className="overflow-x-auto rounded-md">
                            <table className="w-full table-auto border border-gray-400 bg-white text-sm">
                                <thead className="bg-gray-200 text-gray-800">
                                    <tr>
                                        <th className="border px-3 py-2 font-semibold">Nama Produk</th>
                                        <th className="border px-3 py-2 font-semibold">Harga</th>
                                        <th className="border px-3 py-2 font-semibold">Jumlah</th>
                                        <th className="border px-3 py-2 font-semibold">Diskon</th>
                                        <th className="border px-3 py-2 font-semibold">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedDetail.map((item, idx) => {
                                        // hitung subtotal
                                        const harga = item.harga;
                                        const jumlah = item.jumlah;
                                        const subtotal = hitungDiskonBerlapis(harga, jumlah, item.diskon);

                                        return (
                                            <tr key={idx} className="text-center">
                                                <td className="border px-3 py-2">{item.nama_produk}</td>
                                                <td className="border px-3 py-2">{formatCurrency(harga)}</td>
                                                <td className="border px-3 py-2">
                                                    {jumlah.toLocaleString()} {item.nama_produk.toLowerCase().includes('pensil') ? 'lusin' : 'kotak'}
                                                </td>
                                                <td className="border px-3 py-2">{item.diskon}</td>
                                                <td className="border px-3 py-2">{formatCurrency(subtotal)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Total Harga */}
                        <div className="mt-4 text-right text-lg font-semibold text-gray-800">
                            Total Pesanan:{' '}
                            {formatCurrency(
                                selectedDetail.reduce((total, item) => {
                                    return total + hitungDiskonBerlapis(item.harga, item.jumlah, item.diskon);
                                }, 0),
                            )}
                        </div>

                        {/* Tombol Tutup */}
                        <div className="mt-6 text-center">
                            <button onClick={closeDetailModal} className="rounded-md bg-red-600 px-6 py-2 text-white transition hover:bg-red-700">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </OwnerLayout>
    );
};

export default OwnerPembelianSupply;
