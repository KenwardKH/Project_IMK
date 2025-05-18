import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@headlessui/react';
import { useState } from 'react';
import { FiArrowLeftCircle } from "react-icons/fi";

const OwnerTambahProduk = () => {
    const [gambarProduk, setGambarProduk] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setGambarProduk(file);

        if (file) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setIsLoading(false);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
            setIsLoading(false);
        }
    };

    return (
        <OwnerLayout>
            <div className="flex justify-center py-8 text-black">
                <div className="mx-auto w-11/12 rounded-lg bg-white p-6 shadow-md">
                    <a href="/owner-produk" className="mb-4 inline-block text-blue-600 hover:underline">
                        <FiArrowLeftCircle size={50} className='text-black' />
                    </a>

                    <h1 className="mb-6 text-center text-2xl font-bold">Tambah Produk</h1>

                    <form className="space-y-4">
                        <div>
                            <label className="mb-1 block font-semibold">Nama Produk</label>
                            <input
                                type="text"
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nama Produk"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Harga Jual</label>
                            <input
                                type="number"
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Harga Produk"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Satuan</label>
                            <input
                                type="text"
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Satuan Produk (misal: kotak, lusin)"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Deskripsi</label>
                            <textarea
                                rows={3}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Deskripsi Produk"
                            ></textarea>
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">{preview ? 'Preview Gambar Produk' : 'Unggah Gambar Produk'}</label>
                            {isLoading ? (
                                <div className="flex justify-center">
                                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                                </div>
                            ) : preview ? (
                                <div className="relative mx-auto w-full max-w-xs">
                                    <img src={preview} alt="Preview" className="rounded-md border shadow-md" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreview(null);
                                            setGambarProduk(null);
                                        }}
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

                        <Button className="mt-4 w-full rounded bg-[#009a00] px-4 py-2 font-bold text-white hover:bg-green-700">Simpan Produk</Button>
                    </form>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerTambahProduk;
