import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, CreditCard, DollarSign, Minus, Package, Plus, Receipt, ShoppingBag, ShoppingCart, Trash2, Truck } from 'lucide-react';
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
        stock: number;
        gambar_produk: string | null;
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
    const [paymentOption, setPaymentOption] = useState('transfer');
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
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        console.log(csrfToken);
        try {
            const response = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    shipping_option: 'pickup',
                    payment_option: 'transfer',
                    alamat: 'Jalan Kenangan kita selalu bergandeng tangan',
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
                    title: 'Checkout Gagal!',
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
                            <Link href="/products">
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
            <AppLayout>
                <section id="buat-pesanan" className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                    <Head title="Checkout | Sinar Pelangi" />

                    <div className="container mx-auto px-4 py-8" id="CashierCart">
                        <div className="mx-auto max-w-4xl">
                            {/* Header with Progress Indicator */}
                            <div className="mb-8 text-center">
                                <h1 className="mb-4 font-[Poppins] text-3xl font-bold text-[#1c283f]">Checkout Pesanan</h1>
                                <div className="flex items-center justify-center space-x-4">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                        <span className="ml-2 text-sm font-medium text-green-600">Keranjang</span>
                                    </div>
                                    <div className="h-1 w-12 bg-green-500"></div>
                                    <div className="flex items-center">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                                            <span className="text-xs font-bold">2</span>
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-blue-600">Checkout</span>
                                    </div>
                                    <div className="h-1 w-12 bg-gray-300"></div>
                                    <div className="flex items-center">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                                            <span className="text-xs font-bold">3</span>
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-gray-500">Selesai</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-8 lg:grid-cols-3">
                                {/* Main Checkout Form */}
                                <div className="lg:col-span-2">
                                    <Card className="rounded-xl bg-white shadow-lg">
                                        <CardContent className="p-8">
                                            {/* Customer Info Section */}
                                            {/* <div className="mb-8">
                                                <div className="mb-4 flex items-center">
                                                    <User className="mr-3 h-6 w-6 text-[#153e98]" />
                                                    <h3 className="text-xl font-semibold text-[#1c283f]">
                                                        Data Pelanggan
                                                    </h3>
                                                </div>
                                                <div className="rounded-lg bg-slate-50 p-6">
                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <div>
                                                            <Label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                                                                Nama Pelanggan
                                                            </Label>
                                                            <Input
                                                                id="customerName"
                                                                type="text"
                                                                value={customerName}
                                                                onChange={(e) => setCustomerName(e.target.value)}
                                                                placeholder="Masukkan nama pelanggan"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="customerContact" className="block text-sm font-medium text-gray-700 mb-2">
                                                                Kontak Pelanggan
                                                            </Label>
                                                            <Input
                                                                id="customerContact"
                                                                type="text"
                                                                value={customerContact}
                                                                onChange={(e) => setCustomerContact(e.target.value)}
                                                                placeholder="Nomor telepon atau email"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="mt-3 text-sm text-gray-600">
                                                        * Jika tidak diisi, akan menggunakan "Pelanggan Umum"
                                                    </p>
                                                </div>
                                            </div> */}

                                            {/* Payment Method */}
                                            <div className="mb-8">
                                                <div className="mb-4 flex items-center">
                                                    <CreditCard className="mr-3 h-6 w-6 text-[#153e98]" />
                                                    <h3 className="text-xl font-semibold text-[#1c283f]">Metode Pembayaran</h3>
                                                </div>
                                                <RadioGroup value={paymentOption} onValueChange={setPaymentOption}>
                                                    <div className="space-y-3">
                                                        {/* <div className="flex items-center space-x-3 rounded-lg border-2 border-gray-200 p-4 transition-colors hover:border-[#153e98] hover:bg-blue-50">
                                                            <RadioGroupItem value="tunai" id="tunai" />
                                                            <div className="flex items-center space-x-3 cursor-pointer">
                                                                <div className="rounded-full bg-green-100 p-2">
                                                                    <Package className="h-5 w-5 text-green-600" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <Label htmlFor="tunai" className="cursor-pointer text-lg font-medium">
                                                                        Pembayaran Tunai
                                                                    </Label>
                                                                    <p className="text-sm text-gray-600">Bayar langsung saat transaksi</p>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                        <div className="flex items-center space-x-3 rounded-lg border-2 border-gray-200 p-4 transition-colors hover:border-[#153e98] hover:bg-blue-50">
                                                            <RadioGroupItem value="transfer" id="transfer" />
                                                            <div className="flex cursor-pointer items-center space-x-3">
                                                                <div className="rounded-full bg-blue-100 p-2">
                                                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <Label htmlFor="transfer" className="cursor-pointer text-lg font-medium">
                                                                        Transfer Bank
                                                                    </Label>
                                                                    <p className="text-sm text-gray-600">
                                                                        Transfer ke rekening toko, konfirmasi manual
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            {/* Delivery Address */}
                                            {shippingOption === 'diantar' && (
                                                <div className="mb-8">
                                                    <Label htmlFor="alamat" className="mb-2 block text-lg font-semibold text-[#1c283f]">
                                                        Alamat Pengiriman *
                                                    </Label>
                                                    <Textarea
                                                        id="alamat"
                                                        value={alamat}
                                                        onChange={(e) => setAlamat(e.target.value)}
                                                        placeholder="Masukkan alamat lengkap untuk pengiriman..."
                                                        className="w-full"
                                                        rows={4}
                                                    />
                                                </div>
                                            )}

                                            {/* Transaction Type */}
                                            <div className="mb-8">
                                                <h3 className="mb-4 text-xl font-semibold text-[#1c283f]">Jenis Transaksi</h3>
                                                <div className="rounded-lg bg-gradient-to-r from-green-50 to-green-100 p-6">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="rounded-full bg-green-500 p-2">
                                                            <ShoppingCart className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <span className="text-lg font-bold text-green-800">Pembelian Online</span>
                                                            <p className="text-sm text-green-700">Silahkan checkout lalu konfirmasi pembayaran!</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Order Summary Sidebar */}
                                <div className="lg:col-span-1">
                                    <Card className="sticky top-4 rounded-xl bg-white shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="mb-6 flex items-center">
                                                <Receipt className="mr-3 h-6 w-6 text-[#153e98]" />
                                                <h3 className="text-xl font-semibold text-[#1c283f]">Ringkasan Pesanan</h3>
                                            </div>

                                            {/* Cart Items List */}
                                            <div className="mb-6 max-h-64 overflow-y-auto">
                                                <div className="space-y-3">
                                                    {cartItems.map((item) => (
                                                        <div key={item.id} className="flex items-start space-x-3 rounded-lg bg-gray-50 p-3">
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                                                                {item.product?.gambar_produk ? (
                                                                    <img
                                                                        src={`/storage/${item.product.gambar_produk}`}
                                                                        alt={item.product.nama_produk}
                                                                        className="h-full w-full rounded-lg object-cover"
                                                                    />
                                                                ) : (
                                                                    <Package className="h-6 w-6 text-gray-400" />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <h4 className="truncate text-sm font-medium text-gray-900">
                                                                    {item.product?.nama_produk ?? 'Produk tidak tersedia'}
                                                                </h4>
                                                                <div className="mt-1 flex items-center justify-between">
                                                                    <span className="text-xs text-gray-500">
                                                                        {formatPrice(item.product?.harga_jual || 0)} × {item.quantity}
                                                                    </span>
                                                                    <span className="text-sm font-semibold text-[#56b280]">
                                                                        {formatPrice((item.product?.harga_jual || 0) * item.quantity)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Price Summary */}
                                            <div className="space-y-3 border-t pt-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})
                                                    </span>
                                                    <span className="font-medium">{formatPrice(totalAmount)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Pajak & Biaya Admin</span>
                                                    <span className="font-medium text-green-600">Gratis</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                                                    <span className="text-gray-900">Total Pembayaran</span>
                                                    <span className="text-[#56b280]">{formatPrice(totalAmount)}</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-6 space-y-3">
                                                <Button
                                                    onClick={() => setShowCheckout(false)}
                                                    variant="outline"
                                                    className="w-full border-[#153e98] text-[#153e98] hover:bg-[#153e98] hover:text-white"
                                                    disabled={isProcessingCheckout}
                                                >
                                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                                    Kembali ke Keranjang
                                                </Button>
                                                <Button
                                                    onClick={processCheckout}
                                                    className="w-full bg-gradient-to-r from-[#153e98] to-[#1a4cb8] py-3 font-semibold text-white hover:from-[#0f2e73] hover:to-[#153e98]"
                                                    disabled={isProcessingCheckout}
                                                >
                                                    {isProcessingCheckout ? (
                                                        <div className="flex items-center">
                                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                            Memproses...
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Konfirmasi Pesanan
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
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
                                    {/* <div className="flex justify-between">
                                        <span className="text-gray-600">Ongkos Kirim</span>
                                        <span className="font-medium">Gratis</span>
                                    </div> */}
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
