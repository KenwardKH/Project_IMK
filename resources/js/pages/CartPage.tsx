import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Minus, Package, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

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
    const [showCheckout, setShowCheckout] = useState(false);
    const [shippingOption, setShippingOption] = useState('pickup');
    const [alamat, setAlamat] = useState('');
    const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
    const [quantityInputs, setQuantityInputs] = useState<{ [key: number]: string }>({});

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

        setLoadingItems((prev) => new Set(prev).add(cartId));

        try {
            const response = await fetch(`/cart/${cartId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    quantity: newQuantity,
                }),
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
            setLoadingItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(cartId);
                return newSet;
            });
        }
    };

    const handleQuantityInputChange = (cartId: number, value: string) => {
        setQuantityInputs({ ...quantityInputs, [cartId]: value });
    };

    const handleQuantityInputBlur = (cartId: number, item: CartItem) => {
        const inputValue = quantityInputs[cartId];
        if (inputValue !== undefined) {
            const newQuantity = parseInt(inputValue);
            if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= item.product.stock && newQuantity !== item.quantity) {
                updateQuantity(cartId, newQuantity);
            }
            // Clear the input state
            const newInputs = { ...quantityInputs };
            delete newInputs[cartId];
            setQuantityInputs(newInputs);
        }
    };

    const handleQuantityInputKeyPress = (e: React.KeyboardEvent, cartId: number, item: CartItem) => {
        if (e.key === 'Enter') {
            handleQuantityInputBlur(cartId, item);
        }
    };

    const removeItem = async (cartId: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus item ini dari keranjang?')) {
            return;
        }

        setLoadingItems((prev) => new Set(prev).add(cartId));

        try {
            const response = await fetch(`/cart/${cartId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
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
            setLoadingItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(cartId);
                return newSet;
            });
        }
    };

    const handleCheckout = () => {
        setShowCheckout(true);
    };

    const processCheckout = async () => {
        if (shippingOption === 'diantar' && !alamat.trim()) {
            alert('Mohon masukkan alamat pengiriman');
            return;
        }

        setIsProcessingCheckout(true);

        try {
            const response = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    shipping_option: shippingOption,
                    payment_option: 'transfer',
                    alamat: shippingOption === 'diantar' ? alamat : null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Checkout Berhasil!',
                    text: 'Silakan lakukan pembayaran.',
                }).then(() => {
                    router.visit('/order/belum-bayar'); // Redirect ke halaman pesanan
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Checkout Gagal',
                    text: data.error || 'Gagal melakukan checkout',
                });
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Terjadi kesalahan saat checkout');
        } finally {
            setIsProcessingCheckout(false);
        }
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Keranjang Belanja | Sinar Pelangi" />

                <div className="container mx-auto px-4 py-8">
                    <Card className="rounded-2xl bg-white shadow-lg">
                        <CardContent className="p-8 text-center">
                            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                            <h2 className="mb-2 font-[Poppins] text-2xl font-bold text-[#1c283f]">Keranjang Belanja Kosong</h2>
                            <p className="mb-6 text-gray-600">Anda belum menambahkan produk apapun ke keranjang belanja.</p>
                            <Link href="/">
                                <Button className="bg-[#153e98] text-white hover:bg-[#0f2e73]">
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

    if (showCheckout) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Checkout | Sinar Pelangi" />

                <div className="container mx-auto px-4 py-8">
                    <div className="mx-auto max-w-2xl">
                        <Card className="rounded-2xl bg-white shadow-lg">
                            <CardContent className="p-6">
                                <h1 className="mb-6 font-[Poppins] text-2xl font-bold text-[#1c283f]">Checkout</h1>

                                {/* Order Summary */}
                                <div className="mb-6">
                                    <h3 className="mb-3 font-semibold text-[#1c283f]">Ringkasan Pesanan</h3>
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <div className="mb-2 flex justify-between">
                                            <span>Subtotal ({cartItems.length} item)</span>
                                            <span>{formatPrice(totalAmount)}</span>
                                        </div>
                                        <div className="mb-2 flex justify-between">
                                            <span>Ongkos Kirim</span>
                                            <span>Gratis</span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-[#56b280]">{formatPrice(totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="mb-6">
                                    <h3 className="mb-3 font-semibold text-[#1c283f]">Metode Pembayaran</h3>
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="h-3 w-3 rounded-full bg-[#56b280]"></div>
                                            <span>Transfer Bank</span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600">
                                            Pembayaran melalui transfer bank. Detail rekening akan diberikan setelah checkout.
                                        </p>
                                    </div>
                                </div>

                                {/* Shipping Options */}
                                <div className="mb-6">
                                    <Label className="mb-3 block font-semibold text-[#1c283f]">Pilih Cara Pengiriman</Label>
                                    <RadioGroup value={shippingOption} onValueChange={setShippingOption}>
                                        <div className="flex items-center space-x-2 rounded-lg border p-3">
                                            <RadioGroupItem value="pickup" id="pickup" />
                                            <Package className="h-5 w-5 text-[#153e98]" />
                                            <div className="flex-1">
                                                <Label htmlFor="pickup" className="cursor-pointer font-medium">
                                                    Pickup di Toko
                                                </Label>
                                                <p className="text-sm text-gray-600">Ambil pesanan langsung di toko kami</p>
                                            </div>
                                            <span className="font-semibold text-[#56b280]">Gratis</span>
                                        </div>
                                        <div className="flex items-center space-x-2 rounded-lg border p-3">
                                            <RadioGroupItem value="diantar" id="delivery" />
                                            <Truck className="h-5 w-5 text-[#153e98]" />
                                            <div className="flex-1">
                                                <Label htmlFor="delivery" className="cursor-pointer font-medium">
                                                    Diantar ke Alamat
                                                </Label>
                                                <p className="text-sm text-gray-600">Pesanan akan diantar ke alamat Anda</p>
                                            </div>
                                            <span className="font-semibold text-[#56b280]">Gratis</span>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Delivery Address */}
                                {shippingOption === 'diantar' && (
                                    <div className="mb-6">
                                        <Label htmlFor="alamat" className="mb-2 block font-semibold text-[#1c283f]">
                                            Alamat Pengiriman *
                                        </Label>
                                        <Textarea
                                            id="alamat"
                                            value={alamat}
                                            onChange={(e) => setAlamat(e.target.value)}
                                            placeholder="Masukkan alamat lengkap untuk pengiriman..."
                                            className="w-full"
                                            rows={3}
                                        />
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <Button
                                        onClick={() => setShowCheckout(false)}
                                        variant="outline"
                                        className="flex-1 border-[#153e98] text-[#153e98] hover:bg-[#153e98] hover:text-white"
                                        disabled={isProcessingCheckout}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Kembali
                                    </Button>
                                    <Button
                                        onClick={processCheckout}
                                        className="flex-1 bg-[#153e98] text-white hover:bg-[#0f2e73]"
                                        disabled={isProcessingCheckout}
                                    >
                                        {isProcessingCheckout ? 'Memproses...' : 'Konfirmasi Pesanan'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Keranjang Belanja | Sinar Pelangi" />

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <Card className="rounded-2xl bg-white shadow-lg">
                            <CardContent className="p-6">
                                <h1 className="mb-6 font-[Poppins] text-2xl font-bold text-[#1c283f]">Keranjang Belanja ({cartItems.length} item)</h1>

                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
                                            {/* Product Image */}
                                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                {item.product.gambar_produk ? (
                                                    <img
                                                        src={`/storage/${item.product.gambar_produk}`}
                                                        alt={item.product.nama_produk}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <span className="text-xs text-gray-400">No Image</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <h3 className="mb-1 font-medium text-[#1c283f]">{item.product.nama_produk}</h3>
                                                <p className="mb-2 font-bold text-[#56b280]">{formatPrice(item.product.harga_jual)}</p>
                                                <p className="text-sm text-gray-500">
                                                    Stok: {item.product.stock} {item.product.satuan}
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={loadingItems.has(item.id) || item.quantity <= 1}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>

                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max={item.product.stock}
                                                    value={quantityInputs[item.id] !== undefined ? quantityInputs[item.id] : item.quantity}
                                                    onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                                                    onBlur={() => handleQuantityInputBlur(item.id, item)}
                                                    onKeyPress={(e) => handleQuantityInputKeyPress(e, item.id, item)}
                                                    className="w-16 text-center"
                                                    disabled={loadingItems.has(item.id)}
                                                />

                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={loadingItems.has(item.id) || item.quantity >= item.product.stock}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="text-right">
                                                <p className="font-bold text-[#1c283f]">{formatPrice(item.subtotal)}</p>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                disabled={loadingItems.has(item.id)}
                                                className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                        <Card className="sticky top-8 rounded-2xl bg-white shadow-lg">
                            <CardContent className="p-6">
                                <h2 className="mb-4 font-[Poppins] text-xl font-bold text-[#1c283f]">Ringkasan Pesanan</h2>

                                <div className="mb-6 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal ({cartItems.length} item)</span>
                                        <span className="font-medium">{formatPrice(totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ongkos Kirim</span>
                                        <span className="font-medium">Gratis</span>
                                    </div>
                                    <hr className="border-gray-200" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-[#1c283f]">Total</span>
                                        <span className="text-[#56b280]">{formatPrice(totalAmount)}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={handleCheckout}
                                        className="w-full rounded-lg bg-[#153e98] py-3 font-bold text-white hover:bg-[#0f2e73]"
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
