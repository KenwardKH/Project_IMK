import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Barcode, Plus, Search, SquarePen, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const OwnerProduct = () => {
    interface RiwayatHarga {
        tanggal: string;
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
        riwayat_harga: RiwayatHarga[];
    }

    interface Props {
        products: ProductData[];
        flash: {
            success?: string;
            error?: string;
        };
        [key: string]: any;
    }

    const { products, flash = {} } = usePage<Props>().props;
    const [modalImage, setModalImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [showPriceModal, setShowPriceModal] = useState(false);
    const [selectedRiwayat, setSelectedRiwayat] = useState<RiwayatHarga[] | null>(null);
    const [selectedNamaProduk, setSelectedNamaProduk] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Barcode modal states
    const [showBarcodeModal, setShowBarcodeModal] = useState(false);
    const [barcodeData, setBarcodeData] = useState<string>('');
    const [barcodeProductName, setBarcodeProductName] = useState<string>('');
    const [barcodeProductId, setBarcodeProductId] = useState<string>('');
    const [isLoadingBarcode, setIsLoadingBarcode] = useState(false);
    const barcodeRef = useRef<HTMLDivElement | null>(null);

    const MySwal = withReactContent(Swal);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, { duration: 5000 });
        } else if (flash.error) {
            toast.error(flash.error, { duration: 5000 });
        }
    }, [flash]);

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

    const openBarcodeModal = async (productId: number) => {
        setIsLoadingBarcode(true);
        setShowBarcodeModal(true);

        try {
            const response = await fetch(`/owner-produk/barcode/${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setBarcodeData(data.barcode);
                setBarcodeProductName(data.product_name);
                setBarcodeProductId(data.product_id);
            } else {
                toast.error('Gagal memuat barcode');
                setShowBarcodeModal(false);
            }
        } catch (error) {
            console.error('Error generating barcode:', error);
            toast.error('Terjadi kesalahan saat memuat barcode');
            setShowBarcodeModal(false);
        } finally {
            setIsLoadingBarcode(false);
        }
    };

    const downloadBarcodeAsPNG = () => {
        if (!barcodeRef.current) return;

        const svgElement = barcodeRef.current.querySelector('svg');
        console.log(barcodeRef.current?.innerHTML);

        if (!svgElement) {
            toast.error('Barcode SVG tidak ditemukan');
            return;
        }

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const context = canvas.getContext('2d');
            if (context) {
                context.fillStyle = '#ffffff'; // Optional: background putih
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0);
                const pngUrl = canvas.toDataURL('image/png');

                const downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;
                downloadLink.download = `barcode_${barcodeProductId}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                URL.revokeObjectURL(url);
            }
        };
        img.onerror = () => {
            toast.error('Gagal memuat gambar untuk PNG');
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    const closeBarcodeModal = () => {
        setShowBarcodeModal(false);
        setBarcodeData('');
        setBarcodeProductName('');
        setBarcodeProductId('');
    };

    const handleDelete = (id: number) => {
        MySwal.fire({
            title: 'Yakin ingin menghapus produk ini?',
            text: 'Tindakan ini tidak dapat dibatalkan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/owner-produk/${id}`, {
                    onSuccess: () => {
                        MySwal.fire('Berhasil!', 'Produk telah dihapus.', 'success');
                    },
                    onError: () => {
                        MySwal.fire('Gagal!', 'Terjadi kesalahan saat menghapus produk.', 'error');
                    },
                });
            }
        });
    };

    // Format numbers for display
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Format date
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Filter products based on search term
    const filteredProducts = products.filter((product) => product.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <OwnerLayout>
            <Head title="Daftar Produk" />
            <div className="flex w-full flex-col gap-6 px-6 py-4">
                <h1 className="flex w-full justify-center text-3xl font-bold">Daftar Produk</h1>
                <section className="flex w-full items-center justify-between px-4 py-3">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari Produk"
                            className="h-12 w-full rounded-md border border-gray-600 pr-4 pl-10 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                            <table className="w-full min-w-[1200px] table-auto border-collapse">
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
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Barcode</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Edit</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Hapus</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-sm text-gray-700">
                                    {filteredProducts.map((item, index) => (
                                        <tr key={index} className="transition duration-200 hover:bg-gray-100">
                                            <td className="border border-gray-200 p-4 text-center">{index + 1}</td>
                                            <td className="border border-gray-200 p-4 text-center">
                                                {item.gambar_produk ? (
                                                    <img
                                                        src={`/storage/${item.gambar_produk}`}
                                                        alt={item.nama_produk}
                                                        className="mx-auto h-16 w-16 cursor-pointer rounded-md object-cover shadow-sm transition hover:scale-105"
                                                        onClick={() => openModal(`/storage/${item.gambar_produk}`)}
                                                    />
                                                ) : (
                                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500">
                                                        No Image
                                                    </div>
                                                )}
                                            </td>
                                            <td className="border border-gray-200 p-4 text-center whitespace-nowrap">{item.nama_produk}</td>
                                            <td className="border border-gray-200 p-4 text-center">{formatCurrency(item.harga_jual)}</td>
                                            <td className="border border-gray-200 p-4 text-center">{item.stock}</td>
                                            <td className="border border-gray-200 p-4 text-center">{item.satuan}</td>
                                            <td className="border border-gray-200 p-4 text-center">{item.deskripsi ? item.deskripsi : '-'}</td>
                                            <td className="border border-gray-200 p-4 text-center">
                                                <Button
                                                    onClick={() => openRiwayatModal(item.riwayat_harga || [], item.nama_produk)}
                                                    className="rounded-md bg-blue-500 px-3 py-2 text-xs text-white shadow transition hover:cursor-pointer hover:bg-blue-600"
                                                    disabled={!item.riwayat_harga || item.riwayat_harga.length === 0}
                                                >
                                                    {item.riwayat_harga && item.riwayat_harga.length > 0
                                                        ? `Riwayat Harga (${item.riwayat_harga.length})`
                                                        : 'Tidak Ada Riwayat'}
                                                </Button>
                                            </td>
                                            <td className="border border-gray-200 p-4 text-center">
                                                <Button
                                                    onClick={() => openBarcodeModal(item.id)}
                                                    className="rounded-full bg-green-500 p-2 text-white shadow transition hover:cursor-pointer hover:bg-green-600"
                                                    size="icon"
                                                >
                                                    <Barcode className="h-4 w-4" />
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
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={11} className="border border-gray-200 p-8 text-center text-gray-500">
                                                Tidak ada produk yang ditemukan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* Image Modal */}
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
                        {selectedRiwayat.length > 0 ? (
                            <div className="max-h-96 overflow-y-auto">
                                <div className="mb-2 grid grid-cols-2 font-semibold">
                                    <div>Tanggal</div>
                                    <div className="text-right">Harga</div>
                                </div>
                                <ul className="space-y-2">
                                    {selectedRiwayat.map((riwayat, idx) => (
                                        <li key={idx} className="flex justify-between border-b pb-1 text-sm text-gray-700">
                                            <span>{formatDate(riwayat.tanggal)}</span>
                                            <span>{formatCurrency(riwayat.harga)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">Tidak ada riwayat harga</p>
                        )}
                    </div>
                </div>
            )}

            {/* Barcode Modal */}
            {showBarcodeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeBarcodeModal}>
                    <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={closeBarcodeModal}
                            className="absolute top-2 right-2 rounded-full bg-gray-700 p-1 text-white hover:bg-gray-800"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">Barcode Produk</h2>

                        {isLoadingBarcode ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                                <span className="ml-2">Memuat barcode...</span>
                            </div>
                        ) : (
                            <div className="text-center">
                                <h3 className="mb-2 font-medium text-gray-700">{barcodeProductName}</h3>
                                <p className="mb-4 text-sm text-gray-500">ID Produk: {barcodeProductId}</p>

                                <div className="mb-4 flex flex-col justify-center rounded-lg border-2 border-gray-200 bg-white p-4">
                                    <div
                                        ref={barcodeRef}
                                        className="mb-4 flex justify-center rounded-lg border-2 border-gray-200 bg-white p-4"
                                        dangerouslySetInnerHTML={{ __html: barcodeData }}
                                    />

                                    <button
                                        onClick={downloadBarcodeAsPNG}
                                        className="mt-2 inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                    >
                                        Download PNG
                                    </button>
                                </div>

                                <p className="mt-2 text-xs text-gray-500">Barcode Type: Code 128</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </OwnerLayout>
    );
};

export default OwnerProduct;
