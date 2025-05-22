import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    address: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        address: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
            <div className="flex min-h-screen items-center justify-center bg-[#f1f5f9] px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="absolute top-4 left-4 flex cursor-pointer items-center text-sm font-medium text-[#2563eb] transition-colors hover:text-[#1e40af]"    
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back
                </button>
                <div className="w-full max-w-md space-y-6 rounded-3xl border border-[#e2e8f0] bg-white p-10 shadow-xl transition-all">
                    {/* Header */}
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold text-[#1e293b]">Create Account ✨</h1>
                        <p className="text-sm text-[#64748b]">Enter your details below to sign up</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <Label htmlFor="name" className="text-sm font-medium text-[#334155]">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-2 text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                                placeholder="Your full name"
                                disabled={processing}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

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
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-2 text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                                placeholder="you@example.com"
                                disabled={processing}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Phone */}
                        <div>
                            <Label htmlFor="phone" className="text-sm font-medium text-[#334155]">
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="mt-2 text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                                placeholder="Your phone number"
                                disabled={processing}
                            />
                            <InputError message={errors.phone} className="mt-2" />
                        </div>

                        {/* Address */}
                        <div>
                            <Label htmlFor="address" className="text-sm font-medium text-[#334155]">
                                Address
                            </Label>
                            <Input
                                id="address"
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="mt-2 text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                                placeholder="Your address"
                                disabled={processing}
                            />
                            <InputError message={errors.address} className="mt-2" />
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password" className="text-sm font-medium text-[#334155]">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-2 text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                                placeholder="Create a strong password"
                                disabled={processing}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Password Confirmation */}
                        <div>
                            <Label htmlFor="password_confirmation" className="text-sm font-medium text-[#334155]">
                                Confirm Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="mt-2 text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                                placeholder="Re-enter your password"
                                disabled={processing}
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full rounded-xl bg-[#2563eb] py-2 font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#1e40af] hover:shadow-lg"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Create account
                        </Button>

                        {/* Link to Login */}
                        <p className="text-center text-sm text-[#64748b]">
                            Already have an account?{' '}
                            <TextLink href={route('login')} className="font-medium text-[#2563eb] hover:underline">
                                Log in
                            </TextLink>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}