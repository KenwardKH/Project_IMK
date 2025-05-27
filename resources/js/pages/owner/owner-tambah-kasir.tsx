import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, useForm } from '@inertiajs/react';
import { FiArrowLeftCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';

const OwnerTambahKasir = () => {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        email: '',
        password: '',
        kontak: '',
        alamat: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(
            '/owner-daftar-kasir',
            {
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Kasir berhasil ditambahkan.',
                    });
                },
                onError: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: 'Terjadi kesalahan saat menambahkan kasir.',
                    });
                },
            },
        );
    };

    return (
        <OwnerLayout>
            <Head title="Tambah Kasir" />
            <div className="flex justify-center py-8 text-black">
                <div className="mx-auto w-11/12 rounded-lg bg-white p-6 shadow-md">
                    <Link href="/owner-daftar-kasir" className="mb-4 inline-block text-blue-600 hover:underline">
                        <FiArrowLeftCircle size={50} className="text-black" />
                    </Link>

                    <h1 className="mb-6 text-center text-2xl font-bold">Tambah Kasir</h1>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-1 block font-semibold">
                                Nama Kasir <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className={`w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.nama ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Nama Kasir"
                                required
                            />
                            {errors.nama && <p className="text-sm text-red-500">{errors.nama}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Kontak Kasir</label>
                            <input
                                type="text"
                                value={data.kontak}
                                onChange={(e) => {
                                    const onlyNumbers = e.target.value.replace(/\D/g, ''); // Hanya ambil angka
                                    setData('kontak', onlyNumbers);
                                }}
                                className={`w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.kontak ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Kontak Kasir"
                            />
                            {errors.kontak && <p className="text-sm text-red-500">{errors.kontak}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">
                                Email Kasir <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Email Kasir"
                                required
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Password"
                                required
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Alamat Kasir</label>
                            <textarea
                                rows={3}
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                className={`w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.alamat ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Alamat Kasir"
                            ></textarea>
                            {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="mt-4 w-full rounded bg-[#009a00] px-4 py-2 font-bold text-white hover:cursor-pointer hover:bg-green-700 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Kasir'}
                        </Button>
                    </form>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerTambahKasir;
