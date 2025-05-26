import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { FiArrowLeftCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';

const OwnerEditKasir = ({ kasir }) => {
    const { data, setData, put, errors, processing } = useForm({
        nama: kasir.nama || '',
        email: kasir.email || '',
        kontak: kasir.kontak || '',
        alamat: kasir.alamat || '',
        userId: kasir.userId || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(
            route('owner-daftar-kasir.update', kasir.id),
            {
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Data kasir berhasil diperbarui.',
                    });
                },
                onError: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: 'Terjadi kesalahan saat memperbarui data kasir.',
                    });
                },
            },
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'kontak') {
            const onlyNumbers = value.replace(/\D/g, ''); // Hanya angka
            setData(name, onlyNumbers);
        } else {
            setData(name, value);
        }
    };

    return (
        <OwnerLayout>
            <div className="flex justify-center py-8 text-black">
                <div className="mx-auto w-11/12 rounded-lg bg-white p-6 shadow-md">
                    <Link href={route('owner-daftar-kasir.index')} className="mb-4 inline-block text-blue-600 hover:underline">
                        <FiArrowLeftCircle size={50} className="text-black" />
                    </Link>

                    <h1 className="mb-6 text-center text-2xl font-bold">Edit Kasir</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block font-semibold">Nama Kasir</label>
                            <input
                                type="text"
                                name="nama"
                                value={data.nama}
                                onChange={handleChange}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nama Kasir"
                            />
                            {errors.nama && <div className="mt-1 text-sm text-red-600">{errors.nama}</div>}
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Email Kasir</label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Email Kasir"
                            />
                            {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Kontak Kasir</label>
                            <input
                                type="text"
                                name="kontak"
                                value={data.kontak}
                                onChange={handleChange}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Kontak Kasir"
                            />
                            {errors.kontak && <div className="mt-1 text-sm text-red-600">{errors.kontak}</div>}
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Alamat Kasir</label>
                            <textarea
                                rows={3}
                                name="alamat"
                                value={data.alamat}
                                onChange={handleChange}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Alamat Kasir"
                            ></textarea>
                            {errors.alamat && <div className="mt-1 text-sm text-red-600">{errors.alamat}</div>}
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:cursor-pointer hover:bg-blue-700"
                            disabled={processing}
                        >
                            {processing ? 'Updating...' : 'Update Kasir'}
                        </Button>
                    </form>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerEditKasir;
