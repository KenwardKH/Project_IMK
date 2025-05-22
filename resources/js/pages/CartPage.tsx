import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: {
        id: number;
        nama_produk: string;
        harga_jual: number;
        gambar_produk: string | null;
        stock: number;
        satuan: string;
    };
    subtotal: number;
}

interface CartProps {
    cartItems: CartItem[];
    totalAmount: number;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

export default function Cart({ cartItems, totalAmount, auth }: CartProps) {
    const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Beranda',
            href: '/',
        },
        {
            title: 'Keranjang Belanja',
            href: '/cart',
        },
    ];

    // Format price to Indonesian Rupiah
    const formatPrice = (price: number) => {
        return price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };

    const updateQuantity = async (cartId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        
        setLoadingItems(prev => new Set(prev).add(cartId));
        
        try {
            const response = await fetch(`/cart/${cartId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    quantity: newQuantity
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Reload the page to update cart data
                router.reload();
            } else {
                alert(data.error || 'Gagal mengupdate keranjang');
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            alert('Terjadi kesalahan saat mengupdate keranjang');
        } finally {
            setLoadingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(cartId);
                return newSet;
            });
        }
    };

    const removeItem = async (cartId: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus item ini dari keranjang?')) {
            return;
        }

        setLoadingItems(prev => new Set(prev).add(cartId));
        
        try {
            const response = await fetch(`/cart/${cartId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok) {
                // Reload the page to update cart data
                router.reload();
            } else {
                alert(data.error || 'Gagal menghapus item dari keranjang');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Terjadi kesalahan saat menghapus item');
        } finally {
            setLoadingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(cartId);
                return newSet;
            });
        }
    };

    const handleCheckout = () => {
        // Implement checkout functionality
        alert('Fitur checkout akan segera tersedia!');
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Keranjang Belanja | Sinar Pelangi" />
                
                <div className="container mx-auto py-8 px-4">
                    <Card className="bg-white rounded-2xl shadow-lg">
                        <CardContent className="p-8 text-center">
                            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h2 className="font-[Poppins] text-2xl font-bold text-[#1c283f] mb-2">
                                Keranjang Belanja Kosong
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Anda belum menambahkan produk apapun ke keranjang belanja.
                            </p>
                            <Link href="/">
                                <Button className="bg-[#153e98] hover:bg-[#0f2e73] text-white">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Mulai Belanja
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Keranjang Belanja | Sinar Pelangi" />
            
            <div className="container mx-auto py-8 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white rounded-2xl shadow-lg">
                            <CardContent className="p-6">
                                <h1 className="font-[Poppins] text-2xl font-bold text-[#1c283f] mb-6">
                                    Keranjang Belanja ({cartItems.length} item)
                                </h1>
                                
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                            {/* Product Image */}
                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {item.product.gambar_produk ? (
                                                    <img 
                                                        src={`/storage/${item.product.gambar_produk}`}
                                                        alt={item.product.nama_produk}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-gray-400 text-xs">No Image</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <h3 className="font-medium text-[#1c283f] mb-1">
                                                    {item.product.nama_produk}
                                                </h3>
                                                <p className="text-[#56b280] font-bold mb-2">
                                                    {formatPrice(item.product.harga_jual)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Stok: {item.product.stock} {item.product.satuan}
                                                </p>
                                            </div>
                                            
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={loadingItems.has(item.id) || item.quantity <= 1}
                                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                
                                                <span className="w-12 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={loadingItems.has(item.id) || item.quantity >= item.product.stock}
                                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            
                                            {/* Subtotal */}
                                            <div className="text-right">
                                                <p className="font-bold text-[#1c283f]">
                                                    {formatPrice(item.subtotal)}
                                                </p>
                                            </div>
                                            
                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                disabled={loadingItems.has(item.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Hapus item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="bg-white rounded-2xl shadow-lg sticky top-8">
                            <CardContent className="p-6">
                                <h2 className="font-[Poppins] text-xl font-bold text-[#1c283f] mb-4">
                                    Ringkasan Pesanan
                                </h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal ({cartItems.length} item)</span>
                                        <span className="font-medium">{formatPrice(totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ongkos Kirim</span>
                                        <span className="font-medium">Gratis</span>
                                    </div>
                                    <hr className="border-gray-200" />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span className="text-[#1c283f]">Total</span>
                                        <span className="text-[#56b280]">{formatPrice(totalAmount)}</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <Button 
                                        onClick={handleCheckout}
                                        className="w-full bg-[#153e98] hover:bg-[#0f2e73] text-white font-bold py-3 rounded-lg"
                                    >
                                        Checkout
                                    </Button>
                                    
                                    <Link href="/">
                                        <Button 
                                            variant="outline" 
                                            className="w-full border-[#153e98] text-[#153e98] hover:bg-[#153e98] hover:text-white"
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Lanjut Belanja
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}