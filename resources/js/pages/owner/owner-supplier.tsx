import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Plus, Search, SquarePen, Trash2 } from 'lucide-react';

const OwnerSupplier = () => {

    interface supplierData {
        nama_supplier: string;
        kontak_supplier: string;
        alamat_supplier: string;
    }

    const supplierData: supplierData[] = [
        {
            nama_supplier: 'ATK Medan Jaya',
            kontak_supplier: '081234567890',
            alamat_supplier: 'Jl. Raya No. 1, Medan',
        },
        {
            nama_supplier: 'PT Sumber Makmur',
            kontak_supplier: '084656245656',
            alamat_supplier: 'Jl. Melawai No. 2, Medan',
        },
        {
            nama_supplier: 'ATK Sumber Rezeki',
            kontak_supplier: '081209385935',
            alamat_supplier: 'Jl. Dr Mansyur No. 3, Medan',
        },
        {
            nama_supplier: 'PT Perkasa Abadi',
            kontak_supplier: '083473467273',
            alamat_supplier: 'Jl. Alam No. 4, Medan',
        },
        {
            nama_supplier: 'PT Mandiri Jaya',
            kontak_supplier: '081394782742',
            alamat_supplier: 'Jl. Perkasa No. 5, Medan',
        },
    ];

    return (
        <OwnerLayout>
            <div>
                <section className="flex w-full items-center justify-between px-4 py-3">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari Produk"
                            className="h-12 w-full rounded-md border border-gray-600 pr-4 pl-10 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    {supplierData.map((item, index) => (
                                        <tr key={index} className="transition duration-200 hover:bg-gray-100">
                                            <td className="border border-gray-200 p-4 text-center">{index + 1}</td>
                                            <td className="border border-gray-200 p-4 text-center whitespace-nowrap">{item.nama_supplier}</td>
                                            <td className="border border-gray-200 p-4 text-center">{item.kontak_supplier}</td>
                                            <td className="border border-gray-200 p-4 text-center">{item.alamat_supplier}</td>
                                            <td className="border border-gray-200 p-4 text-center">
                                                <Link href="/owner-supplier/edit">
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

export default OwnerSupplier;
