import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@headlessui/react';
import { Link, useForm } from '@inertiajs/react';
import { FiArrowLeftCircle } from "react-icons/fi";


const OwnerTambahSupplier = () => {
    // pakai useForm dari inertiajs react untuk submit form
    const { data, setData, post, processing, errors } = useForm({
        SupplierName: '',
        SupplierContact: '',
        SupplierAddress: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('owner-supplier.store'));
    };

    return (
        <OwnerLayout>
            <div className="flex justify-center py-8 text-black">
                <div className="mx-auto w-11/12 rounded-lg bg-white p-6 shadow-md">
                    <Link href="/owner-produk" className="mb-4 inline-block text-blue-600 hover:underline">
                        <FiArrowLeftCircle size={50} className='text-black' />
                    </Link>

                    <h1 className="mb-6 text-center text-2xl font-bold">Tambah Supplier</h1>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="mb-1 block font-semibold">Nama Supplier</label>
                            <input
                                type="text"
                                value={data.SupplierName}
                                onChange={e => setData('SupplierName', e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nama Supplier"
                            />
                            {errors.SupplierName && <div className="text-red-600 text-sm">{errors.SupplierName}</div>}
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Kontak Supplier</label>
                            <input
                                type="text"
                                value={data.SupplierContact}
                                onChange={e => setData('SupplierContact', e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Kontak Supplier"
                            />
                            {errors.SupplierContact && <div className="text-red-600 text-sm">{errors.SupplierContact}</div>}
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Alamat Supplier</label>
                            <textarea
                                rows={3}
                                value={data.SupplierAddress}
                                onChange={e => setData('SupplierAddress', e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Alamat Supplier"
                            ></textarea>
                            {errors.SupplierAddress && <div className="text-red-600 text-sm">{errors.SupplierAddress}</div>}
                        </div>

                        <Button type="submit" className="mt-4 w-full rounded bg-[#009a00] px-4 py-2 font-bold text-white hover:bg-green-700 hover:cursor-pointer">
                            Simpan Supplier
                        </Button>
                    </form>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerTambahSupplier;