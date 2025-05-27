// import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

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
        <section className="w-full py-20" id="produk">
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
                                    <p className="text-price mt-2 font-[Poppins] text-lg font-bold">
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

// Featured Products Section
// export default function FeaturedProductsSection() {
//     const products = [
//         {
//             id: 1,
//             name: 'Pulpen Premium Pilot',
//             price: 25000,
//             originalPrice: 30000,
//             image: '/images/buku_campus.jpeg',
//             rating: 4.8,
//             reviews: 124,
//             badge: 'Terlaris',
//             discount: 17,
//         },
//         {
//             id: 2,
//             name: 'Buku Tulis Campus A5',
//             price: 12000,
//             originalPrice: 15000,
//             image: '/images/buku_campus.jpeg',
//             rating: 4.9,
//             reviews: 89,
//             badge: 'Promo',
//             discount: 20,
//         },
//         {
//             id: 3,
//             name: 'Set Penggaris Geometri',
//             price: 18000,
//             originalPrice: null,
//             image: '/images/buku_campus.jpeg',
//             rating: 4.7,
//             reviews: 156,
//             badge: 'Baru',
//             discount: 0,
//         },
//         {
//             id: 4,
//             name: 'Spidol Whiteboard Set',
//             price: 35000,
//             originalPrice: 42000,
//             image: '/images/buku_campus.jpeg',
//             rating: 4.6,
//             reviews: 78,
//             badge: 'Hemat',
//             discount: 17,
//         },
//     ];

//     const badgeColors = {
//         Terlaris: 'bg-red-500',
//         Promo: 'bg-orange-500',
//         Baru: 'bg-green-500',
//         Hemat: 'bg-blue-500',
//     };

//     return (
//         <section className="bg-gray-50 py-16">
//             <div className="mx-auto max-w-7xl px-4">
//                 <div className="mb-12 flex items-center justify-between">
//                     <div>
//                         <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Produk Unggulan</h2>
//                         <p className="text-lg text-gray-600">Produk terlaris dan paling direkomendasikan</p>
//                     </div>
//                     <Button variant="outline" className="hidden md:flex">
//                         Lihat Semua Produk
//                     </Button>
//                 </div>

//                 <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
//                     {products.map((product) => (
//                         <Card
//                             key={product.id}
//                             className="group cursor-pointer border-0 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
//                         >
//                             <div className="relative overflow-hidden">
//                                 <img
//                                     src={product.image}
//                                     alt={product.name}
//                                     className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
//                                 />
//                                 {/* <span
//                                     className={`absolute top-3 left-3 ${badgeColors[product.badge]} rounded-full px-2 py-1 text-xs font-semibold text-white`}
//                                 >
//                                     {product.badge}
//                                 </span>
//                                 {product.discount > 0 && (
//                                     <span className="absolute top-3 right-3 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
//                                         -{product.discount}%
//                                     </span>
//                                 )} */}
//                                 <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors group-hover:bg-black/20 group-hover:opacity-100">
//                                     <div className="flex space-x-2">
//                                         <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
//                                             <Eye className="h-4 w-4" />
//                                         </Button>
//                                         <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
//                                             <Heart className="h-4 w-4" />
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </div>
//                             <CardContent className="p-4">
//                                 <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">{product.name}</h3>
//                                 <div className="mb-2 flex items-center">
//                                     <div className="flex items-center">
//                                         {/* {[...Array(5)].map((_, i) => (
//                                             <Star
//                                                 key={i}
//                                                 className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
//                                             />
//                                         ))} */}
//                                     </div>
//                                     <span className="ml-1 text-xs text-gray-500">Stok: ({product.reviews})</span>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="font-bold text-blue-600">Rp {product.price.toLocaleString('id-ID')}</p>
//                                         {product.originalPrice && (
//                                             <p className="text-xs text-gray-400 line-through">Rp {product.originalPrice.toLocaleString('id-ID')}</p>
//                                         )}
//                                     </div>
//                                     <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
//                                         <ShoppingCart className="h-4 w-4" />
//                                     </Button>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </div>

//                 <div className="mt-8 text-center md:hidden">
//                     <Button className="bg-blue-600 hover:bg-blue-700">Lihat Semua Produk</Button>
//                 </div>
//             </div>
//         </section>
//     );
// }
