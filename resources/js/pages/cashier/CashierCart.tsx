import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/cashier-layout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Package, Truck } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

// Interfaces
interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    image?: string;
    category?: string;
}

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    product: Product;
}

interface Props {
    products: Product[];
    cartItems: CartItem[];
    total: number;
    subtotal: number;
}

export default function CashierCart({ products, cartItems, total, subtotal }: Props) {
    // const CashierCart: React.FC<Props> = ({ products, cartItems, total, subtotal }) => {
    const [loading, setLoading] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCheckout, setShowCheckout] = useState(false);
    const [shippingOption, setShippingOption] = useState('pickup');
    const [alamat, setAlamat] = useState('');
    const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerContact, setCustomerContact] = useState('');

    // Filter products berdasarkan search term
    const filteredProducts = products.filter(
        (product) => typeof product.name === 'string' && product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Function untuk update quantity di cart
    const updateCartQuantity = async (productId: number, action: 'increment' | 'decrement') => {
        setLoading(productId);

        try {
            await router.post(
                '/cashier/cart/update',
                {
                    product_id: productId,
                    action: action,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => setLoading(null),
                },
            );
        } catch (error) {
            console.error('Error updating cart:', error);
            setLoading(null);
        }
    };

    // Function untuk hapus item dari cart
    const removeFromCart = async (productId: number) => {
        setLoading(productId);

        try {
            await router.delete(`/cashier/cart/remove/${productId}`, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setLoading(null),
            });
        } catch (error) {
            console.error('Error removing item:', error);
            setLoading(null);
        }
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };

    // const handleQuantityChange = (e, productId) => {
    //   const newQuantity = parseInt(e.target.value, 10);

    //   // Validasi supaya angka >= 0
    //   if (!isNaN(newQuantity) && newQuantity >= 0 && newQuantity <= product.stock) {
    //     // Panggil fungsi updateCartQuantity
    //     updateCartQuantity(productId, 'set', newQuantity);
    //   }
    // };

    // Function untuk checkout
    // const handleCheckout = async () => {
    //   if (cartItems.length === 0) {
    //     alert('Keranjang belanja kosong!');
    //     return;
    //   }

    //   setLoading(-1); // Loading state untuk checkout

    //   try {
    //     await router.post('/cashier/checkout', {}, {
    //       onSuccess: () => {
    //         alert('Checkout berhasil!');
    //       },
    //       onError: (errors) => {
    //         console.error('Checkout error:', errors);
    //         alert('Checkout gagal!');
    //       },
    //       onFinish: () => setLoading(null),
    //     });
    //   } catch (error) {
    //     console.error('Error during checkout:', error);
    //     setLoading(null);
    //   }
    // };

    const handleCheckout = () => {
        setShowCheckout(true);
    };

    const processCheckout = async () => {
        if (shippingOption === 'diantar' && !alamat.trim()) {
            await Swal.fire({
                icon: 'warning',
                title: 'Alamat diperlukan',
                text: 'Mohon masukkan alamat pengiriman',
            });
            return;
        }
        const name = customerName.trim() === '' ? 'Pelanggan Umum' : customerName;
        const contact = customerContact.trim() === '' ? 'Tidak ada kontak' : customerContact;

        // Validasi jika customerName atau contact diperlukan
        if (!name.trim() || !contact.trim()) {
            const result = await Swal.fire({
                icon: 'warning',
                title: 'Data pelanggan belum lengkap',
                text: 'Lanjutkan mengisi?',
                showCancelButton: true,
                confirmButtonText: 'Ya, lanjutkan',
                cancelButtonText: 'Tidak',
            });

            if (!result.isConfirmed) return;
        }

        setIsProcessingCheckout(true);

        try {
            const response = await fetch('/cashier/checkout', {
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
                    customer_name: name || null,
                    customer_contact: contact || null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Checkout berhasil!',
                    text: 'Silakan lakukan pembayaran.',
                });
                router.visit('/cashier/');
            } else {
                console.error('Response error:', data);
                await Swal.fire({
                    icon: 'error',
                    title: 'Checkout gagal',
                    text: data.error || 'Gagal melakukan checkout',
                });
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Kesalahan',
                text: 'Terjadi kesalahan saat checkout',
            });
        } finally {
            setIsProcessingCheckout(false);
        }
    };

    // Function untuk clear cart
    const clearCart = async () => {
        if (cartItems.length === 0) return;

        if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
            try {
                await router.delete('/cashier/cart/clear', {
                    preserveState: true,
                    preserveScroll: true,
                });
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        }
    };

    // Get quantity for specific product in cart
    const getProductQuantityInCart = (productId: number): number => {
        const cartItem = cartItems.find((item) => item.product_id === productId);
        return cartItem ? cartItem.quantity : 0;
    };

    if (showCheckout) {
        return (
            <AppLayout>
                {/* breadcrumbs={breadcrumbs}> */}
                <section id="buat-pesanan" className="mb-12">
                    <Head title="Checkout | Sinar Pelangi" />

                    <div className="container mx-auto px-4 py-8" id="CashierCart">
                        <div className="mx-auto max-w-2xl">
                            <Card className="rounded-2xl bg-white shadow-lg">
                                <CardContent className="p-6">
                                    <h1 className="mb-6 font-[Poppins] text-2xl font-bold text-[#1c283f]">Checkout</h1>
                                    {/* Customer Info Section (optional / manual) */}
                                    <div className="mb-6">
                                        <h3 className="mb-3 font-semibold text-[#1c283f]">Data Pelanggan (Opsional)</h3>

                                        <Label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                                            Nama Pelanggan
                                        </Label>
                                        <Input
                                            id="customerName"
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Masukkan nama pelanggan (opsional)"
                                            className="mt-1 mb-4 w-full"
                                        />

                                        <Label htmlFor="customerContact" className="block text-sm font-medium text-gray-700">
                                            Kontak Pelanggan
                                        </Label>
                                        <Input
                                            id="customerContact"
                                            type="text"
                                            value={customerContact}
                                            onChange={(e) => setCustomerContact(e.target.value)}
                                            placeholder="Masukkan nomor telepon atau email"
                                            className="mt-1 w-full"
                                        />
                                    </div>

                                    {/* Order Summary */}
                                    <div className="mb-6">
                                        <h3 className="mb-3 font-semibold text-[#1c283f]">Ringkasan Pesanan</h3>
                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <div className="mb-2 flex justify-between">
                                                <span>Subtotal ({cartItems.length} item)</span>
                                                <span>{formatPrice(subtotal)}</span>
                                            </div>
                                            <div className="mb-2 flex justify-between">
                                                <span>Ongkos Kirim</span>
                                                <span>Gratis</span>
                                            </div>
                                            <hr className="my-2" />
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Total</span>
                                                <span className="text-[#56b280]">{formatPrice(subtotal)}</span>
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
                </section>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Kasir - Toko ATK" />
            <section id="buat-pesanan" className="mb-12">
                <div className="min-h-screen bg-gray-100">
                    {/* Header */}
                    {/* <div className="bg-white shadow-sm border-b">
            <div className="max-w-full mx-auto px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">Kasir Toko ATK</h1>
            </div>
          </div> */}

                    {/* Main Content */}
                    <div className="mx-auto max-w-full px-6 py-6">
                        <div className="grid h-[calc(100vh-140px)] grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Left Panel - Products */}
                            <div className="flex flex-col overflow-hidden rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-800">Daftar Produk</h2>
                                    <div className="w-80">
                                        <input
                                            type="text"
                                            placeholder="Cari produk..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Products Grid */}
                                <div className="flex-1 overflow-y-auto">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {filteredProducts.map((product) => {
                                            const quantityInCart = getProductQuantityInCart(product.id);
                                            return (
                                                <div
                                                    key={product.id}
                                                    className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                                                >
                                                    {/* Product Image */}
                                                    <div className="mb-3 flex h-32 w-full items-center justify-center rounded-md bg-gray-100">
                                                        {product.image ? (
                                                            <img
                                                                src={`/storage/${product.image}`}
                                                                alt={product.name}
                                                                className="h-full w-full rounded-md object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-sm text-gray-400">No Image</span>
                                                        )}
                                                    </div>

                                                    {/* Product Info */}
                                                    <h3 className="mb-1 line-clamp-2 font-medium text-gray-900">{product.name}</h3>
                                                    <p className="mb-2 text-lg font-semibold text-blue-600">
                                                        Rp {product.price.toLocaleString('id-ID')}
                                                    </p>
                                                    <p className="mb-3 text-sm text-gray-500">Stok: {product.stock}</p>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => updateCartQuantity(product.id, 'decrement')}
                                                                disabled={quantityInCart === 0 || loading === product.id}
                                                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center font-medium">
                                                                {loading === product.id ? '...' : quantityInCart}
                                                            </span>
                                                            <button
                                                                onClick={() => updateCartQuantity(product.id, 'increment')}
                                                                disabled={quantityInCart >= product.stock || loading === product.id}
                                                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        {quantityInCart > 0 && (
                                                            <button
                                                                onClick={() => removeFromCart(product.id)}
                                                                disabled={loading === product.id}
                                                                className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-700"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {filteredProducts.length === 0 && (
                                        <div className="py-12 text-center">
                                            <p className="text-gray-500">Tidak ada produk yang ditemukan</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Panel - Cart Summary */}
                            <div className="flex flex-col overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-800">Ringkasan Pesanan</h2>
                                    {cartItems.length > 0 && (
                                        <button onClick={clearCart} className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-700">
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                {/* Cart Items */}
                                <div className="mb-6 flex-1 overflow-y-auto">
                                    {cartItems.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <p className="text-gray-500">Keranjang belanja kosong</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {cartItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-medium text-gray-900">
                                                            {item.product?.name ?? 'Nama produk tidak tersedia'}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">
                                                            {item.product?.price !== undefined
                                                                ? `Rp ${item.product.price.toLocaleString('id-ID')} x ${item.quantity}`
                                                                : 'Harga tidak tersedia'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">
                                                            {item.product?.price !== undefined
                                                                ? `Rp ${(item.product.price * item.quantity).toLocaleString('id-ID')}`
                                                                : 'Total tidak tersedia'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Cart Summary */}
                                <div className="space-y-3 border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-lg font-semibold">
                                        <span>Total:</span>
                                        <span className="text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
                                    </div>

                                    {/* Checkout Button */}
                                    <button
                                        onClick={handleCheckout}
                                        disabled={cartItems.length === 0 || loading === -1}
                                        className="w-full cursor-pointer rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                                    >
                                        {loading === -1 ? 'Processing...' : 'Checkout'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

// export default CashierCart;
