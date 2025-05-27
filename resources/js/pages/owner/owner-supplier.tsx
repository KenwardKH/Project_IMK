import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface Supplier {
    SupplierID: number;
    SupplierName: string;
    SupplierContact: string;
    SupplierAddress: string;
}

interface PageProps {
    suppliers: Supplier[];
    flash: {
        success?: string;
        error?: string;
    };
    [key: string]: any;
}

const OwnerSupplier = () => {
    const { suppliers, flash = {} } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, { duration: 5000 });
        } else if (flash.error) {
            toast.error(flash.error, { duration: 5000 });
        }
    }, [flash]);

    const handleDelete = (id: number) => {
    MySwal.fire({
        title: 'Yakin ingin menghapus supplier ini?',
        text: 'Tindakan ini tidak dapat dibatalkan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
    }).then((result) => {
        if (result.isConfirmed) {
            router.delete(`/owner-supplier/${id}`, {
                onSuccess: () => {
                    MySwal.fire('Berhasil!', 'Supplier telah dihapus.', 'success');
                },
                onError: () => {
                    MySwal.fire('Gagal!', 'Terjadi kesalahan saat menghapus supplier.', 'error');
                },
            });
        }
    });
};


    const filteredSuppliers = suppliers.filter((supplier) => supplier.SupplierName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <OwnerLayout>
            <Head title="Daftar Supplier" />
            <div className="flex w-full flex-col gap-6 px-6 py-4">
                <h1 className="flex w-full justify-center text-3xl font-bold">Daftar Supplier</h1>
                <section className="flex w-full items-center justify-between px-4 py-3">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari Supplier"
                            className="h-12 w-full rounded-md border border-gray-600 pr-4 pl-10 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link href={'/owner-supplier/tambah'}>
                        <button className="flex h-12 w-45 cursor-pointer items-center justify-center rounded-lg bg-[#009a00] text-lg font-bold text-[#ffffff] hover:bg-[#008000]">
                            <Plus size={25} /> Tambah Supplier
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
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Nama Supplier</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Kontak Supplier</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Alamat</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Edit</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Hapus</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-sm text-gray-700">
                                    {filteredSuppliers.map((supplier, index) => {
                                        const supplierID = supplier.SupplierID;
                                        return (
                                            <tr key={index} className="transition duration-200 hover:bg-gray-100">
                                                <td className="border border-gray-200 p-4 text-center">{supplier.SupplierID}</td>
                                                <td className="border border-gray-200 p-4 text-center whitespace-nowrap">{supplier.SupplierName}</td>
                                                <td className="border border-gray-200 p-4 text-center">{supplier.SupplierContact}</td>
                                                <td className="border border-gray-200 p-4 text-center">{supplier.SupplierAddress}</td>
                                                <td className="border border-gray-200 p-4 text-center">
                                                    <Link href={`/owner-supplier/edit/${supplierID}`}>
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
                                                        onClick={() => handleDelete(supplierID)}
                                                        className="rounded-full bg-red-500 p-2 text-white shadow transition hover:cursor-pointer hover:bg-red-600"
                                                        size="icon"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredSuppliers.length === 0 && (
                                        <tr>
                                            <td colSpan={10} className="border border-gray-200 p-8 text-center text-gray-500">
                                                Tidak ada supplier yang ditemukan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </OwnerLayout>
    );
};

export default OwnerSupplier;
