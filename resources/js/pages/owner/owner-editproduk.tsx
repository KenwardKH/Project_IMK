import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FiArrowLeftCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';

type Product = {
    id: number;
    nama: string;
    harga: number;
    satuan: string;
    deskripsi: string;
    gambar: string | null;
};

const OwnerEditProduk = ({ product }: { product: Product }) => {
    const { data, setData, post, processing } = useForm({
        nama: product.nama,
        harga: product.harga,
        satuan: product.satuan,
        deskripsi: product.deskripsi,
        gambar: null, // Changed: Start with null instead of product.gambar
        _method: 'POST', // Added: For Laravel method spoofing
        current_image: product.gambar, // Added: Track the current image separately
    });

    const baseImageUrl = '/storage/';
    const [preview, setPreview] = useState<string | null>(product.gambar ? `${baseImageUrl}${product.gambar}` : null);

    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('gambar', file);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);

        file && reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        post(`/owner-produk/update/${product.id}`, {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Produk berhasil diperbarui.',
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Terjadi kesalahan saat memperbarui produk.',
                });
            },
            onFinish: () => setIsLoading(false),
        });
    };

    const removeImage = () => {
        setPreview(null);
        setData('gambar', null);
        setData('current_image', null); // Added: Also update current_image when removing
    };

    return (
        <OwnerLayout>
            <Head title="Edit Produk" />
            <div className="flex justify-center py-8 text-black">
                <div className="mx-auto w-11/12 rounded-lg bg-white p-6 shadow-md">
                    <Link href="/owner-produk" className="mb-4 inline-block text-blue-600 hover:underline">
                        <FiArrowLeftCircle size={50} className="text-black" />
                    </Link>

                    <h1 className="mb-6 text-center text-2xl font-bold">Edit Produk</h1>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-1 block font-semibold">Nama Produk</label>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Harga Jual</label>
                            <input
                                type="number"
                                value={data.harga}
                                onChange={(e) => setData('harga', parseInt(e.target.value))}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Satuan</label>
                            <input
                                type="text"
                                value={data.satuan}
                                onChange={(e) => setData('satuan', e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Deskripsi</label>
                            <textarea
                                rows={3}
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">{preview ? 'Preview Gambar Produk' : 'Ubah Gambar Produk'}</label>
                            {isLoading ? (
                                <div className="flex justify-center">
                                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                                </div>
                            ) : preview ? (
                                <div className="relative mx-auto w-full max-w-xs">
                                    <img src={typeof preview === 'string' ? preview : ''} alt="Preview" className="rounded-md border shadow-md" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-1 right-1 h-10 w-10 rounded-full border-2 border-red-500 bg-white p-1 text-red-500 shadow hover:cursor-pointer hover:bg-red-100"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div className="relative cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-500">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 cursor-pointer opacity-0"
                                    />
                                    <div>
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M14 22l10-10 10 10m-10 14V12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-600">
                                            <span className="font-medium text-blue-600">Klik untuk upload</span> atau tarik gambar ke sini
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="mt-4 w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:cursor-pointer hover:bg-blue-700"
                        >
                            Update Produk
                        </Button>
                    </form>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerEditProduk;
