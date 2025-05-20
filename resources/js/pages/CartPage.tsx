// Updated Keranjang.tsx with interactive quantity and confirmation modal

import NavbarSection from '@/components/section/NavbarSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    image: string;
}

function Keranjang() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: 'Buku Tulis Campus Isi 10 / 36 Lembar',
            price: 120000,
            quantity: 10,
            stock: 232,
            image: 'images/buku_campus.jpeg',
        },
        {
            id: 2,
            name: 'Buku Tulis Campus Isi 10 / 36 Lembar',
            price: 120000,
            quantity: 10,
            stock: 232,
            image: 'images/buku_campus.jpeg',
        },
        {
            id: 3,
            name: 'Buku Tulis Campus Isi 10 / 36 Lembar',
            price: 120000,
            quantity: 10,
            stock: 232,
            image: 'images/buku_campus.jpeg',
        },
    ]);

    const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);

    const updateQuantity = (id: number, type: 'increase' | 'decrease') => {
        setCartItems((items) =>
            items.map((item) => {
                if (item.id === id) {
                    const newQty = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
                    return { ...item, quantity: Math.max(1, Math.min(newQty, item.stock)) };
                }
                return item;
            })
        );
    };

    const deleteItem = () => {
        if (itemToDelete) {
            setCartItems((items) => items.filter((item) => item.id !== itemToDelete.id));
            setItemToDelete(null);
        }
    };

    const totalOrder = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <main className="min-h-screen bg-[#f6f6f6] pb-8">
            <div className="container mx-auto max-w-7xl px-4">
                <NavbarSection />

                <header className="my-8">
                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Keranjang Belanja</h1>
                </header>

                <section className="hidden grid-cols-[3fr_1fr_1fr_auto] gap-4 rounded-md bg-gray-200 p-4 font-medium text-gray-600 sm:grid">
                    <div>Keterangan</div>
                    <div className="text-center">Kuantitas</div>
                    <div className="text-center">Total Harga</div>
                    <div className="text-center">Aksi</div>
                </section>

                <section className="space-y-4">
                    {cartItems.map((item) => (
                        <Card key={item.id} className="border-none shadow-sm">
                            <CardContent className="flex flex-col items-center gap-4 p-4 sm:grid sm:grid-cols-[3fr_1fr_1fr_auto] sm:items-start">
                                <div className="flex w-full items-center gap-4">
                                    <img src={item.image} alt={item.name} className="h-20 w-20 rounded object-cover sm:h-24 sm:w-24" />
                                    <div className="min-w-0">
                                        <h2 className="truncate text-base font-semibold text-gray-800 sm:text-lg">{item.name}</h2>
                                        <p className="text-sm font-medium text-red-600">Harga: Rp {item.price.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500">Stok: {item.stock}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2">
                                    <Button size="icon" className="bg-indigo-600 text-white" onClick={() => updateQuantity(item.id, 'decrease')}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="text-lg font-medium">{item.quantity}</span>
                                    <Button size="icon" className="bg-indigo-600 text-white" onClick={() => updateQuantity(item.id, 'increase')}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="text-center font-semibold text-red-600">
                                    Rp {(item.price * item.quantity).toLocaleString()}
                                </div>

                                <div className="flex justify-center sm:justify-end">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => setItemToDelete(item)}>
                                                <Trash2 className="h-6 w-6 text-red-500 hover:text-red-600" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Hapus Produk</DialogTitle>
                                            </DialogHeader>
                                            <p className="text-gray-600">Apakah kamu yakin ingin menghapus produk ini dari keranjang?</p>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setItemToDelete(null)}>
                                                    Batal
                                                </Button>
                                                <Button className="bg-red-600 text-white hover:bg-red-700" onClick={deleteItem}>
                                                    Hapus
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="mt-10 space-y-6 px-4 sm:px-0">
                    <div className="max-w-md">
                        <label htmlFor="shipping" className="mb-2 block text-sm font-medium text-gray-700">
                            Opsi Pengiriman:
                        </label>
                        <Select>
                            <SelectTrigger
                                id="shipping"
                                className="h-12 w-full rounded bg-white px-4 text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-500"
                            >
                                <SelectValue placeholder="Pilih Pengiriman" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pickup">Ambil Sendiri</SelectItem>
                                <SelectItem value="delivery">Diantar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="max-w-md">
                        <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">
                            Alamat:
                        </label>
                        <Input
                            id="address"
                            className="h-12 w-full rounded bg-white px-4 text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-500"
                            defaultValue="Jl. Iskandar Muda"
                            placeholder="Masukkan alamat lengkap"
                        />
                    </div>

                    <p className="ml-1 text-sm italic text-yellow-600">
                        * Biaya belum termasuk ongkir jika memilih pengantaran
                    </p>
                </section>

                <footer className="mt-10 flex flex-col-reverse items-center justify-between gap-4 px-4 sm:flex-row sm:px-0">
                    <h2 className="text-center text-lg font-semibold text-red-600 sm:text-left sm:text-xl">
                        Total Pesanan: <span className="font-bold">Rp {totalOrder.toLocaleString()}</span>
                    </h2>
                    <Button className="h-12 w-full rounded bg-green-600 text-base font-semibold text-white transition hover:bg-green-700 sm:w-52 sm:text-lg">
                        Checkout
                    </Button>
                </footer>
            </div>
        </main>
    );
}

export default Keranjang;
