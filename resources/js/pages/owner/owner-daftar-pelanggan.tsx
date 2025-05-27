import OwnerLayout from '@/components/owner/owner-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Search} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    flash: {
        success?: string;
        error?: string;
    };
}

const OwnerDaftarPelanggan = ({ customerData }) => {
    const { flash = {} } = usePage<Props>().props;
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleDeleteCustomer = (id) => {
        if (confirm('Anda yakin ingin menghapus pelanggan ini?')) {
            router.delete(`/owner-daftar-pelanggan/${id}`);
        }
    };

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, { duration: 5000 });
        } else if (flash.error) {
            toast.error(flash.error, { duration: 5000 });
        }
    }, [flash]);

    const filteredCustomers = useMemo(() => {
        if (!searchTerm.trim()) return customerData;
        return customerData.filter((item) => item.nama.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [customerData, searchTerm]);

    return (
        <OwnerLayout>
            <Head title="Daftar Pelanggan" />
            <div className="flex w-full flex-col gap-6 px-6 py-4">
                <h1 className="flex w-full justify-center text-3xl font-bold">Daftar Pelanggan</h1>
                <section className="flex w-full items-center justify-between px-4 py-3">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari Pelanggan"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-12 w-full rounded-md border border-gray-600 pr-4 pl-10 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </section>
                <section>
                    <div className="relative overflow-hidden rounded-lg shadow-md">
                        <div className="w-full overflow-x-auto rounded-xl shadow-md">
                            <table className="w-full min-w-[1000px] table-auto border-collapse">
                                <thead className="bg-gray-700 text-sm text-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">No.</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Nama</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Email</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Kontak</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Alamat</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-sm text-gray-700">
                                    {filteredCustomers &&
                                        filteredCustomers.map((item, index) => (
                                            <tr key={index} className="transition duration-200 hover:bg-gray-100">
                                                <td className="border border-gray-200 p-4 text-center">{index + 1}</td>
                                                <td className="border border-gray-200 p-4 text-center whitespace-nowrap">{item.nama}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.email}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.kontak}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.alamat}</td>
                                            </tr>
                                        ))}
                                        {filteredCustomers.length === 0 && (
                                        <tr>
                                            <td colSpan={10} className="border border-gray-200 p-8 text-center text-gray-500">
                                                Tidak ada pelanggan yang ditemukan
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

export default OwnerDaftarPelanggan;
