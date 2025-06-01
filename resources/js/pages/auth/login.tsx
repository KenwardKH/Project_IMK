import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react'; // Import ikon panah kiri
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => {
                reset('password');
                window.location.reload();
            },
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="relative flex min-h-screen items-center justify-center bg-[#f1f5f9] px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                {/* <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 flex items-center text-[#2563eb] hover:text-[#1e40af] transition-colors text-sm font-medium cursor-pointer "
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button> */}

                <div className="w-full max-w-md space-y-6 rounded-3xl border border-[#e2e8f0] bg-white p-10 shadow-xl transition-all">
                    {/* Header */}
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold text-[#1e293b]">Selamat datang 👋</h1>
                        <p className="text-sm text-[#64748b]">Silahkan daftar jika anda belum memiliki akun</p>
                    </div>

                    {status && <div className="text-center text-sm font-medium text-green-600">{status}</div>}

                    <form className="space-y-5" onSubmit={submit}>
                        <div>
                            <Label htmlFor="email" className="text-sm font-medium text-[#334155]">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-2 text-[#0f172a] transition-all placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                                placeholder="Masukkan email anda"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium text-[#334155]">
                                    Password
                                </Label>
                                {/* {canResetPassword && (
                  <TextLink
                    href={route('password.request')}
                    className="text-sm text-[#2563eb] hover:underline"
                  >
                    Lupa Password?
                  </TextLink>
                )} */}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-2 text-[#0f172a] transition-all placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                                placeholder="Masukkan password anda"
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                name="remember"
                checked={data.remember}
                onClick={() => setData('remember', !data.remember)}
              />
              <Label htmlFor="remember" className="text-sm text-[#334155]">Remember me</Label>
            </div> */}

                        <Button
                            type="submit"
                            className="w-full rounded-xl bg-[#2563eb] py-2 font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#1e40af] hover:shadow-lg"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Log in
                        </Button>

                        <p className="text-center text-sm text-[#64748b]">
                            Belum punya akun?{' '}
                            <TextLink href={route('register')} className="font-medium text-[#2563eb] hover:underline">
                                Daftar
                            </TextLink>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}