import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { AlertCircle, CheckCircle, Clock, Headphones, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import React, { useState } from 'react';

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
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
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

    const handleSubmit = () => {
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            // Simulate form submission
            setIsSubmitted(true);
            // Reset form after successful submission
            setTimeout(() => {
                setFormData({ name: '', email: '', message: '' });
                setIsSubmitted(false);
            }, 3000);
        } else {
            setErrors(newErrors);
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
            <div className="min-h-screen ">
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
                                        {isSubmitted ? (
                                            <div className="space-y-4 py-12 text-center">
                                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                                </div>
                                                <h3 className="text-2xl font-semibold text-gray-900">Pesan Terkirim!</h3>
                                                <p className="mx-auto max-w-md text-gray-600">
                                                    Terima kasih telah menghubungi kami. Tim customer service akan merespon pesan Anda dalam waktu 24
                                                    jam.
                                                </p>
                                            </div>
                                        ) : (
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
                                                    className="h-12 w-full rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700"
                                                >
                                                    <Send className="mr-2 h-5 w-5" />
                                                    Kirim Pesan
                                                </Button>

                                                <p className="text-center text-xs text-gray-500">
                                                    * Wajib diisi. Kami menghormati privasi Anda dan tidak akan membagikan informasi pribadi.
                                                </p>
                                            </div>
                                        )}
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

                                {/* Quick Response Info */}
                                {/* <Card className="bg-blue-600 text-white shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex items-center space-x-3">
                                            <div className="bg-opacity-20 flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                                                <Users className="h-5 w-5 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold">Tim Customer Service</h3>
                                        </div>
                                        <p className="mb-4 text-blue-100">
                                            Tim profesional kami siap membantu menyelesaikan masalah Anda dengan cepat dan efektif.
                                        </p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="h-4 w-4 text-green-300" />
                                                <span>Respon dalam 24 jam</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="h-4 w-4 text-green-300" />
                                                <span>Support 7 hari seminggu</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="h-4 w-4 text-green-300" />
                                                <span>Solusi yang tepat sasaran</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card> */}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
