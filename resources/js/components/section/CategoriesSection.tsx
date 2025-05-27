import { Card, CardContent } from '../ui/card';

// Categories Section
export default function CategoriesSection() {
    const categories = [
        { id: 1, title: 'Peralatan Kantor', image: '/images/buku_campus.jpeg', count: '120+ produk', color: 'from-blue-500 to-blue-600' },
        { id: 2, title: 'Peralatan Sekolah', image: '/images/buku_campus.jpeg', count: '85+ produk', color: 'from-green-500 to-green-600' },
        { id: 3, title: 'Pulpen & Pensil', image: '/images/buku_campus.jpeg', count: '200+ produk', color: 'from-purple-500 to-purple-600' },
        { id: 4, title: 'Buku & Kertas', image: '/images/buku_campus.jpeg', count: '150+ produk', color: 'from-orange-500 to-orange-600' },
        { id: 5, title: 'Alat Gambar', image: '/images/buku_campus.jpeg', count: '75+ produk', color: 'from-pink-500 to-pink-600' },
        { id: 6, title: 'Perlengkapan Lainnya', image: '/images/buku_campus.jpeg', count: '60+ produk', color: 'from-teal-500 to-teal-600' },
    ];

    return (
        <section className="py-16">
            <div className="mx-auto max-w-7xl px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Jelajahi Kategori</h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        Temukan produk alat tulis dan perlengkapan kantor terlengkap dalam berbagai kategori
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            className="group cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            <div className={`h-24 bg-gradient-to-br ${category.color} relative`}>
                                <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                        <img src={category.image} alt={category.title} className="h-8 w-8 object-contain" />
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-4 text-center">
                                <h3 className="mb-1 text-sm font-semibold text-gray-900">{category.title}</h3>
                                <p className="text-xs text-gray-500">{category.count}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
