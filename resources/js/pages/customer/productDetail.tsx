import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
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
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

export default function ProductDetail({ product, auth }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleAddToCart = async () => {
        if (!auth.user) {
            // Redirect to login if not authenticated
            router.visit('/login', {
                data: {
                    intended: window.location.pathname,
                },
            });
            return;
        }

        setIsLoading(true);

        try {
            // Get CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            console.log('Adding to cart:', {
                product_id: product.id,
                quantity: quantity,
                csrf_token: csrfToken,
            });

            const response = await fetch('/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: quantity,
                }),
            });

            console.log('Response status:', response.status);

            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: `Berhasil menambahkan ${quantity} ${product.nama_produk} ke keranjang!`,
                }).then(() => {
                    // Arahkan ke halaman /produk setelah pengguna menekan tombol OK
                    window.location.href = '/products';
                });
            } else {
                console.error('Error response:', data);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: data.message || data.error || 'Terjadi kesalahan saat menambahkan ke keranjang',
                });
            }
        } catch (error) {
            console.error('Network error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Kesalahan Jaringan',
                text: 'Terjadi kesalahan jaringan saat menambahkan ke keranjang',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Alternative method using Inertia's router.post
    const handleAddToCartInertia = () => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        setIsLoading(true);

        router.post(
            '/cart',
            {
                product_id: product.id,
                quantity: quantity,
            },
            {
                onSuccess: () => {
                    alert(`Berhasil menambahkan ${quantity} ${product.nama_produk} ke keranjang!`);
                    setIsLoading(false);
                },
                onError: (errors) => {
                    console.error('Inertia errors:', errors);
                    alert('Terjadi kesalahan saat menambahkan ke keranjang');
                    setIsLoading(false);
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    // Format price to Indonesian Rupiah
    const formatPrice = (price: number) => {
        return price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${product.nama_produk} | Sinar Pelangi`} />

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Product Image */}
                    <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                        {product.gambar_produk ? (
                            <img src={`/storage/${product.gambar_produk}`} alt={product.nama_produk} className="h-[400px] w-full object-cover" />
                        ) : (
                            <div className="flex h-[400px] w-full items-center justify-center bg-gray-200">
                                <span className="text-lg text-gray-500">Tidak ada gambar</span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <Card className="rounded-2xl bg-white shadow-lg">
                        <CardContent className="p-6">
                            <h1 className="mb-2 font-[Poppins] text-3xl font-bold text-[#1c283f]">{product.nama_produk}</h1>

                            <div className="mb-6">
                                <p className="text-price font-[Poppins] text-2xl font-bold">{formatPrice(product.harga_jual)}</p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Tersedia {product.stock} {product.satuan}
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="mb-2 font-[Poppins] text-lg font-semibold text-[#1c283f]">Deskripsi</h3>
                                <p className="text-gray-700">{product.deskripsi || 'Tidak ada deskripsi tersedia.'}</p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <h3 className="mb-2 font-[Poppins] text-lg font-semibold text-[#1c283f]">Jumlah</h3>
                                <div className="flex items-center">
                                    <button
                                        onClick={handleDecrement}
                                        disabled={quantity <= 1}
                                        className="rounded-l-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
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
                                        className="w-16 border-t border-b border-gray-200 py-2 text-center focus:ring-2 focus:ring-[#56b280] focus:outline-none"
                                        min="1"
                                        max={product.stock}
                                    />
                                    <button
                                        onClick={handleIncrement}
                                        disabled={quantity >= product.stock}
                                        className="rounded-r-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Stock Alert */}
                            {product.stock === 0 ? (
                                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3">
                                    <p className="font-medium text-red-600">Stok habis</p>
                                </div>
                            ) : product.stock < 10 ? (
                                <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                    <p className="font-medium text-yellow-600">
                                        Stok terbatas: {product.stock} {product.satuan}
                                    </p>
                                </div>
                            ) : null}

                            {/* Add to Cart Buttons */}
                            <div className="space-y-2">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={isLoading || product.stock === 0}
                                    className="w-full rounded-lg bg-[#153e98] py-3 font-bold text-white hover:bg-[#0f2e73] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                            Menambahkan...
                                        </div>
                                    ) : product.stock === 0 ? (
                                        'Stok Habis'
                                    ) : auth.user ? (
                                        'Tambah ke Keranjang'
                                    ) : (
                                        'Login untuk Membeli'
                                    )}
                                </Button>
                            </div>

                            {/* Total Price Display */}
                            {quantity > 1 && (
                                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                                    <p className="text-green-800">
                                        <span className="font-medium">Total: </span>
                                        {formatPrice(product.harga_jual * quantity)}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Price History */}
                {product.riwayat_harga && product.riwayat_harga.length > 0 && (
                    <Card className="mt-10 rounded-2xl bg-white shadow-lg">
                        <CardContent className="p-6">
                            <h2 className="mb-4 font-[Poppins] text-2xl font-bold text-[#1c283f]">Riwayat Harga</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border-b p-3 text-left">Tanggal</th>
                                            <th className="border-b p-3 text-left">Harga</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {product.riwayat_harga.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="border-b p-3">
                                                    {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </td>
                                                <td className="border-b p-3">{formatPrice(item.harga)}</td>
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
                    <h2 className="mb-4 font-[Poppins] text-2xl font-bold text-[#1c283f]">Produk Terkait</h2>
                    <p className="text-gray-500">Produk terkait akan ditampilkan di sini.</p>
                </div>
            </div>
        </AppLayout>
    );
}
