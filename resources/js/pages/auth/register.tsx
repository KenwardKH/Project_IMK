import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        address: '',
    });

    const [passwordStrength, setPasswordStrength] = useState('');
    const [showPasswordTip, setShowPasswordTip] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const validateName = (name: string) => /^[A-Za-z\s]+$/.test(name);
    const validatePhone = (phone: string) => /^\d+$/.test(phone);
    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const checkPasswordStrength = (password: string) => {
        let score = 0;
        if (password.length >= 6) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        if (password.length >= 8) score++;

        if (score <= 2) return 'Lemah';
        if (score === 3 || score === 4) return 'Sedang';
        return 'Kuat';
    };

    const isFormValid = () => {
        return (
            data.name.trim() !== '' &&
            validateName(data.name) &&
            data.email.trim() !== '' &&
            validateEmail(data.email) &&
            data.phone.trim() !== '' &&
            validatePhone(data.phone) &&
            data.address.trim() !== '' &&
            data.password.trim() !== '' &&
            checkPasswordStrength(data.password) === 'Kuat' &&
            data.password_confirmation.trim() !== '' &&
            data.password === data.password_confirmation
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Daftar" />
            <div className="flex min-h-screen items-center justify-center bg-[#f1f5f9] px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => window.history.back()}
                    className="absolute top-4 left-4 flex items-center text-sm font-medium text-[#2563eb] hover:text-[#1e40af]"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Kembali
                </button>
                <div className="w-full max-w-md space-y-6 rounded-3xl border border-[#e2e8f0] bg-white p-10 shadow-xl">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold text-[#1e293b]">Buat Akun ✨</h1>
                        <p className="text-sm text-[#64748b]">Isi data di bawah untuk mendaftar</p>
                    </div>
                    <form onSubmit={submit} className="space-y-5">
                        {/* Nama */}
                        <div>
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    if (name === '' || validateName(name)) {
                                        setData('name', name);
                                    }
                                }}
                                placeholder="Nama lengkap Anda"
                            />
                            {data.name && !validateName(data.name) && <InputError message="Nama hanya boleh huruf dan spasi" />}
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@contoh.com"
                            />
                            {data.email && !validateEmail(data.email) && <InputError message="Format email tidak valid" />}
                        </div>

                        {/* Nomor HP */}
                        <div>
                            <Label htmlFor="phone">Nomor HP</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => {
                                    const phone = e.target.value;
                                    if (phone === '' || validatePhone(phone)) {
                                        setData('phone', phone);
                                    }
                                }}
                                placeholder="Contoh: 081234567890"
                            />
                            {data.phone && !validatePhone(data.phone) && <InputError message="Nomor HP hanya boleh angka" />}
                        </div>

                        {/* Alamat */}
                        <div>
                            <Label htmlFor="address">Alamat</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Alamat lengkap"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password">Kata Sandi</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => {
                                    const pwd = e.target.value;
                                    setData('password', pwd);
                                    setShowPasswordTip(!!pwd);
                                    setPasswordStrength(checkPasswordStrength(pwd));
                                }}
                                placeholder="Buat kata sandi"
                            />
                            {showPasswordTip && (
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
                            )}
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => {
                                    const confirmPwd = e.target.value;
                                    setData('password_confirmation', confirmPwd);
                                    setShowPasswordConfirmation(!!confirmPwd);
                                }}
                                placeholder="Ketik ulang kata sandi"
                            />
                            {showPasswordConfirmation && data.password !== data.password_confirmation && (
                                <InputError message="Kata sandi tidak cocok" />
                            )}
                        </div>

                        {/* Tombol Daftar */}
                        <Button
                            type="submit"
                            className="w-full rounded-xl bg-[#2563eb] py-2 font-semibold text-white hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={!isFormValid() || processing}
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Daftar
                        </Button>

                        {/* Link Login */}
                        <p className="text-center text-sm text-[#64748b]">
                            Sudah punya akun?{' '}
                            <TextLink href={route('login')} className="font-medium text-[#2563eb] hover:underline">
                                Masuk
                            </TextLink>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
