import NavbarSection from '@/components/section/NavbarSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, CreditCard, HelpCircle, MessageCircle, Package, Search, Shield, Star, Truck, Users } from 'lucide-react';
import React, { useState } from 'react';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
    category: string;
}

interface Category {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    color: string;
}

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});

    const categories: Category[] = [
        { id: 'all', name: 'Semua', icon: HelpCircle, color: 'bg-slate-600' },
        { id: 'produk', name: 'Produk', icon: Package, color: 'bg-blue-600' },
        { id: 'pembayaran', name: 'Pembayaran', icon: CreditCard, color: 'bg-green-600' },
        { id: 'pengiriman', name: 'Pengiriman', icon: Truck, color: 'bg-orange-600' },
        { id: 'akun', name: 'Akun', icon: Users, color: 'bg-purple-600' },
        { id: 'garansi', name: 'Garansi', icon: Shield, color: 'bg-red-600' },
    ];

    const faqData: FAQItem[] = [
        {
            id: 1,
            question: 'Apa saja produk ATK yang tersedia di Sinar Pelangi?',
            answer: 'Kami menyediakan berbagai macam alat tulis kantor termasuk pulpen, pensil, penghapus, penggaris, kertas, map, stapler, lem, spidol, marker, tinta printer, dan berbagai peralatan kantor lainnya. Semua produk kami berasal dari brand ternama dengan kualitas terjamin.',
            category: 'produk',
        },
        {
            id: 2,
            question: 'Bagaimana cara melakukan pembayaran?',
            answer: 'Kami menerima berbagai metode pembayaran termasuk transfer bank (BCA, Mandiri, BNI, BRI), e-wallet (GoPay, OVO, DANA), kartu kredit/debit, dan pembayaran tunai untuk pembelian langsung di toko. Semua transaksi online aman dan terenkripsi.',
            category: 'pembayaran',
        },
        {
            id: 3,
            question: 'Berapa lama waktu pengiriman produk?',
            answer: 'Untuk wilayah Jakarta dan sekitarnya, pengiriman memerlukan waktu 1-2 hari kerja. Untuk luar Jakarta, waktu pengiriman 2-5 hari kerja tergantung lokasi. Kami menggunakan jasa kurir terpercaya seperti JNE, J&T, dan Sicepat.',
            category: 'pengiriman',
        },
        {
            id: 4,
            question: 'Apakah produk ATK memiliki garansi?',
            answer: 'Ya, semua produk elektronik seperti kalkulator, laminator, dan mesin penghancur kertas memiliki garansi resmi 1 tahun. Untuk produk non-elektronik, kami memberikan jaminan penggantian jika ada cacat produksi dalam 7 hari setelah pembelian.',
            category: 'garansi',
        },
        {
            id: 5,
            question: 'Bagaimana cara membuat akun di website Sinar Pelangi?',
            answer: "Klik tombol 'Daftar' di pojok kanan atas website, isi data diri lengkap termasuk nama, email, dan nomor telepon. Verifikasi email yang dikirim ke inbox Anda, dan akun Anda siap digunakan. Dengan akun, Anda bisa tracking pesanan dan mendapat promo eksklusif.",
            category: 'akun',
        },
        {
            id: 6,
            question: 'Apakah tersedia diskon untuk pembelian dalam jumlah besar?',
            answer: 'Ya, kami memberikan diskon khusus untuk pembelian grosir atau dalam jumlah besar. Diskon mulai dari 5% untuk pembelian di atas Rp 500.000 hingga 15% untuk pembelian di atas Rp 5.000.000. Hubungi customer service untuk penawaran khusus.',
            category: 'produk',
        },
        {
            id: 7,
            question: 'Apa yang harus dilakukan jika produk yang diterima rusak?',
            answer: 'Segera hubungi customer service maksimal 3x24 jam setelah produk diterima. Sertakan foto produk dan kemasan. Kami akan mengganti produk rusak tanpa biaya tambahan atau memberikan refund penuh sesuai kebijakan retur.',
            category: 'garansi',
        },
        {
            id: 8,
            question: 'Bisakah melakukan pembayaran secara kredit atau cicilan?',
            answer: 'Saat ini kami belum melayani pembayaran kredit atau cicilan. Namun, Anda bisa menggunakan kartu kredit untuk transaksi dan mengatur cicilan langsung dengan bank penerbit kartu kredit Anda.',
            category: 'pembayaran',
        },
        {
            id: 9,
            question: 'Apakah bisa mengubah alamat pengiriman setelah order dikonfirmasi?',
            answer: 'Perubahan alamat hanya bisa dilakukan jika pesanan belum diproses oleh tim packing (biasanya dalam 2 jam setelah order). Setelah itu, alamat tidak bisa diubah. Pastikan alamat pengiriman sudah benar sebelum konfirmasi pemesanan.',
            category: 'pengiriman',
        },
        {
            id: 10,
            question: 'Bagaimana cara melacak status pengiriman pesanan?',
            answer: 'Setelah pesanan dikirim, Anda akan menerima nomor resi via email dan SMS. Login ke akun Anda untuk melihat detail tracking, atau kunjungi website kurir yang bersangkutan dengan nomor resi tersebut untuk melacak posisi paket real-time.',
            category: 'pengiriman',
        },
    ];

    const toggleExpand = (id: number) => {
        setExpandedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const filteredFAQs = faqData.filter((faq) => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch =
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <>
        <NavbarSection />
            <div className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <section>
                    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                        <div className="space-y-6 text-center">
                            <Badge className="border-blue-400 bg-blue-500 px-4 py-2 text-sm ">
                                <HelpCircle className="mr-2 h-4 w-4" />
                                FAQ
                            </Badge>
                            <h1 className="text-4xl font-bold md:text-5xl">
                                Pertanyaan yang <span className="text-yellow-300">Sering Ditanyakan</span>
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg md:text-xl">
                                Temukan jawaban untuk pertanyaan umum seputar produk, pembayaran, pengiriman, dan layanan kami
                            </p>
                        </div>
                    </div>
                </section>

                {/* Search and Filter */}
                <section className="bg-white py-12 shadow-sm">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="space-y-8">
                            {/* Search Bar */}
                            <div className="mx-auto max-w-2xl">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Cari pertanyaan atau kata kunci..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-14 rounded-xl border-2 border-gray-200 pl-12 text-lg focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-wrap justify-center gap-3">
                                {categories.map((category) => (
                                    <Button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        variant={activeCategory === category.id ? 'default' : 'outline'}
                                        className={`h-12 rounded-xl px-6 font-medium transition-all duration-200 ${
                                            activeCategory === category.id
                                                ? `${category.color} text-white hover:opacity-90`
                                                : 'border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <category.icon className="mr-2 h-4 w-4" />
                                        {category.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Content */}
                <section className="py-16">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <div className="space-y-4">
                            {filteredFAQs.length === 0 ? (
                                <Card className="shadow-lg">
                                    <CardContent className="p-12 text-center">
                                        <MessageCircle className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                                        <h3 className="mb-2 text-xl font-semibold text-gray-900">Tidak ada hasil ditemukan</h3>
                                        <p className="text-gray-600">Coba ubah kata kunci pencarian atau pilih kategori lain</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                filteredFAQs.map((faq) => (
                                    <Card key={faq.id} className="shadow-lg transition-shadow duration-300 hover:shadow-xl">
                                        <CardContent className="p-0">
                                            <button
                                                onClick={() => toggleExpand(faq.id)}
                                                className="flex w-full items-center justify-between p-6 text-left transition-colors duration-200 hover:bg-gray-50"
                                            >
                                                <div className="flex flex-1 items-start space-x-4">
                                                    <div className="mt-1 flex-shrink-0">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                                            <HelpCircle className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="pr-4 text-lg font-semibold text-gray-900">{faq.question}</h3>
                                                        <Badge className="mt-2 bg-gray-100 text-xs text-gray-600">
                                                            {categories.find((c) => c.id === faq.category)?.name}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {expandedItems[faq.id] ? (
                                                        <ChevronUp className="h-5 w-5 text-gray-500" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5 text-gray-500" />
                                                    )}
                                                </div>
                                            </button>

                                            {expandedItems[faq.id] && (
                                                <div className="px-6 pb-6">
                                                    <div className="border-l-2 border-blue-100 pl-12">
                                                        <div className="pl-4">
                                                            <p className="text-base leading-relaxed text-gray-700">{faq.answer}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Help Section */}
                        <div className="mt-16">
                            <Card className="border-blue-200 bg-blue-50 shadow-lg">
                                <CardContent className="p-8 text-center">
                                    <div className="mb-4 flex items-center justify-center space-x-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                                            <MessageCircle className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Masih Ada Pertanyaan?</h3>
                                    </div>
                                    <p className="mx-auto mb-6 max-w-md text-gray-600">
                                        Jika Anda tidak menemukan jawaban yang dicari, jangan ragu untuk menghubungi tim customer service kami
                                    </p>
                                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                        <Button className="rounded-xl bg-blue-600 px-8 py-3 text-white hover:bg-blue-700">
                                            <MessageCircle className="mr-2 h-5 w-5" />
                                            Hubungi Customer Service
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="rounded-xl border-2 border-blue-600 px-8 py-3 text-blue-600 hover:bg-blue-50"
                                        >
                                            <Star className="mr-2 h-5 w-5" />
                                            Berikan Feedback
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
