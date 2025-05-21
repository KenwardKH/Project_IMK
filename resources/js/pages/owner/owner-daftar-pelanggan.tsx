import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Search, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';

const OwnerDaftarPelanggan = ({ customerData }) => {
    const handleDeleteCustomer = (id) => {
        if (confirm('Anda yakin ingin menghapus pelanggan ini?')) {
            router.delete(`/owner-daftar-pelanggan/${id}`);
        }
    };

    return (
        <OwnerLayout>
            <div>
                <section className="flex w-full items-center justify-between px-4 py-3">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari Pelanggan"
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
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Hapus</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-sm text-gray-700">
                                    {customerData && customerData.map((item, index) => (
                                        <tr key={index} className="transition duration-200 hover:bg-gray-100">
                                            <td className="border border-gray-200 p-4 text-center">{index + 1}</td>
                                            <td className="border border-gray-200 p-4 text-center whitespace-nowrap">{item.nama}</td>
                                            <td className="border border-gray-200 p-4 text-center">{item.email}</td>
                                            <td className="border border-gray-200 p-4 text-center">{item.kontak}</td>
                                            <td className="border border-gray-200 p-4 text-center">{item.alamat}</td>
                                            <td className="border border-gray-200 p-4 text-center">
                                                <Button
                                                    className="rounded-full bg-red-500 p-2 text-white shadow transition hover:cursor-pointer hover:bg-red-600"
                                                    size="icon"
                                                    onClick={() => handleDeleteCustomer(item.id)}
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
        </OwnerLayout>
    );
};

export default OwnerDaftarPelanggan;
