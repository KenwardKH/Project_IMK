import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';
import Swal from 'sweetalert2';

type ProfileForm = {
    name: string;
    email: string;
};

const OwnerProfile = ({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) => {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Menggunakan window.route() untuk mengakses route helper Laravel
        const routeUrl = typeof window !== 'undefined' && (window as any).route ? (window as any).route('owner.profile.update') : '/owner-profile';

        patch(routeUrl, {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Profile berhasil diperbarui!',
                    confirmButtonColor: '#10B981', // Tailwind green-500
                });
            },
            onError: (errors) => {
                console.error('Update failed:', errors);
                Swal.fire({
                    icon: 'error',
                    title: 'Update failed!',
                    text: 'There was an error updating your profile. Please try again.',
                    confirmButtonColor: '#EF4444', // Tailwind red-500
                });
            },
        });
    };

    return (
        <OwnerLayout>
            <Head title="Profile Owner" />
            <div className="flex justify-center py-8 text-black">
                <div className="mx-auto w-11/12 rounded-lg bg-white p-6 shadow-md">
                    <div className="mb-6">
                        <HeadingSmall title="Informasi Profil" description="Silahkan perbarui nama dan alamat email anda!" />
                        <form onSubmit={submit} className="my-4 space-y-6">
                            {/* Input Nama */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="Nama lengkap"
                                />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            {/* Input Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="username"
                                    placeholder="Alamat email"
                                />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            {/* Notifikasi Verifikasi Email */}
                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div className="-mt-4">
                                    <p className="text-muted-foreground text-sm">
                                        Alamat email Anda belum terverifikasi.{' '}
                                        <Link
                                            href={
                                                typeof window !== 'undefined' && (window as any).route
                                                    ? (window as any).route('verification.send')
                                                    : '/email/verification-notification'
                                            }
                                            method="post"
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current dark:decoration-neutral-500"
                                        >
                                            Klik di sini untuk mengirim ulang email verifikasi.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <p className="mt-2 text-sm font-medium text-green-600">
                                            Link verifikasi baru telah dikirim ke alamat email Anda.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Tombol Simpan */}
                            <div className="flex items-center gap-4">
                                <Button disabled={processing} type="submit">
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">Tersimpan</p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerProfile;
