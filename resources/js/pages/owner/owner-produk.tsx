import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Plus, Search, SquarePen, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';




const OwnerProduct = () => {
    interface RiwayatHarga {
        tanggal: Date;
        harga: number;
    }

    interface ProductData {
        id: number;
        gambar_produk: string;
        nama_produk: string;
        harga_jual: number;
        stock: number;
        satuan: string;
        deskripsi: string;
        riwayat_harga?: RiwayatHarga[];
    }
    interface Props {
        products: ProductData[];
        [key: string]: any;
    }
    const { products } = usePage<Props>().props;
    const [modalImage, setModalImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [showPriceModal, setShowPriceModal] = useState(false);
    const [selectedRiwayat, setSelectedRiwayat] = useState<RiwayatHarga[] | null>(null);
    const [selectedNamaProduk, setSelectedNamaProduk] = useState<string>('');

    const openModal = (imageUrl: string) => {
        setModalImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setModalImage(null);
        setIsModalOpen(false);
    };

    const openRiwayatModal = (riwayat: RiwayatHarga[], nama: string) => {
        setSelectedRiwayat(riwayat);
        setSelectedNamaProduk(nama);
        setShowPriceModal(true);
    };

    const closeRiwayatModal = () => {
        setShowPriceModal(false);
        setSelectedRiwayat(null);
        setSelectedNamaProduk('');
    };
    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus produk ini?')) {
            router.delete(`/owner-produk/${id}`);
        }
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


    return (
        <OwnerLayout>
            <div>
                <section className="flex w-full items-center justify-between px-4 py-3">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari Produk"
                            className="h-12 w-full rounded-md border border-gray-600 pr-4 pl-10 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <Link href={'/owner-produk/tambah'}>
                        <button className="flex h-12 w-45 cursor-pointer items-center justify-center rounded-lg bg-[#009a00] text-lg font-bold text-[#ffffff] hover:bg-[#008000]">
                            <Plus size={25} /> Tambah Produk
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
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Gambar Produk</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Nama Produk</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Harga Jual</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Stock</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Satuan</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Deskripsi</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Riwayat Harga</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Edit</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Hapus</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-sm text-gray-700">
                                    {products.map((item, index) => (
                                        <tr key={index} className="transition duration-200 hover:bg-gray-100">
                                            <td className="border border-gray-200 p-4 text-center">{index + 1}</td>
                                            <td className="border border-gray-200 p-4 text-center">
                                                <img
                                                    src={`/storage/${item.gambar_produk}`}
                                                    alt={item.nama_produk}
                                                    className="mx-auto h-16 w-16 cursor-pointer rounded-md object-cover shadow-sm transition hover:scale-105"
                                                    onClick={() => openModal(`/storage/${item.gambar_produk}`)}
                                                />
                                            </td>
                                            <td className="border border-gray-200 p-4 text-center whitespace-nowrap">{item.nama_produk}</td>
                                            <td className="border border-gray-200 p-4 text-center">{formatCurrency(item.harga_jual)}</td>
                                            <td className="border border-gray-200 p-4 text-center">{item.stock}</td>
                                            <td className="border border-gray-200 p-4 text-center">{item.satuan}</td>
                                            <td className="border border-gray-200 p-4 text-center">{item.deskripsi}</td>
                                            <td className="border border-gray-200 p-4 text-center">
                                                <Button
                                                    // onClick={() => openRiwayatModal(item.riwayat_harga, item.nama_produk)}
                                                    className="rounded-md bg-blue-500 px-3 py-2 text-xs text-white shadow transition hover:bg-blue-600 hover:cursor-pointer"
                                                >
                                                    Riwayat Harga
                                                </Button>
                                            </td>
                                            <td className="border border-gray-200 p-4 text-center">
                                                <Link href={`/owner-produk/edit/${item.id}`}>
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
                                                    onClick={() => handleDelete(item.id)}
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

            {/* Modal Riwayat Harga */}
            {showPriceModal && selectedRiwayat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeRiwayatModal}>
                    <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={closeRiwayatModal}
                            className="absolute top-2 right-2 rounded-full bg-gray-700 p-1 text-white hover:bg-gray-800"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">Riwayat Harga - {selectedNamaProduk}</h2>
                        <ul className="space-y-2">
                            {selectedRiwayat.map((riwayat, idx) => (
                                <li key={idx} className="flex justify-between border-b pb-1 text-sm text-gray-700">
                                    <span>{riwayat.tanggal.toLocaleDateString('id-ID')}</span>
                                    <span>{formatCurrency(riwayat.harga)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </OwnerLayout>
    );
};

export default OwnerProduct;
