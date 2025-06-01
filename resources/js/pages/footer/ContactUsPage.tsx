import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, Headphones, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

interface FormData {
    name: string;
    email: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
}

export default function ContactUsPage() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nama lengkap wajib diisi';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Pesan wajib diisi';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Pesan minimal 10 karakter';
        }

        return newErrors;
    };

    const handleSubmit = async () => {
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Pesan Terkirim!',
                    text: data.message,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2563eb',
                });

                // Reset form
                setFormData({ name: '', email: '', message: '' });
                setErrors({});
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Mengirim',
                        text: data.message || 'Terjadi kesalahan saat mengirim pesan.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#dc2626',
                    });
                }
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Kesalahan Jaringan',
                text: 'Terjadi kesalahan koneksi. Silakan coba lagi.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc2626',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: Phone,
            title: 'Telepon',
            info: '(021) 1234-5678',
            desc: 'Sen-Jum: 08:00-17:00',
        },
        {
            icon: Mail,
            title: 'Email',
            info: 'info@sinarpelangi.com',
            desc: 'Respon dalam 24 jam',
        },
        {
            icon: MapPin,
            title: 'Alamat',
            info: 'Jl. Pendidikan No. 123',
            desc: 'Jakarta Selatan, 12345',
        },
        {
            icon: Clock,
            title: 'Jam Operasional',
            info: 'Senin - Jumat',
            desc: '08:00 - 17:00 WIB',
        },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="">
                    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                        <div className="space-y-6 text-center">
                            <Badge className="border-blue-400 bg-blue-500 px-4 py-2 text-sm text-white">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Hubungi Kami
                            </Badge>
                            <h1 className="text-4xl font-bold md:text-5xl">
                                Ada Pertanyaan atau <span className="text-yellow-300">Masalah?</span>
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg md:text-xl">
                                Kami siap membantu Anda. Laporkan masalah, ajukan pertanyaan, atau berikan saran untuk pelayanan yang lebih baik.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-3">
                            {/* Contact Form */}
                            <div className="lg:col-span-2">
                                <Card className="shadow-lg">
                                    <CardHeader className="pb-8">
                                        <div className="mb-4 flex items-center space-x-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                                                <Send className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl text-gray-900">Kirim Pesan</CardTitle>
                                                <p className="mt-1 text-gray-600">Isi form di bawah untuk menghubungi kami</p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-6">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                                        Nama Lengkap *
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        placeholder="Masukkan nama lengkap Anda"
                                                        className={`h-12 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                                                        disabled={isSubmitting}
                                                    />
                                                    {errors.name && (
                                                        <div className="flex items-center space-x-1 text-sm text-red-500">
                                                            <AlertCircle className="h-4 w-4" />
                                                            <span>{errors.name}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                                        Email *
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        placeholder="nama@email.com"
                                                        className={`h-12 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                                                        disabled={isSubmitting}
                                                    />
                                                    {errors.email && (
                                                        <div className="flex items-center space-x-1 text-sm text-red-500">
                                                            <AlertCircle className="h-4 w-4" />
                                                            <span>{errors.email}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                                                    Pesan / Laporan Masalah *
                                                </Label>
                                                <Textarea
                                                    id="message"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    placeholder="Deskripsikan masalah, pertanyaan, atau saran Anda dengan detail..."
                                                    rows={6}
                                                    className={`resize-none ${errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                                                    disabled={isSubmitting}
                                                />
                                                {errors.message && (
                                                    <div className="flex items-center space-x-1 text-sm text-red-500">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <span>{errors.message}</span>
                                                    </div>
                                                )}
                                                <p className="text-xs text-gray-500">Minimal 10 karakter ({formData.message.length}/10)</p>
                                            </div>

                                            <Button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                                className="h-12 w-full rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                        Mengirim...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="mr-2 h-5 w-5" />
                                                        Kirim Pesan
                                                    </>
                                                )}
                                            </Button>

                                            <p className="text-center text-xs text-gray-500">
                                                * Wajib diisi. Kami menghormati privasi Anda dan tidak akan membagikan informasi pribadi.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-8">
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                                                <Headphones className="h-5 w-5 text-white" />
                                            </div>
                                            <CardTitle className="text-xl text-gray-900">Informasi Kontak</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {contactInfo.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start space-x-4 rounded-xl bg-gray-50 p-4 transition-colors duration-200 hover:bg-gray-100"
                                            >
                                                <div className="flex-shrink-0">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                                        <item.icon className="h-5 w-5 text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                                    <p className="font-medium text-gray-800">{item.info}</p>
                                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
