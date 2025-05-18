import { Card, CardContent } from '@/components/ui/card';

export default function FeaturedProductsSection() {
    const products = [
        {
            id: 1,
            name: 'Buku CAMPUS Isi 10',
            price: 'Rp 120.000',
            image: 'images/buku_campus.jpeg',
            alt: 'Buku Campus Isi 10',
        },
        {
            id: 2,
            name: 'Buku Tulis Bergaris',
            price: 'Rp 35.000',
            image: 'images/buku_campus.jpeg',
            alt: 'Buku Tulis Bergaris',
        },
        {
            id: 3,
            name: 'Binder Notebook A5',
            price: 'Rp 55.000',
            image: 'images/buku_campus.jpeg',
            alt: 'Binder Notebook A5',
        },
        {
            id: 4,
            name: 'Buku Gambar A4',
            price: 'Rp 25.000',
            image: 'images/buku_campus.jpeg',
            alt: 'Buku Gambar A4',
        },
    ];

    return (
    <section className="w-full bg-[#f6f6f6] py-20" id="produk">
            <div className="mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h2 className="font-[Poppins] text-4xl font-bold text-[#153e98]">Produk Unggulan</h2>
                    <p className="mt-3 font-[Poppins] text-lg text-[#3a3a3a]">Temukan alat tulis terbaik dan paling laris untuk kebutuhanmu</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <Card
                            key={product.id}
                            className="group cursor-pointer rounded-2xl bg-white shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
                        >
                            <div className="relative">
                                <img src={product.image} alt={product.alt} className="h-[260px] w-full rounded-t-2xl object-cover" />
                                <span className="absolute top-3 right-3 rounded-full bg-[#153e98] px-3 py-1 text-xs font-semibold text-white shadow-md">
                                    TERLARIS
                                </span>
                            </div>
                            <CardContent className="p-5">
                                <h3 className="font-[Poppins] text-base font-semibold text-[#1c283f]">{product.name}</h3>
                                <p className="mt-1 font-[Poppins] text-sm text-gray-500">Tersedia</p>
                                <p className="mt-2 font-[Poppins] text-lg font-bold text-[#56b280]">{product.price}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
