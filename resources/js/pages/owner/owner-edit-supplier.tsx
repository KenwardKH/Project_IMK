import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { FiArrowLeftCircle } from "react-icons/fi";

const OwnerEditSupplier = () => {
    // Dummy data untuk contoh, bisa diganti dengan data dari props atau API
    const dummyProduk = {
        nama_supplier: "ATK Medan Jaya",
        kontak_supplier: "081234567890",
        alamat_supplier: "Jl. Raya No. 1, Medan",
    };

    //
    const [nama_supplier, setNamaSupplier] = useState(dummyProduk.nama_supplier);
    const [kontak_supplier, setKontakSupplier] = useState(dummyProduk.kontak_supplier);
    const [alamat_supplier, setAlamatSupplier] = useState(dummyProduk.alamat_supplier);

    return (
        <OwnerLayout>
            <div className="flex justify-center py-8 text-black">
                <div className="mx-auto w-11/12 rounded-lg bg-white p-6 shadow-md">
                    <Link href="/owner-supplier" className="mb-4 inline-block text-blue-600 hover:underline">
                        <FiArrowLeftCircle size={50} className='text-black' />
                    </Link>

                    <h1 className="mb-6 text-center text-2xl font-bold">Edit Supplier</h1>

                    <form className="space-y-4">
                        <div>
                            <label className="mb-1 block font-semibold">Nama Supplier</label>
                            <input
                                type="text"
                                value={nama_supplier}
                                onChange={(e) => setNamaSupplier(e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Kontak Supplier</label>
                            <input
                                type="number"
                                value={kontak_supplier}
                                onChange={(e) => setKontakSupplier(e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Alamat Supplier</label>
                            <textarea
                                rows={3}
                                value={alamat_supplier}
                                onChange={(e) => setAlamatSupplier(e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            ></textarea>
                        </div>

                        <Button className="mt-4 w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 hover:cursor-pointer">
                            Update Produk
                        </Button>
                    </form>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerEditSupplier;
