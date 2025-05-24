import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import OrderDetailModal from './OrderDetailModal';
import PaymentModal from './PaymentModal';

export default function OrderSummarySection() {
    const [showModal, setShowModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const { url } = usePage();
    const currentPath = url.split('?')[0];

    const products = [
        {
            id: 1,
            name: 'Buku Tulis Campus Isi 10 / 36 Lembar',
            quantity: 10,
            price: 'Rp 120.000',
            image: '/images/buku_campus.jpeg',
        },
    ];

    return (
        <>
            <section className="mx-auto w-full max-w-4xl p-2 sm:p-8">
                <Card className="rounded-xl border border-gray-200 shadow-sm">
                    <CardContent className="p-4 sm:p-10">
                        <header className="mb-4 flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-700">
                                Opsi Pengantaran:
                                <span className="ml-2 font-normal text-gray-600">Ambil Sendiri</span>
                            </p>
                            {currentPath === '/order/selesai' || currentPath === '/order/dibatalkan' ? (
                                <Button
                                    className="h-8 rounded-md bg-blue-500 px-4 text-xs font-medium text-white hover:bg-blue-600"
                                    onClick={() => {
                                        window.open('/invoice/cetak', '_blank');
                                    }}
                                >
                                    Cetak Invoice
                                </Button>
                            ) : null}
                        </header>

                        <Separator className="my-4 h-px bg-gray-200 sm:my-6" />

                        <div className="space-y-6">
                            {products.map((product) => (
                                <article key={product.id} className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="h-40 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:w-40">
                                        <img
                                            src={product.image || 'https://via.placeholder.com/150'}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between">
                                        <h3 className="text-base font-semibold text-gray-800">{product.name}</h3>
                                        <div className="mt-2 flex justify-between sm:mt-6">
                                            <p className="text-sm text-gray-500">x{product.quantity}</p>
                                            <p className="text-price-lighter text-base font-bold">{product.price}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <section className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6 font-sans shadow-sm">
                            <div className="mb-6 text-right">
                                <p className="text-xl font-semibold text-gray-800 sm:text-2xl">
                                    Total Pesanan: <span className="text-price font-bold">Rp 3.600.000</span>
                                </p>
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <Button
                                    className="h-10 rounded-md bg-red-500 px-5 text-sm font-medium text-white transition hover:bg-red-600 sm:w-auto"
                                    onClick={() => setShowCancelModal(true)}
                                >
                                    Batalkan
                                </Button>

                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                    <Button
                                        className="h-10 rounded-md bg-gray-500 px-5 text-sm font-medium text-white transition hover:bg-gray-600 sm:w-auto"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Lihat Detail
                                    </Button>
                                    {currentPath === '/order/belum-bayar' && (
                                        <Button
                                            className="h-10 rounded-md bg-green-600 px-6 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
                                            onClick={() => setShowPaymentModal(true)}
                                        >
                                            Selesaikan Pembayaran
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </section>
                    </CardContent>
                </Card>
            </section>

            {/* Modal Lihat Detail */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold text-gray-800">Detail Pesanan</h2>
                        <OrderDetailModal onClose={() => setShowModal(false)} />
                        <div className="mt-6 text-right">
                            <Button onClick={() => setShowModal(false)} className="bg-red-500 px-4 text-sm text-white hover:bg-red-600">
                                Tutup
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Batalkan */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-red-600">Konfirmasi Pembatalan</h3>
                        <p className="mt-2 text-sm text-gray-600">Apakah Anda yakin ingin membatalkan pesanan ini?</p>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button onClick={() => setShowCancelModal(false)} className="bg-gray-300 text-sm text-gray-700 hover:bg-gray-400">
                                Batal
                            </Button>
                            <Button className="bg-red-600 text-sm text-white hover:bg-red-700">Ya, Batalkan</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Upload Pembayaran */}
            {/* {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">Upload Bukti Pembayaran</h2>
                        <form className="space-y-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Unggah Bukti Pembayaran (JPG/PNG)</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-green-600 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-green-700"
                                />
                            </label>
                            <div className="flex justify-end gap-3">
                                <Button onClick={() => setShowPaymentModal(false)} className="bg-gray-400 text-white hover:bg-gray-500">
                                    Batal
                                </Button>
                                <Button className="bg-green-600 text-white hover:bg-green-700">Kirim</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )} */}
            {showPaymentModal && <PaymentModal onClose={() => setShowPaymentModal(false)} />}
        </>
    );
}
