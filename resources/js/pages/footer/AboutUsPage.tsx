import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Award, Clock, Globe, Heart, Lightbulb, Shield, Target, Users } from 'lucide-react';

export default function AboutUsPage() {
    const achievements = [
        { icon: Award, title: '35+ Tahun', desc: 'Pengalaman melayani' },
        { icon: Users, title: '10,000+', desc: 'Pelanggan setia' },
        { icon: Globe, title: '50+', desc: 'Kota di Indonesia' },
        { icon: Heart, title: '99%', desc: 'Kepuasan pelanggan' },
    ];

    const values = [
        {
            icon: Target,
            title: 'Kualitas Terjamin',
            desc: 'Kami hanya menyediakan produk ATK berkualitas tinggi dari brand terpercaya untuk memastikan kepuasan Anda.',
        },
        {
            icon: Shield,
            title: 'Harga Terjangkau',
            desc: 'Komitmen kami memberikan harga terbaik tanpa mengorbankan kualitas produk yang kami jual.',
        },
        {
            icon: Clock,
            title: 'Layanan Cepat',
            desc: 'Proses pemesanan yang mudah dan pengiriman yang cepat untuk mendukung produktivitas Anda.',
        },
        {
            icon: Lightbulb,
            title: 'Inovasi Berkelanjutan',
            desc: 'Selalu menghadirkan produk-produk ATK terbaru dan inovatif untuk memenuhi kebutuhan modern.',
        },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen">
                {/* Hero Section */}
                {/* <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
                        <div className="space-y-8 text-center">
                            <Badge className="border-white/30 bg-white/20 px-4 py-2 text-sm text-white">Sejak 1990</Badge>
                            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                                Tentang <span className="text-yellow-300">Sinar Pelangi</span>
                            </h1>
                            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-blue-100 md:text-2xl">
                                Perjalanan 35 tahun menjadi penyedia alat tulis kantor terpercaya di Indonesia
                            </p>
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 h-20 bg-gradient-to-t from-slate-50"></div>
                </section> */}

                {/* Story Section */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid items-center gap-16 lg:grid-cols-2">
                            <div className="space-y-8">
                                <div>
                                    <Badge className="mb-4 bg-blue-100 text-blue-700">Cerita Kami</Badge>
                                    <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                                        Dari Toko Kecil Hingga Menjadi <span className="text-blue-600">Terpercaya</span>
                                    </h2>
                                </div>

                                <div className="prose prose-lg space-y-6 text-gray-700">
                                    <p>
                                        Dimulai pada tahun 1990, Sinar Pelangi ATK lahir dari visi sederhana: menyediakan alat tulis kantor
                                        berkualitas dengan harga terjangkau untuk mendukung pendidikan dan produktivitas masyarakat Indonesia.
                                    </p>

                                    <p>
                                        Dari sebuah toko kecil di Jakarta, kami telah berkembang menjadi distributor ATK terpercaya yang melayani
                                        berbagai kalangan, mulai dari pelajar, mahasiswa, hingga perusahaan besar di seluruh Indonesia.
                                    </p>

                                    <p>
                                        Kepercayaan pelanggan adalah aset terbesar kami. Selama 35 tahun, kami konsisten memberikan pelayanan terbaik
                                        dan terus berinovasi untuk memenuhi kebutuhan ATK yang terus berkembang.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-white">
                                        <div className="space-y-4 text-center">
                                            <div className="text-6xl font-bold text-blue-600">1990</div>
                                            <div className="text-xl text-gray-600">Tahun Berdiri</div>
                                            <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Achievements */}
                {/* <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <Badge className="mb-4 bg-green-100 text-green-700">Pencapaian Kami</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                                Bangga Melayani <span className="text-green-600">Indonesia</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                            {achievements.map((item, index) => (
                                <Card key={index} className="border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                                    <CardContent className="space-y-4 p-8 text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-blue-500">
                                            <item.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">{item.title}</div>
                                        <div className="text-gray-600">{item.desc}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section> */}

                {/* Values */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <Badge className="mb-4 bg-purple-100 text-purple-700">Nilai-Nilai Kami</Badge>
                            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                                Komitmen untuk <span className="text-purple-600">Keunggulan</span>
                            </h2>
                            <p className="mx-auto max-w-3xl text-xl text-gray-600">Empat pilar utama yang menjadi fondasi pelayanan terbaik kami</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                            {values.map((value, index) => (
                                <Card key={index} className="group border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                                    <CardContent className="p-8">
                                        <div className="flex items-start space-x-6">
                                            <div className="flex-shrink-0">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-110">
                                                    <value.icon className="h-7 w-7 text-white" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                                                <p className="leading-relaxed text-gray-600">{value.desc}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission Vision */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid gap-16 lg:grid-cols-2">
                            <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
                                <CardContent className="space-y-6 p-8">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400">
                                        <Target className="h-8 w-8 text-blue-900" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Misi Kami</h3>
                                    <p className="text-lg leading-relaxed">
                                        Menyediakan produk alat tulis kantor berkualitas tinggi dengan harga terjangkau, pelayanan prima, dan inovasi
                                        berkelanjutan untuk mendukung pendidikan, kreativitas, dan produktivitas masyarakat Indonesia.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
                                <CardContent className="space-y-6 p-8">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-400">
                                        <Lightbulb className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Visi Kami</h3>
                                    <p className="text-lg leading-relaxed">
                                        Menjadi penyedia alat tulis kantor nomor satu di Indonesia yang dikenal karena kualitas produk, pelayanan
                                        terdepan, dan kontribusi positif terhadap kemajuan pendidikan dan dunia kerja.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
                        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                            Bergabunglah dengan <span className="text-blue-600">Keluarga Besar</span> Kami
                        </h2>
                        <p className="mb-8 text-xl text-gray-600">Rasakan pengalaman berbelanja ATK yang menyenangkan dan memuaskan</p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <a
                                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                href="/products"
                            >
                                Mulai Berbelanja
                            </a>
                            <a
                                className="rounded-xl border-2 border-gray-300 px-8 py-4 font-semibold text-gray-700 transition-all duration-300 hover:border-blue-500 hover:text-blue-600"
                                href="/contact"
                            >
                                Hubungi Kami
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
