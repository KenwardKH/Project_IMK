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
    // Dummy data untuk fallback
    const dummyProducts: Product[] = [
        {
            id: 0,
            nama_produk: 'Pulpen Premium',
            deskripsi: 'Pulpen berkualitas tinggi untuk menulis nyaman.',
            satuan: 'pcs',
            stock: 99,
            harga_jual: 7500,
            gambar_produk: null,
        },
        {
            id: 1,
            nama_produk: 'Buku Tulis Siswa',
            deskripsi: 'Buku tulis dengan kertas tebal.',
            satuan: 'buku',
            stock: 50,
            harga_jual: 10000,
            gambar_produk: null,
        },
        {
            id: 2,
            nama_produk: 'Penggaris Transparan',
            deskripsi: 'Penggaris plastik bening ukuran 30cm.',
            satuan: 'pcs',
            stock: 80,
            harga_jual: 5000,
            gambar_produk: null,
        },
    ];

    const featuredProducts = products.length > 0 ? products.slice(0, 3) : dummyProducts;

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
                    {featuredProducts.map((product) => (
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
                                <p className="mt-2 font-[Poppins] text-lg font-bold text-price">
                                        {typeof product.harga_jual === 'number'
                                            ? product.harga_jual.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
                                            : product.harga_jual}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    {/* Card "Lihat Semua Produk" */}
                    <Link href="/products">
                        <Card className="flex h-full min-h-[260px] items-center justify-center rounded-2xl border-2 border-dashed border-[#153e98] bg-white text-center text-[#153e98] shadow-sm transition-all hover:scale-[1.03] hover:border-[#102e73] hover:text-[#102e73]">
                            <CardContent>
                                <p className="font-[Poppins] text-lg font-semibold">Lihat Semua Produk</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </section>
    );
}
