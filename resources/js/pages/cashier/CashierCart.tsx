import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AppLayout from '@/layouts/cashier-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Truck, Package } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

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
  const filteredProducts = products.filter(product =>
    typeof product.name === 'string' &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function untuk update quantity di cart
  const updateCartQuantity = async (productId: number, action: 'increment' | 'decrement') => {
    setLoading(productId);

    try {
      await router.post('/cashier/cart/update', {
        product_id: productId,
        action: action,
      }, {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setLoading(null),
      });
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
      alert('Mohon masukkan alamat pengiriman');
      return;
    }

    // Validasi jika customerName atau contact diperlukan
    if (!customerName.trim() || !customerContact.trim()) {
      const confirmLanjut = confirm('Data pelanggan belum lengkap. Lanjutkan mengisi!');
      if (!confirmLanjut) return;
    }

    setIsProcessingCheckout(true);

    try {
      const response = await fetch('/cashier/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          shipping_option: shippingOption,
          payment_option: 'transfer',
          alamat: shippingOption === 'diantar' ? alamat : null,
          customer_name: customerName || null,
          customer_contact: customerContact || null,
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Checkout berhasil! Silakan lakukan pembayaran.');
        router.visit('/cashier/'); // Redirect ke halaman dashboard atau order
      } else {
        console.error('Response error:', data);
        alert(data.error || 'Gagal melakukan checkout');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Terjadi kesalahan saat checkout');
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
    const cartItem = cartItems.find(item => item.product_id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (showCheckout) {
    return (
      <AppLayout >
        {/* breadcrumbs={breadcrumbs}> */}
        <section id="buat-pesanan" className="mb-12">
          <Head title="Checkout | Sinar Pelangi" />

          <div className="container mx-auto py-8 px-4" id="CashierCart">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <h1 className="font-[Poppins] text-2xl font-bold text-[#1c283f] mb-6">
                    Checkout
                  </h1>
                  {/* Customer Info Section (optional / manual) */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#1c283f] mb-3">Data Pelanggan (Opsional)</h3>

                    <Label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                      Nama Pelanggan
                    </Label>
                    <Input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Masukkan nama pelanggan (opsional)"
                      className="w-full mt-1 mb-4"
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
                      className="w-full mt-1"
                    />
                  </div>

                  {/* Order Summary */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#1c283f] mb-3">Ringkasan Pesanan</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal ({cartItems.length} item)</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Ongkos Kirim</span>
                        <span>Gratis</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-[#56b280]">{formatPrice(subtotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#1c283f] mb-3">Metode Pembayaran</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[#56b280] rounded-full"></div>
                        <span>Transfer Bank</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Pembayaran melalui transfer bank. Detail rekening akan diberikan setelah checkout.
                      </p>
                    </div>
                  </div>

                  {/* Shipping Options */}
                  <div className="mb-6">
                    <Label className="font-semibold text-[#1c283f] mb-3 block">Pilih Cara Pengiriman</Label>
                    <RadioGroup value={shippingOption} onValueChange={setShippingOption}>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Package className="h-5 w-5 text-[#153e98]" />
                        <div className="flex-1">
                          <Label htmlFor="pickup" className="font-medium cursor-pointer">
                            Pickup di Toko
                          </Label>
                          <p className="text-sm text-gray-600">
                            Ambil pesanan langsung di toko kami
                          </p>
                        </div>
                        <span className="font-semibold text-[#56b280]">Gratis</span>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="diantar" id="delivery" />
                        <Truck className="h-5 w-5 text-[#153e98]" />
                        <div className="flex-1">
                          <Label htmlFor="delivery" className="font-medium cursor-pointer">
                            Diantar ke Alamat
                          </Label>
                          <p className="text-sm text-gray-600">
                            Pesanan akan diantar ke alamat Anda
                          </p>
                        </div>
                        <span className="font-semibold text-[#56b280]">Gratis</span>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Delivery Address */}
                  {shippingOption === 'diantar' && (
                    <div className="mb-6">
                      <Label htmlFor="alamat" className="font-semibold text-[#1c283f] mb-2 block">
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
                      className="flex-1 bg-[#153e98] hover:bg-[#0f2e73] text-white"
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
          <div className="max-w-full mx-auto px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">

              {/* Left Panel - Products */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Daftar Produk</h2>
                  <div className="w-80">
                    <input
                      type="text"
                      placeholder="Cari produk..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Products Grid */}
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => {
                      const quantityInCart = getProductQuantityInCart(product.id);
                      return (
                        <div
                          key={product.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          {/* Product Image */}
                          <div className="w-full h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                            {product.image ? (
                              <img
                                src={`/storage/${product.image}`}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <span className="text-gray-400 text-sm">No Image</span>
                            )}
                          </div>

                          {/* Product Info */}
                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-lg font-semibold text-blue-600 mb-2">
                            Rp {product.price.toLocaleString('id-ID')}
                          </p>
                          <p className="text-sm text-gray-500 mb-3">
                            Stok: {product.stock}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateCartQuantity(product.id, 'decrement')}
                                disabled={quantityInCart === 0 || loading === product.id}
                                className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-medium">
                                {loading === product.id ? '...' : quantityInCart}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(product.id, 'increment')}
                                disabled={quantityInCart >= product.stock || loading === product.id}
                                className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                              >
                                +
                              </button>
                            </div>

                            {quantityInCart > 0 && (
                              <button
                                onClick={() => removeFromCart(product.id)}
                                disabled={loading === product.id}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
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
                    <div className="text-center py-12">
                      <p className="text-gray-500">Tidak ada produk yang ditemukan</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Cart Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Ringkasan Pesanan</h2>
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto mb-6">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Keranjang belanja kosong</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
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
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      Rp {subtotal.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-blue-600">
                      Rp {total.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || loading === -1}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
};

// export default CashierCart;
