import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@headlessui/react';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FiArrowLeftCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';

interface Supplier {
    SupplierID: number;
    SupplierName: string;
    SupplierContact: string;
    SupplierAddress: string;
}
interface PageProps {
    supplier: Supplier;
    [key: string]: any;
}

const OwnerEditSupplier = () => {
    const { supplier } = usePage<PageProps>().props;

    const [nama_supplier, setNamaSupplier] = useState(supplier.SupplierName);
    const [kontak_supplier, setKontakSupplier] = useState(supplier.SupplierContact);
    const [alamat_supplier, setAlamatSupplier] = useState(supplier.SupplierAddress);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.put(
            `/owner-supplier/${supplier.SupplierID}`,
            {
                SupplierName: nama_supplier,
                SupplierContact: kontak_supplier,
                SupplierAddress: alamat_supplier,
            },
            {
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Data supplier berhasil diperbarui.',
                    });
                },
                onError: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: 'Terjadi kesalahan saat memperbarui data supplier.',
                    });
                },
            },
        );
    };

    return (
        <OwnerLayout>
            <div className="flex justify-center py-8 text-black">
                <div className="mx-auto w-11/12 rounded-lg bg-white p-6 shadow-md">
                    <Link href="/owner-supplier" className="mb-4 inline-block text-blue-600 hover:underline">
                        <FiArrowLeftCircle size={50} className="text-black" />
                    </Link>

                    <h1 className="mb-6 text-center text-2xl font-bold">Edit Supplier</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block font-semibold">Nama Supplier</label>
                            <input
                                type="text"
                                value={nama_supplier}
                                onChange={(e) => setNamaSupplier(e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Kontak Supplier</label>
                            <input
                                type="text"
                                value={kontak_supplier}
                                onChange={(e) => {
                                    const onlyNumbers = e.target.value.replace(/\D/g, ''); // Hapus semua karakter non-angka
                                    setKontakSupplier(onlyNumbers);
                                }}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Alamat Supplier</label>
                            <textarea
                                rows={3}
                                value={alamat_supplier}
                                onChange={(e) => setAlamatSupplier(e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            ></textarea>
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:cursor-pointer hover:bg-blue-700"
                        >
                            Update Supplier
                        </Button>
                    </form>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerEditSupplier;
