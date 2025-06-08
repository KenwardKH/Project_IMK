import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Email verification" />
            <div className="relative flex min-h-screen items-center justify-center bg-[#f1f5f9] px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-6 rounded-3xl border border-[#e2e8f0] bg-white p-10 shadow-xl transition-all">
                    {/* Header */}
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold text-[#1e293b]">Verifikasi Email 📧</h1>
                        <p className="text-sm text-[#64748b]">Silakan verifikasi alamat email Anda dengan mengklik link yang telah kami kirimkan</p>
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="text-center text-sm font-medium text-green-600">
                            Link verifikasi baru telah dikirim ke alamat email yang Anda berikan saat registrasi.
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={submit}>
                        {/* Submit button */}
                        <Button
                            type="submit"
                            className="w-full rounded-xl bg-[#2563eb] py-2 font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#1e40af] hover:shadow-lg"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Kirim Ulang Email Verifikasi
                        </Button>

                        {/* Link ke logout */}
                        <p className="text-center text-sm text-[#64748b]">
                            <TextLink href={route('logout')} method="post" className="font-medium text-[#2563eb] hover:underline">
                                Log out
                            </TextLink>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
