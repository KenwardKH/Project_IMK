import InputError from '@/components/input-error';
import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { FiArrowLeftCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';

const OwnerTambahKasir = () => {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        email: '',
        password: '',
        password_confirmation: '',
        kontak: '',
        alamat: '',
    });

    const [passwordStrength, setPasswordStrength] = useState('');
    const [showPasswordTip, setShowPasswordTip] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    // Fungsi untuk mengecek kekuatan password
    const checkPasswordStrength = (password) => {
        if (password.length < 8) return 'Lemah';

        let strength = 0;

        // Cek panjang password
        if (password.length >= 8) strength++;

        // Cek huruf besar
        if (/[A-Z]/.test(password)) strength++;

        // Cek angka
        if (/[0-9]/.test(password)) strength++;

        // Cek karakter khusus
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 2) return 'Lemah';
        if (strength === 3) return 'Sedang';
        return 'Kuat';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post('/owner-daftar-kasir', {
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
        });
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

                        {/* Password */}
                        <div>
                            <label className="mb-1 block font-semibold">
                                Kata Sandi <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => {
                                        const pwd = e.target.value;
                                        setData('password', pwd);
                                        setShowPasswordTip(!!pwd);
                                        setPasswordStrength(checkPasswordStrength(pwd));
                                    }}
                                    className={`w-full rounded border p-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Buat kata sandi"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors duration-200 hover:text-gray-600 focus:text-gray-600 focus:outline-none"
                                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {showPasswordTip && (
                                <>
                                    <p
                                        className={`mt-1 text-sm font-medium ${
                                            passwordStrength === 'Lemah'
                                                ? 'text-red-500'
                                                : passwordStrength === 'Sedang'
                                                  ? 'text-yellow-500'
                                                  : 'text-green-600'
                                        }`}
                                    >
                                        Kekuatan: {passwordStrength}
                                    </p>
                                    <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                                        <li>Minimal 8 karakter</li>
                                        <li>Mengandung huruf besar (A-Z)</li>
                                        <li>Mengandung angka (0-9)</li>
                                        <li>Mengandung simbol atau karakter khusus (mis. @#$%^&*)</li>
                                    </ul>
                                </>
                            )}
                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <label className="mb-1 block font-semibold">
                                Konfirmasi Kata Sandi <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswordConfirm ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={(e) => {
                                        const confirmPwd = e.target.value;
                                        setData('password_confirmation', confirmPwd);
                                        setShowPasswordConfirmation(!!confirmPwd);
                                    }}
                                    className={`w-full rounded border p-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Ketik ulang kata sandi"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors duration-200 hover:text-gray-600 focus:text-gray-600 focus:outline-none"
                                    aria-label={showPasswordConfirm ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
                                >
                                    {showPasswordConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {showPasswordConfirmation && data.password !== data.password_confirmation && (
                                <p className="text-sm text-red-500">Kata sandi tidak cocok</p>
                            )}
                            {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
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
