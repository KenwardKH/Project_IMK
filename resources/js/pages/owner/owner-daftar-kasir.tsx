import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// Define the interface for kasir data
interface KasirData {
    id: number;
    nama: string;
    email: string;
    kontak: string;
    alamat: string;
    userId?: number;
}

// Define props interface for the component
interface OwnerDaftarKasirProps {
    kasirData: KasirData[];
}

interface Props {
    flash: {
        success?: string;
        error?: string;
    };
}

const OwnerDaftarKasir = ({ kasirData }: OwnerDaftarKasirProps) => {
    const { flash = {} } = usePage<Props>().props;
    const [searchTerm, setSearchTerm] = useState('');

    // Filter cashiers based on search term
    const filteredKasirs = kasirData
        ? kasirData.filter(
              (kasir) =>
                  kasir.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  kasir.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  kasir.kontak.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  kasir.alamat.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : [];

    // Handle delete kasir
    const handleDeleteKasir = (id: number) => {
        Swal.fire({
            title: 'Yakin hapus kasir ini?',
            text: 'Data kasir yang dihapus tidak bisa dikembalikan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/owner-daftar-kasir/${id}`, {
                    onSuccess: () => {
                        Swal.fire('Terhapus!', 'Kasir berhasil dihapus.', 'success');
                    },
                    onError: () => {
                        Swal.fire('Gagal!', 'Gagal menghapus kasir.', 'error');
                    },
                });
            }
        });
    };

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, { duration: 5000 });
        } else if (flash.error) {
            toast.error(flash.error, { duration: 5000 });
        }
    }, [flash]);

    return (
        <OwnerLayout>
            <Head title="Daftar Kasir" />
            <div className="flex w-full flex-col gap-6 px-6 py-4">
                <h1 className="flex w-full justify-center text-3xl font-bold">Daftar Kasir</h1>
                <section className="flex w-full items-center justify-between px-4 py-3">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari kasir"
                            className="h-12 w-full rounded-md border border-gray-600 pr-4 pl-10 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link href={'/owner-daftar-kasir/create'}>
                        <button className="flex h-12 w-45 cursor-pointer items-center justify-center rounded-lg bg-[#009a00] text-lg font-bold text-[#ffffff] hover:bg-[#008000]">
                            <Plus size={25} /> Tambah Kasir
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
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Nama</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Email</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Kontak</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Alamat</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Edit</th>
                                        <th className="border border-gray-300 p-4 text-center font-semibold">Hapus</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-sm text-gray-700">
                                    {filteredKasirs.length > 0 ? (
                                        filteredKasirs.map((item, index) => (
                                            <tr key={item.id} className="transition duration-200 hover:bg-gray-100">
                                                <td className="border border-gray-200 p-4 text-center">{index + 1}</td>
                                                <td className="border border-gray-200 p-4 text-center whitespace-nowrap">{item.nama}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.email}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.kontak}</td>
                                                <td className="border border-gray-200 p-4 text-center">{item.alamat}</td>
                                                <td className="border border-gray-200 p-4 text-center">
                                                    <Link href={`/owner-daftar-kasir/${item.id}/edit`}>
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
                                                        className="rounded-full bg-red-500 p-2 text-white shadow transition hover:cursor-pointer hover:bg-red-600"
                                                        size="icon"
                                                        onClick={() => handleDeleteKasir(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="border border-gray-200 p-4 text-center">
                                                {searchTerm ? 'Data tidak ditemukan' : 'Belum ada data kasir'}
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

export default OwnerDaftarKasir;
