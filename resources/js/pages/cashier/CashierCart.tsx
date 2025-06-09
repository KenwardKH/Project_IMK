import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/cashier-layout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Banknote, CheckCircle, CreditCard, DollarSign, Package, Receipt, ShoppingCart, User } from 'lucide-react';
import { useEffect, useState } from 'react';
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
    const [loading, setLoading] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCheckout, setShowCheckout] = useState(false);
    const [shippingOption, setShippingOption] = useState('pickup');
    const [paymentOption, setPaymentOption] = useState('tunai');
    const [alamat, setAlamat] = useState('');
    const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerContact, setCustomerContact] = useState('');

    // State untuk local cart quantities (tidak langsung sync ke backend)
    const [localQuantities, setLocalQuantities] = useState<{ [key: number]: number }>({});

    // Initialize local quantities dari cart items
    useEffect(() => {
        const initialQuantities: { [key: number]: number } = {};
        cartItems.forEach((item) => {
            initialQuantities[item.product_id] = item.quantity;
        });
        setLocalQuantities(initialQuantities);
    }, [cartItems]);


    // Filter products berdasarkan search term
    const filteredProducts = products.filter(
        (product) => typeof product.name === 'string' && product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Function untuk update local quantity (tidak ke backend)
    const updateLocalQuantity = (productId: number, newQuantity: number, maxStock: number) => {
        // Validasi quantity
        if (newQuantity < 0) newQuantity = 0;
        if (newQuantity > maxStock) newQuantity = maxStock;

        setLocalQuantities((prev) => ({
            ...prev,
            [productId]: newQuantity,
        }));
    };

    // Function untuk increment local quantity
    const incrementQuantity = (productId: number, maxStock: number) => {
        const currentQty = localQuantities[productId] || 0;
        if (currentQty < maxStock) {
            updateLocalQuantity(productId, currentQty + 1, maxStock);
        }
    };

    // Function untuk decrement local quantity
    const decrementQuantity = (productId: number, maxStock: number) => {
        const currentQty = localQuantities[productId] || 0;
        if (currentQty > 0) {
            updateLocalQuantity(productId, currentQty - 1, maxStock);
        }
    };

    // Function untuk handle input change quantity
    const handleQuantityInputChange = (productId: number, value: string, maxStock: number) => {
        const numValue = parseInt(value) || 0;
        updateLocalQuantity(productId, numValue, maxStock);
    };

    // Function untuk remove dari local cart
    const removeFromLocalCart = (productId: number) => {
        setLocalQuantities((prev) => ({
            ...prev,
            [productId]: 0,
        }));
    };

    // Function untuk hapus item dari cart (langsung ke backend)
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

    // Function untuk sync local quantities ke backend saat checkout
    const syncCartToBackend = async () => {
        const updates: Array<{ product_id: number; quantity: number }> = [];

        // Bandingkan local quantities dengan cart items
        Object.keys(localQuantities).forEach((productIdStr) => {
            const productId = parseInt(productIdStr);
            const localQty = localQuantities[productId];
            const cartItem = cartItems.find((item) => item.product_id === productId);
            const currentQty = cartItem ? cartItem.quantity : 0;

            // Jika quantity berbeda, tambahkan ke updates
            if (localQty !== currentQty) {
                updates.push({
                    product_id: productId,
                    quantity: localQty,
                });
            }
        });

        // Kirim batch updates ke backend
        if (updates.length > 0) {
            try {
                await fetch('/cashier/cart/batch-update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ updates }),
                });
            } catch (error) {
                console.error('Error syncing cart:', error);
                throw error;
            }
        }
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };

    // Function untuk checkout
    const handleCheckout = () => {
        setShowCheckout(true);
    };

    // Calculate local totals berdasarkan local quantities
    const calculateLocalTotals = () => {
        let localSubtotal = 0;

        Object.keys(localQuantities).forEach((productIdStr) => {
            const productId = parseInt(productIdStr);
            const quantity = localQuantities[productId];

            if (quantity > 0) {
                const product = products.find((p) => p.id === productId);
                if (product) {
                    localSubtotal += product.price * quantity;
                }
            }
        });

        return {
            subtotal: localSubtotal,
            total: localSubtotal, // Bisa ditambah pajak/ongkir jika ada
        };
    };

    const { subtotal: localSubtotal, total: localTotal } = calculateLocalTotals();

    // Get local cart items untuk display
    const getLocalCartItems = () => {
        const localItems: Array<{ id: number; product: Product; quantity: number }> = [];

        Object.keys(localQuantities).forEach((productIdStr) => {
            const productId = parseInt(productIdStr);
            const quantity = localQuantities[productId];

            if (quantity > 0) {
                const product = products.find((p) => p.id === productId);
                if (product) {
                    localItems.push({
                        id: productId,
                        product,
                        quantity,
                    });
                }
            }
        });

        return localItems;
    };

    const localCartItems = getLocalCartItems();

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
        const confirmResult = await Swal.fire({
            icon: 'question',
            title: 'Konfirmasi Pesanan',
            text: 'Apakah pesanan Anda sudah benar? Pastikan semua item sudah sesuai.',
            showCancelButton: true,
            confirmButtonText: 'Ya, Checkout',
            cancelButtonText: 'Batal',
        });
        if (!confirmResult.isConfirmed) return;
        setIsProcessingCheckout(true);

        try {
            // Sync local quantities ke backend terlebih dahulu
            await syncCartToBackend();

            const response = await fetch('/cashier/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    shipping_option: shippingOption,
                    payment_option: paymentOption,
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

    // Function untuk clear local cart
    const clearLocalCart = () => {
        if (localCartItems.length === 0) return;

        if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
            setLocalQuantities({});
        }
    };

    // Get quantity for specific product
    const getProductQuantity = (productId: number): number => {
        return localQuantities[productId] || 0;
    };

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
                                            <div className="mb-8">
                                                <div className="mb-4 flex items-center">
                                                    <User className="mr-3 h-6 w-6 text-[#153e98]" />
                                                    <h3 className="text-xl font-semibold text-[#1c283f]">Data Pelanggan</h3>
                                                </div>
                                                <div className="rounded-lg bg-slate-50 p-6">
                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <div>
                                                            <Label htmlFor="customerName" className="mb-2 block text-sm font-medium text-gray-700">
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
                                                            <Label htmlFor="customerContact" className="mb-2 block text-sm font-medium text-gray-700">
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
                                            </div>

                                            {/* Payment Method */}
                                            <div className="mb-8">
                                                <div className="mb-4 flex items-center">
                                                    <CreditCard className="mr-3 h-6 w-6 text-[#153e98]" />
                                                    <h3 className="text-xl font-semibold text-[#1c283f]">Metode Pembayaran</h3>
                                                </div>
                                                <RadioGroup value={paymentOption} onValueChange={setPaymentOption}>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center space-x-3 rounded-lg border-2 border-gray-200 p-4 transition-colors hover:border-[#153e98] hover:bg-blue-50">
                                                            <RadioGroupItem value="tunai" id="tunai" />
                                                            <div className="flex cursor-pointer items-center space-x-3">
                                                                <div className="rounded-full bg-green-100 p-2">
                                                                    <Banknote className="h-5 w-5 text-green-600" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <Label htmlFor="tunai" className="cursor-pointer text-lg font-medium">
                                                                        Pembayaran Tunai
                                                                    </Label>
                                                                    <p className="text-sm text-gray-600">Bayar langsung saat transaksi</p>
                                                                </div>
                                                            </div>
                                                        </div>
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
                                                            <span className="text-lg font-bold text-green-800">Pembelian Offline</span>
                                                            <p className="text-sm text-green-700">Transaksi langsung di toko</p>
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
                                                    {localCartItems.map((item) => (
                                                        <div key={item.id} className="flex items-start space-x-3 rounded-lg bg-gray-50 p-3">
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                                                                {item.product?.image ? (
                                                                    <img
                                                                        src={`/storage/${item.product.image}`}
                                                                        alt={item.product.name}
                                                                        className="h-full w-full rounded-lg object-cover"
                                                                    />
                                                                ) : (
                                                                    <Package className="h-6 w-6 text-gray-400" />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <h4 className="truncate text-sm font-medium text-gray-900">
                                                                    {item.product?.name ?? 'Produk tidak tersedia'}
                                                                </h4>
                                                                <div className="mt-1 flex items-center justify-between">
                                                                    <span className="text-xs text-gray-500">
                                                                        {formatPrice(item.product?.price || 0)} × {item.quantity}
                                                                    </span>
                                                                    <span className="text-sm font-semibold text-[#56b280]">
                                                                        {formatPrice((item.product?.price || 0) * item.quantity)}
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
                                                        Subtotal ({localCartItems.length} item{localCartItems.length > 1 ? 's' : ''})
                                                    </span>
                                                    <span className="font-medium">{formatPrice(localSubtotal)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Pajak & Biaya Admin</span>
                                                    <span className="font-medium text-green-600">Gratis</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                                                    <span className="text-gray-900">Total Pembayaran</span>
                                                    <span className="text-[#56b280]">{formatPrice(localTotal)}</span>
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
        <AppLayout>
            <Head title="Kasir - Toko ATK" />
            <section id="buat-pesanan" className="mb-12">
                <div className="min-h-screen bg-gray-100">
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
                                            const quantityInCart = getProductQuantity(product.id);
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

                                                    {/* Quantity Controls - IMPROVED */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => decrementQuantity(product.id, product.stock)}
                                                                disabled={quantityInCart === 0}
                                                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                                                            >
                                                                -
                                                            </button>

                                                            {/* Input Number untuk quantity */}
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={product.stock}
                                                                value={quantityInCart}
                                                                onChange={(e) => handleQuantityInputChange(product.id, e.target.value, product.stock)}
                                                                className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                            />

                                                            <button
                                                                onClick={() => incrementQuantity(product.id, product.stock)}
                                                                disabled={quantityInCart >= product.stock}
                                                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        {quantityInCart > 0 && (
                                                            <button
                                                                onClick={() => removeFromLocalCart(product.id)}
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
                                    {localCartItems.length > 0 && (
                                        <button
                                            onClick={clearLocalCart}
                                            className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-700"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                {/* Cart Items */}
                                <div className="mb-6 flex-1 overflow-y-auto">
                                    {localCartItems.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <p className="text-gray-500">Keranjang belanja kosong</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {localCartItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-medium text-gray-900">{item.product.name}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            Rp {item.product.price.toLocaleString('id-ID')} x {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">
                                                            Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
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
                                        <span className="font-medium">Rp {localSubtotal.toLocaleString('id-ID')}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-lg font-semibold">
                                        <span>Total:</span>
                                        <span className="text-blue-600">Rp {localTotal.toLocaleString('id-ID')}</span>
                                    </div>

                                    {/* Checkout Button */}
                                    <button
                                        onClick={handleCheckout}
                                        disabled={localCartItems.length === 0 || isProcessingCheckout}
                                        className="w-full cursor-pointer rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                                    >
                                        {isProcessingCheckout ? 'Processing...' : 'Checkout'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Modal/Form - tambahkan logic sesuai kebutuhan */}
                    {showCheckout && (
                        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                            <div className="w-full max-w-md rounded-lg bg-white p-6">
                                <h3 className="mb-4 text-lg font-semibold">Checkout</h3>

                                {/* Customer Info */}
                                <div className="mb-4">
                                    <Label>Nama Pelanggan</Label>
                                    <Input
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Masukkan nama pelanggan"
                                    />
                                </div>

                                <div className="mb-4">
                                    <Label>Kontak Pelanggan</Label>
                                    <Input
                                        value={customerContact}
                                        onChange={(e) => setCustomerContact(e.target.value)}
                                        placeholder="Nomor HP/Email"
                                    />
                                </div>

                                {/* Shipping Options */}
                                <div className="mb-4">
                                    <Label>Opsi Pengiriman</Label>
                                    <RadioGroup value={shippingOption} onValueChange={setShippingOption}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="pickup" id="pickup" />
                                            <Label htmlFor="pickup">Ambil di Toko</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="diantar" id="diantar" />
                                            <Label htmlFor="diantar">Diantar</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {shippingOption === 'diantar' && (
                                    <div className="mb-4">
                                        <Label>Alamat Pengiriman</Label>
                                        <Textarea value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Masukkan alamat lengkap" />
                                    </div>
                                )}

                                {/* Payment Options */}
                                <div className="mb-4">
                                    <Label>Metode Pembayaran</Label>
                                    <RadioGroup value={paymentOption} onValueChange={setPaymentOption}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="tunai" id="tunai" />
                                            <Label htmlFor="tunai">Tunai</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="transfer" id="transfer" />
                                            <Label htmlFor="transfer">Transfer</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="flex space-x-2">
                                    <Button variant="outline" onClick={() => setShowCheckout(false)} className="flex-1">
                                        Batal
                                    </Button>
                                    <Button onClick={processCheckout} disabled={isProcessingCheckout} className="flex-1">
                                        {isProcessingCheckout ? 'Processing...' : 'Proses Checkout'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </AppLayout>
    );
}
