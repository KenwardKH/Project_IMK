import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, CreditCard, DollarSign, Minus, Package, Plus, Receipt, ShoppingBag, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const bankOptions = [
    {
        value: 'bri',
        label: 'BRI',
        logo: '/images/bank/logo_bri.png',
        norek: '1234 5678 9012 3456',
        atasNama: 'Toko ATK Sinar Pelangi',
    },
    {
        value: 'mandiri',
        label: 'Mandiri',
        logo: '/images/bank/logo_mandiri.png',
        norek: '9876 5432 1098 7654',
        atasNama: 'Toko ATK Sinar Pelangi',
    },
    {
        value: 'bca',
        label: 'BCA',
        logo: '/images/bank/logo_bca.png',
        norek: '1111 2222 3333 4444',
        atasNama: 'Toko ATK Sinar Pelangi',
    },
    {
        value: 'dana',
        label: 'DANA',
        logo: '/images/bank/logo_dana.png',
        norek: '0812 3456 7890',
        atasNama: 'Toko ATK Sinar Pelangi',
    },
];

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
            role: string;
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
    const hasStockIssues = cartItems.some((item) => item.quantity > item.product.stock);
    const stockIssueCount = cartItems.filter((item) => item.quantity > item.product.stock).length;
    const [openModal, setOpenModal] = useState(false);

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
        const result = await Swal.fire({
            title: 'Yakin hapus item ini?',
            text: 'Item akan dihapus dari keranjang.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
        });

        if (!result.isConfirmed) return;

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
                await Swal.fire({
                    title: 'Berhasil!',
                    text: 'Item berhasil dihapus dari keranjang.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });
                router.reload();
            } else {
                Swal.fire('Gagal', data.error || 'Gagal menghapus item dari keranjang', 'error');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            Swal.fire('Kesalahan', 'Terjadi kesalahan saat menghapus item', 'error');
        } finally {
            setLoadingItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(cartId);
                return newSet;
            });
        }
    };

    const handleCheckout = async () => {
        // Check if cart is empty
        if (!cartItems || cartItems.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Keranjang Kosong',
                text: 'Keranjang belanja Anda kosong. Silakan tambahkan produk terlebih dahulu.',
            });
            return;
        }

        // Check stock for each item in cart
        const stockIssues = cartItems.filter((item) => item.quantity > item.product.stock);

        if (stockIssues.length > 0) {
            const itemNames = stockIssues
                .map((item) => `${item.product.nama_produk} (stok: ${item.product.stock}, diminta: ${item.quantity})`)
                .join('\n');

            await Swal.fire({
                icon: 'error',
                title: 'Stok Tidak Mencukupi',
                html: `
                <p>Produk berikut melebihi stok yang tersedia:</p>
                <div style="text-align: left; margin-top: 10px; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
                    ${stockIssues
                        .map(
                            (item) =>
                                `<div style="margin-bottom: 5px;">
                            <strong>${item.product.nama_produk}</strong><br>
                            <small>Stok tersedia: ${item.product.stock} | Jumlah diminta: ${item.quantity}</small>
                        </div>`,
                        )
                        .join('')}
                </div>
                <p style="margin-top: 10px;">Silakan sesuaikan jumlah produk di keranjang Anda.</p>
            `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#153e98',
            });
            return;
        }

        // If all checks pass, show checkout modal
        setShowCheckout(true);
    };

    const processCheckout = async () => {
        if (auth.user.role === 'blocked') {
            Swal.fire({
                icon: 'error',
                title: 'Akun Anda Diblokir',
                text: 'Akun Anda telah diblokir',
            });
            return;
        }
        if (shippingOption === 'diantar' && !alamat.trim()) {
            alert('Mohon masukkan alamat pengiriman');
            return;
        }

        const confirm = await Swal.fire({
            title: 'Konfimasi Checkout',
            text: 'Apakah pesanan Anda sudah benar? Pastikan semua item sudah sesuai.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Checkout',
            cancelButtonText: 'Batal',
        });

        if (!confirm.isConfirmed) {
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

    useEffect(() => {
        if (paymentOption === 'transfer') {
            setOpenModal(true);
        } else {
            setOpenModal(false);
        }
    }, [paymentOption]);

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

                                                <div className="mt-4 flex justify-end">
                                                    <Button
                                                        className="bg-gradient-to-r from-[#153e98] to-[#1a4cb8] py-3 font-semibold text-white hover:from-[#0f2e73] hover:to-[#153e98]"
                                                        onClick={() => setOpenModal(true)}
                                                    >
                                                        Lihat Metode Transfer
                                                    </Button>

                                                    <Dialog open={openModal} onOpenChange={setOpenModal}>
                                                        <DialogTrigger asChild />
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Metode Transfer</DialogTitle>
                                                                <DialogDescription>
                                                                    Berikut nomor rekening untuk metode transfer yang tersedia:
                                                                </DialogDescription>
                                                            </DialogHeader>

                                                            <div className="space-y-4">
                                                                {bankOptions.map((bank) => (
                                                                    <div
                                                                        key={bank.label}
                                                                        className="flex items-center space-x-4 rounded-lg border p-4 shadow-sm"
                                                                    >
                                                                        <img src={bank.logo} alt={bank.label} className="h-10 w-16 object-contain" />
                                                                        <div>
                                                                            <p className="text-base font-semibold">{bank.label}</p>
                                                                            <p className="text-sm text-gray-700">
                                                                                No. Rekening: <span className="font-medium">{bank.norek}</span>
                                                                            </p>
                                                                            <p className="text-sm text-gray-700">
                                                                                Atas nama: <span className="font-medium">{bank.atasNama}</span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
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
                                    {cartItems.map((item) => {
                                        const isStockInsufficient = item.quantity > item.product.stock;
                                        const stockDifference = item.quantity - item.product.stock;

                                        return (
                                            <div
                                                key={item.id}
                                                className={`rounded-lg border p-4 ${isStockInsufficient ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
                                            >
                                                <div className="flex items-center gap-4">
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
                                                        <p
                                                            className={`text-sm ${isStockInsufficient ? 'font-medium text-red-600' : 'text-gray-500'}`}
                                                        >
                                                            Stok: {item.product.stock} {item.product.satuan}
                                                            {isStockInsufficient && <span className="ml-2 text-red-600">(Tidak mencukupi!)</span>}
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
                                                            className={`w-16 text-center ${isStockInsufficient ? 'border-red-300 bg-red-50' : ''}`}
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

                                                {/* Stock Insufficient Notification */}
                                                {isStockInsufficient && (
                                                    <div className="mt-3 rounded-lg border border-red-200 bg-red-100 p-3">
                                                        <div className="flex items-start gap-2">
                                                            <div className="flex-shrink-0">
                                                                <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="text-sm font-medium text-red-800">Stok Tidak Mencukupi</h4>
                                                                <p className="mt-1 text-sm text-red-700">
                                                                    Anda meminta{' '}
                                                                    <strong>
                                                                        {item.quantity} {item.product.satuan}
                                                                    </strong>{' '}
                                                                    tetapi stok yang tersedia hanya{' '}
                                                                    <strong>
                                                                        {item.product.stock} {item.product.satuan}
                                                                    </strong>
                                                                    . Silakan kurangi jumlah sebanyak{' '}
                                                                    <strong>
                                                                        {stockDifference} {item.product.satuan}
                                                                    </strong>{' '}
                                                                    atau hapus item ini dari keranjang.
                                                                </p>
                                                                <div className="mt-2 flex gap-2">
                                                                    <button
                                                                        onClick={() => updateQuantity(item.id, item.product.stock)}
                                                                        className="rounded-md bg-red-600 px-3 py-1 text-xs text-white transition-colors hover:bg-red-700"
                                                                        disabled={loadingItems.has(item.id)}
                                                                    >
                                                                        Sesuaikan ke Stok ({item.product.stock})
                                                                    </button>
                                                                    <button
                                                                        onClick={() => removeItem(item.id)}
                                                                        className="rounded-md bg-gray-600 px-3 py-1 text-xs text-white transition-colors hover:bg-gray-700"
                                                                        disabled={loadingItems.has(item.id)}
                                                                    >
                                                                        Hapus Item
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8 rounded-2xl bg-white shadow-lg">
                            <CardContent className="p-6">
                                <h2 className="mb-4 font-[Poppins] text-xl font-bold text-[#1c283f]">Ringkasan Pesanan</h2>

                                {/* Stock Issues Warning */}
                                {hasStockIssues && (
                                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="h-5 w-5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <div>
                                                <h3 className="text-sm font-medium text-red-800">Masalah Stok Terdeteksi</h3>
                                                <p className="mt-1 text-sm text-red-700">
                                                    {stockIssueCount} produk melebihi stok yang tersedia. Silakan sesuaikan jumlah produk sebelum
                                                    checkout.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-6 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal ({cartItems.length} item)</span>
                                        <span className="font-medium">{formatPrice(totalAmount)}</span>
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
                                        className={`w-full rounded-lg py-3 font-bold text-white transition-colors ${
                                            hasStockIssues ? 'cursor-not-allowed bg-gray-400' : 'bg-[#153e98] hover:bg-[#0f2e73]'
                                        }`}
                                        disabled={hasStockIssues}
                                    >
                                        {hasStockIssues ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.366zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Checkout Tidak Tersedia
                                            </div>
                                        ) : (
                                            'Checkout'
                                        )}
                                    </Button>

                                    {hasStockIssues && (
                                        <p className="text-center text-xs text-red-600">
                                            Sesuaikan jumlah produk yang melebihi stok untuk melanjutkan checkout
                                        </p>
                                    )}

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
