import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [clientErrors, setClientErrors] = useState<Partial<ResetPasswordForm>>({});
    const [passwordStrength, setPasswordStrength] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [showPasswordTip, setShowPasswordTip] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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

    const validate = () => {
        const newErrors: Partial<ResetPasswordForm> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.email) {
            newErrors.email = 'Email wajib diisi.';
        } else if (!emailRegex.test(data.email)) {
            newErrors.email = 'Format email tidak valid.';
        }

        if (!data.password) {
            newErrors.password = 'Password wajib diisi.';
        } else if (checkPasswordStrength(data.password) === 'Lemah') {
            newErrors.password = 'Password terlalu lemah. Harus memenuhi kriteria keamanan.';
        }

        if (!data.password_confirmation) {
            newErrors.password_confirmation = 'Konfirmasi password wajib diisi.';
        } else if (data.password !== data.password_confirmation) {
            newErrors.password_confirmation = 'Konfirmasi password tidak sesuai.';
        }

        setClientErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!validate()) return;

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    useEffect(() => {
        const strength = checkPasswordStrength(data.password);
        const passwordsMatch = data.password === data.password_confirmation;

        const valid = strength !== 'Lemah' && passwordsMatch;
        setIsFormValid(valid);
    }, [data.password, data.password_confirmation]);

    return (
        <>
            <Head title="Reset password" />
            <div className="relative flex min-h-screen items-center justify-center bg-[#f1f5f9] px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-6 rounded-3xl border border-[#e2e8f0] bg-white p-10 shadow-xl transition-all">
                    {/* Header */}
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold text-[#1e293b]">Reset Password 🔑</h1>
                        <p className="text-sm text-[#64748b]">Silakan masukkan password baru Anda</p>
                    </div>

                    <form className="space-y-5" onSubmit={submit}>
                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="text-sm font-medium text-[#334155]">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={data.email}
                                readOnly
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-2 bg-[#f8fafc] text-[#0f172a] transition-all placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                                placeholder="Email anda"
                            />
                            <InputError message={clientErrors.email || errors.email} />
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password" className="text-sm font-medium text-[#334155]">
                                Password Baru
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoFocus
                                    value={data.password}
                                    onChange={(e) => {
                                        const pwd = e.target.value;
                                        setData('password', pwd);
                                        setShowPasswordTip(!!pwd);
                                        setPasswordStrength(checkPasswordStrength(pwd));
                                    }}
                                    className="mt-2 pr-12 text-[#0f172a] transition-all placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                                    placeholder="Masukkan password baru"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors duration-200 hover:text-gray-600 focus:text-gray-600 focus:outline-none"
                                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
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
                            <InputError message={clientErrors.password || errors.password} />
                        </div>

                        {/* Password Confirmation */}
                        <div>
                            <Label htmlFor="password_confirmation" className="text-sm font-medium text-[#334155]">
                                Konfirmasi Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={showPasswordConfirm ? 'text' : 'password'}
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => {
                                        const confirmPwd = e.target.value;
                                        setData('password_confirmation', confirmPwd);
                                        setShowPasswordConfirmation(!!confirmPwd);
                                    }}
                                    className="mt-2 pr-12 text-[#0f172a] transition-all placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                                    placeholder="Konfirmasi password baru"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors duration-200 hover:text-gray-600 focus:text-gray-600 focus:outline-none"
                                    aria-label={showPasswordConfirm ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                                >
                                    {showPasswordConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {showPasswordConfirmation && data.password !== data.password_confirmation && (
                                <InputError message="Password tidak cocok" />
                            )}
                            <InputError message={clientErrors.password_confirmation || errors.password_confirmation} />
                        </div>

                        {/* Submit button */}
                        <Button
                            type="submit"
                            className="w-full rounded-xl bg-[#2563eb] py-2 font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#1e40af] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={!isFormValid || processing}
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Reset Password
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
