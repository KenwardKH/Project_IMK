import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface ProductDetailProps {
    product: {
        id: number;
        nama_produk: string;
        deskripsi: string;
        satuan: string;
        stock: number;
        harga_jual: number;
        gambar_produk: string | null;
        riwayat_harga?: Array<{
            id: number;
            harga: number;
            tanggal: string;
        }>;
    };
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Beranda',
            href: '/',
        },
        {
            title: product.nama_produk,
            href: `/product/${product.id}`,
        },
    ];

    const handleIncrement = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        // Cart functionality would be implemented here
        alert(`Menambahkan ${quantity} ${product.nama_produk} ke keranjang`);
    };

    // Format price to Indonesian Rupiah
    const formatPrice = (price: number) => {
        return price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${product.nama_produk} | Sinar Pelangi`} />
            
            <div className="container mx-auto py-8 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
                        {product.gambar_produk ? (
                            <img 
                                src={`/storage/${product.gambar_produk}`}
                                alt={product.nama_produk} 
                                className="w-full h-[400px] object-cover"
                            />
                        ) : (
                            <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-lg">Tidak ada gambar</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Product Info */}
                    <Card className="bg-white rounded-2xl shadow-lg">
                        <CardContent className="p-6">
                            <h1 className="font-[Poppins] text-3xl font-bold text-[#1c283f] mb-2">
                                {product.nama_produk}
                            </h1>
                            
                            <div className="mb-6">
                                <p className="font-[Poppins] text-2xl font-bold text-[#56b280]">
                                    {formatPrice(product.harga_jual)}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Tersedia {product.stock} {product.satuan}
                                </p>
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="font-[Poppins] text-lg font-semibold text-[#1c283f] mb-2">
                                    Deskripsi
                                </h3>
                                <p className="text-gray-700">
                                    {product.deskripsi || "Tidak ada deskripsi tersedia."}
                                </p>
                            </div>
                            
                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <h3 className="font-[Poppins] text-lg font-semibold text-[#1c283f] mb-2">
                                    Jumlah
                                </h3>
                                <div className="flex items-center">
                                    <button 
                                        onClick={handleDecrement}
                                        disabled={quantity <= 1}
                                        className="bg-gray-100 px-4 py-2 rounded-l-lg text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                                    >
                                        -
                                    </button>
                                    <input 
                                        type="number" 
                                        value={quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value, 10);
                                            if (!isNaN(val) && val >= 1 && val <= product.stock) {
                                                setQuantity(val);
                                            }
                                        }}
                                        className="w-16 text-center py-2 border-t border-b border-gray-200"
                                        min="1"
                                        max={product.stock}
                                    />
                                    <button 
                                        onClick={handleIncrement}
                                        disabled={quantity >= product.stock}
                                        className="bg-gray-100 px-4 py-2 rounded-r-lg text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            
                            {/* Add to Cart Button */}
                            <Button 
                                onClick={handleAddToCart}
                                className="w-full bg-[#153e98] hover:bg-[#0f2e73] text-white font-bold py-3 rounded-lg"
                            >
                                Tambah ke Keranjang
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Price History */}
                {product.riwayat_harga && product.riwayat_harga.length > 0 && (
                    <Card className="mt-10 bg-white rounded-2xl shadow-lg">
                        <CardContent className="p-6">
                            <h2 className="font-[Poppins] text-2xl font-bold text-[#1c283f] mb-4">
                                Riwayat Harga
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="text-left p-3 border-b">Tanggal</th>
                                            <th className="text-left p-3 border-b">Harga</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {product.riwayat_harga.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="p-3 border-b">
                                                    {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="p-3 border-b">
                                                    {formatPrice(item.harga)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
                
                {/* Related Products (placeholder for future implementation) */}
                <div className="mt-10">
                    <h2 className="font-[Poppins] text-2xl font-bold text-[#1c283f] mb-4">
                        Produk Terkait
                    </h2>
                    <p className="text-gray-500">
                        Produk terkait akan ditampilkan di sini.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}