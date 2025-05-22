import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

type Product = {
    id: number;
    nama_produk: string;
    deskripsi: string;
    satuan: string;
    stock: number;
    harga_jual: number;
    gambar_produk: string | null;
};

interface Props {
    products: Product[];
}

export default function FeaturedProductsSection({ products = [] }: Props) {
    // Take first 4 products or use all if less than 4
    const featuredProducts = products.slice(0, 4);

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
                    {featuredProducts.length > 0 ? (
                        featuredProducts.map((product) => (
                            <Link href={`/product/${product.id}`} key={product.id}>
                                <Card className="group cursor-pointer rounded-2xl bg-white shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-xl">
                                    <div className="relative">
                                        {product.gambar_produk ? (
                                            <img
                                                src={`/storage/${product.gambar_produk}`}
                                                alt={product.nama_produk}
                                                className="h-[260px] w-full rounded-t-2xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-[260px] w-full items-center justify-center rounded-t-2xl bg-gray-200">
                                                <span className="text-gray-400">No Image</span>
                                            </div>
                                        )}
                                        <span className="absolute top-3 right-3 rounded-full bg-[#153e98] px-3 py-1 text-xs font-semibold text-white shadow-md">
                                            TERLARIS
                                        </span>
                                    </div>
                                    <CardContent className="p-5">
                                        <h3 className="font-[Poppins] text-base font-semibold text-[#1c283f]">{product.nama_produk}</h3>
                                        <p className="mt-1 font-[Poppins] text-sm text-gray-500">{product.stock > 0 ? 'Tersedia' : 'Stok Habis'}</p>
                                        <p className="mt-2 font-[Poppins] text-lg font-bold text-[#56b280]">
                                            {typeof product.harga_jual === 'number'
                                                ? product.harga_jual.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
                                                : product.harga_jual}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        // Fallback for empty products array
                        <div className="col-span-full py-8 text-center">
                            <p className="text-gray-500">Tidak ada produk unggulan saat ini</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
