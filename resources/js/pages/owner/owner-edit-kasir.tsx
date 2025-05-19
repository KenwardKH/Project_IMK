import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { FiArrowLeftCircle } from 'react-icons/fi';

const OwnerEditKasir = () => {
    interface kasirData {
        nama_kasir: string;
        kontak_kasir: string;
        email_kasir: string;
        alamat_kasir: string;
    }
    const kasirData: kasirData = {
        nama_kasir: 'Naruto Uzumaki',
        kontak_kasir: '08123456789',
        email_kasir: 'naruto@gmail.com',
        alamat_kasir: 'Jalan Skip, Konohagakure, Jepang',
    }

    return (
        <OwnerLayout>
            <div className="flex justify-center py-8 text-black">
                <div className="mx-auto w-11/12 rounded-lg bg-white p-6 shadow-md">
                    <Link href="/owner-daftar-kasir" className="mb-4 inline-block text-blue-600 hover:underline">
                        <FiArrowLeftCircle size={50} className="text-black" />
                    </Link>

                    <h1 className="mb-6 text-center text-2xl font-bold">Tambah Kasir</h1>

                    <form className="space-y-4">
                        <div>
                            <label className="mb-1 block font-semibold">Nama Kasir</label>
                            <input
                                type="text"
                                value={kasirData.nama_kasir}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nama Kasir"
                            />

                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Kontak Kasir</label>
                            <input
                                type="text"
                                value={kasirData.kontak_kasir}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Kontak Kasir"
                            />
                            
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Email Kasir</label>
                            <input
                                type="text"
                                value={kasirData.email_kasir}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Email Kasir"
                            />
                            
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Alamat Kasir</label>
                            <textarea
                                rows={3}
                                value={kasirData.alamat_kasir}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Alamat Kasir"
                            ></textarea>
                            
                        </div>

                        <Button type="submit" className="mt-4 w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 hover:cursor-pointer">
                            Update Kasir
                        </Button>
                    </form>
                </div>
            </div>
        </OwnerLayout>
    );
};
export default OwnerEditKasir;
