import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import OrderDetailModal from './OrderDetailModal';
import PaymentModal from './PaymentModal';

interface OrderItem {
    product_id: number;
    product_name: string;
    product_image: string;
    quantity: number;
    unit: string;
    price: number;
    subtotal: number;
}

interface Payment {
    payment_id: number;
    amount: number;
    payment_date: string;
    payment_method: string;
    proof_image: string;
}

interface Order {
    invoice_id: number;
    customer_name: string;
    customer_contact: string;
    invoice_date: string;
    type: string;
    payment_option: string;
    cashier_name?: string;
    status: string;
    payment_deadline?: string;
    cancellation_reason?: string;
    total_amount: number;
    items: OrderItem[];
    payments: Payment[];
    delivery_address?: string;
}

interface PageProps {
    orders: Order[];
    status: string;
}

export default function OrderSummarySection() {
    const [showDetailModal, setShowDetailModal] = useState(false);
    // const [showCancelModal, setShowCancelModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);

    const { orders, status } = usePage<PageProps>().props;

    const handleShowDetail = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const handleCancelOrder = async (orderId: number) => {
        setLoading(true);
        try {
            await router.post(
                `/order/${orderId}/cancel`,
                {},
                {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil!',
                            text: 'Pesanan berhasil dibatalkan',
                            confirmButtonColor: '#3085d6',
                        });
                        // setShowCancelModal(false);
                        setSelectedOrder(null);
                        router.reload(); // Refresh halaman
                    },
                    onError: (errors) => {
                        console.error('Error cancelling order:', errors);
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal',
                            text: 'Gagal membatalkan pesanan. Silakan coba lagi.',
                            confirmButtonColor: '#d33',
                        });
                    },
                },
            );
        } catch (error) {
            console.error('Error cancelling order:', error);
            Swal.fire({
                icon: 'error',
                title: 'Kesalahan',
                text: 'Terjadi kesalahan saat membatalkan pesanan.',
                confirmButtonColor: '#d33',
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentUpload = (order: Order) => {
        setSelectedOrder(order);
        setShowPaymentModal(true);
    };

    const handlePrintInvoice = (orderId: number) => {
        const invoiceUrl = `/order/${orderId}/invoice`;
        window.open(invoiceUrl, '_blank');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Helper function untuk format tanggal dan waktu yang benar
    // const formatDateTime = (dateString) => {
    //     let date;

    //     // Tambahkan offset jika belum ada 'T' atau offset zona waktu
    //     if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
    //         const isoWithOffset = dateString.replace(' ', 'T') + '+07:00'; // pakai offset Jakarta
    //         date = new Date(isoWithOffset);
    //     } else {
    //         date = new Date(dateString);
    //     }

    //     if (isNaN(date.getTime())) {
    //         return { dateFormatted: 'Invalid Date', timeFormatted: 'Invalid Time' };
    //     }

    //     const dateFormatted = date.toLocaleDateString('id-ID', {
    //         day: 'numeric',
    //         month: 'numeric',
    //         year: 'numeric',
    //         timeZone: 'Asia/Jakarta',
    //     });

    //     const timeFormatted = date.toLocaleTimeString('id-ID', {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         hour12: false,
    //         timeZone: 'Asia/Jakarta',
    //     });

    //     return { dateFormatted, timeFormatted };
    // };

    // // Contoh penggunaan:
    // const testDate = '2025-06-11 19:11:50';
    // console.log(formatDateTime(testDate));

    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'menunggu pembayaran': 'Belum Bayar',
            pending: 'Belum Bayar',
            'menunggu konfirmasi': 'Menunggu Konfirmasi',
            belum_bayar: 'Belum Bayar',
            diproses: 'Diproses',
            sedang_proses: 'Menunggu Konfirmasi',
            processing: 'Menunggu Konfirmasi',
            confirmed: 'Dikonfirmasi',
            'menunggu pengambilan': 'Siap Diambil',
            diantar: 'Sedang Diantar',
            selesai: 'Selesai',
            completed: 'Selesai',
            dibatalkan: 'Dibatalkan',
            cancelled: 'Dibatalkan',
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status: string) => {
        const completedStatuses = ['selesai', 'completed'];
        const cancelledStatuses = ['dibatalkan', 'cancelled'];
        const processingStatuses = ['diproses', 'sedang_proses', 'processing', 'confirmed', 'menunggu pengambilan', 'diantar', 'menunggu konfirmasi'];
        const pendingStatuses = ['menunggu pembayaran', 'pending', 'belum_bayar'];

        if (completedStatuses.includes(status)) return 'text-green-600';
        if (cancelledStatuses.includes(status)) return 'text-red-600';
        if (processingStatuses.includes(status)) return 'text-blue-600';
        if (pendingStatuses.includes(status)) return 'text-orange-600';
        return 'text-gray-600';
    };

    const canCancel = (orderStatus: string) => {
        const nonCancellableStatuses = [
            'selesai',
            'completed',
            'dibatalkan',
            'cancelled',
            'sedang_proses',
            'diproses',
            'processing',
            'confirmed',
            'menunggu pengambilan',
            'diantar',
        ];
        return !nonCancellableStatuses.includes(orderStatus);
    };

    const canUploadPayment = (orderStatus: string) => {
        const paymentPendingStatuses = ['menunggu pembayaran', 'pending', 'belum_bayar'];
        return paymentPendingStatuses.includes(orderStatus);
    };

    const canPrintInvoice = (orderStatus: string) => {
        const printableStatuses = ['selesai', 'completed', 'sedang_proses', 'processing', 'confirmed', 'menunggu pengambilan', 'diantar'];
        return printableStatuses.includes(orderStatus);
    };

    // Convert status to display status for section title
    const getStatusDisplayText = (status: string) => {
        const statusDisplayMap: { [key: string]: string } = {
            'belum-bayar': 'Belum Bayar',
            'sedang-proses': 'Menunggu Konfirmasi',
            selesai: 'Selesai',
            dibatalkan: 'Dibatalkan',
        };
        return statusDisplayMap[status] || status;
    };

    if (!orders || orders.length === 0) {
        return (
            <section className="mx-auto w-full max-w-4xl p-2 sm:p-8">
                <Card className="rounded-xl border border-gray-200 shadow-sm">
                    <CardContent className="p-10 text-center">
                        <p className="text-gray-500">Tidak ada pesanan dengan status "{getStatusDisplayText(status)}"</p>
                    </CardContent>
                </Card>
            </section>
        );
    }

    return (
        <>
            <section className="mx-auto w-full max-w-4xl space-y-6 p-2 sm:p-8">
                {orders.map((order) => (
                    <Card key={order.invoice_id} className="rounded-xl border border-gray-200 shadow-sm">
                        <CardContent className="p-4 sm:p-10">
                            <header className="mb-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-gray-700">
                                        No. Pesanan: <span className="font-normal text-gray-600">#{order.invoice_id}</span>
                                    </p>
                                    <p className="text-sm font-semibold text-gray-700">
                                        Opsi Pengantaran: <span className="font-normal text-gray-600">{order.type}</span>
                                    </p>
                                    {order.delivery_address && (
                                        <p className="text-sm font-semibold text-gray-700">
                                            Alamat Pengiriman: <span className="font-normal text-gray-600">{order.delivery_address}</span>
                                        </p>
                                    )}
                                    <p className="text-sm font-semibold text-gray-700">
                                        Tanggal:{' '}
                                        <span className="font-normal text-gray-600">{new Date(order.invoice_date).toLocaleDateString('id-ID')}</span>
                                    </p>
                                    <p className="text-sm font-semibold text-gray-700">
                                        Status:{' '}
                                        <span className={`font-normal ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)} {order.cancellation_reason && 'oleh kasir'}{' '}
                                        </span>
                                    </p>
                                    {order.status === 'dibatalkan' && order.cancellation_reason && (
                                        <p className="text-sm font-semibold text-gray-700">
                                            Alasan Pembatalan: <span className="font-normal text-gray-600">{order.cancellation_reason}</span>
                                        </p>
                                    )}
                                    {order.payment_deadline && order.status === 'menunggu pembayaran' && (
                                        <p className="text-sm font-semibold text-gray-700">
                                            Batas Waktu Pembayaran:{' '}
                                            <span className="font-normal text-gray-600">
                                                {new Date(order.payment_deadline).toLocaleString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                    timeZone: 'UTC', // agar waktu tetap UTC
                                                })}
                                            </span>
                                        </p>
                                    )}

                                    {order.payment_option && (
                                        <p className="text-sm font-semibold text-gray-700">
                                            Metode Pembayaran: <span className="font-normal text-gray-600">{order.payment_option}</span>
                                        </p>
                                    )}
                                </div>
                                {canPrintInvoice(order.status) && (
                                    <Button
                                        className="h-8 rounded-md bg-blue-500 px-4 text-xs font-medium text-white hover:bg-blue-600"
                                        onClick={() => handlePrintInvoice(order.invoice_id)}
                                    >
                                        Cetak Invoice
                                    </Button>
                                )}
                            </header>

                            <Separator className="my-4 h-px bg-gray-200 sm:my-6" />

                            <div className="space-y-6">
                                {order.items.map((item, index) => (
                                    <article key={`${item.product_id}-${index}`} className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <div className="h-40 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:w-40">
                                            <img
                                                src={`/storage/${item.product_image}`}
                                                alt={item.product_name}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/images/placeholder-product.png';
                                                }}
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col justify-between">
                                            <h3 className="text-base font-semibold text-gray-800">{item.product_name}</h3>
                                            <div className="mt-2 flex justify-between sm:mt-6">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        x{item.quantity} {item.unit}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {formatCurrency(item.price)} per {item.unit}
                                                    </p>
                                                </div>
                                                <p className="text-price-lighter text-base font-bold">{formatCurrency(item.subtotal)}</p>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <section className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6 font-sans shadow-sm">
                                <div className="mb-6 text-right">
                                    <p className="text-xl font-semibold text-gray-800 sm:text-2xl">
                                        Total Pesanan: <span className="text-price font-bold">{formatCurrency(order.total_amount)}</span>
                                    </p>
                                </div>

                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    {canCancel(order.status) && (
                                        <Button
                                            className="h-10 rounded-md bg-red-500 px-5 text-sm font-medium text-white transition hover:bg-red-600 sm:w-auto"
                                            // onClick={() => {
                                            //     setSelectedOrder(order);
                                            //     setShowCancelModal(true);
                                            // }}
                                            onClick={() => {
                                                Swal.fire({
                                                    title: 'Konfirmasi Pembatalan',
                                                    text: `Apakah Anda yakin ingin membatalkan pesanan #${order.invoice_id}?`,
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonColor: '#d33',
                                                    cancelButtonColor: '#aaa',
                                                    confirmButtonText: 'Ya, Batalkan',
                                                    cancelButtonText: 'Batal',
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        handleCancelOrder(order.invoice_id);
                                                    }
                                                });
                                            }}
                                            disabled={loading}
                                        >
                                            Batalkan
                                        </Button>
                                    )}

                                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                        <Button
                                            className="h-10 rounded-md bg-gray-500 px-5 text-sm font-medium text-white transition hover:bg-gray-600 sm:w-auto"
                                            onClick={() => handleShowDetail(order)}
                                        >
                                            Lihat Detail
                                        </Button>
                                        {canUploadPayment(order.status) && (
                                            <Button
                                                className="h-10 rounded-md bg-green-600 px-6 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
                                                onClick={() => handlePaymentUpload(order)}
                                            >
                                                Selesaikan Pembayaran
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </CardContent>
                    </Card>
                ))}
            </section>

            {/* Modal Lihat Detail */}
            {showDetailModal && selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedOrder(null);
                    }}
                />
            )}

            {/* Modal Konfirmasi Batalkan */}
            {/* {showCancelModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-red-600">Konfirmasi Pembatalan</h3>
                        <p className="mt-2 text-sm text-gray-600">Apakah Anda yakin ingin membatalkan pesanan #{selectedOrder.invoice_id}?</p>
                        <p className="mt-1 text-xs text-gray-500">Tindakan ini tidak dapat dibatalkan.</p>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setSelectedOrder(null);
                                }}
                                className="bg-gray-300 text-sm text-gray-700 hover:bg-gray-400"
                                disabled={loading}
                            >
                                Batal
                            </Button>
                            <Button
                                className="bg-red-600 text-sm text-white hover:bg-red-700"
                                onClick={() => handleCancelOrder(selectedOrder.invoice_id)}
                                disabled={loading}
                            >
                                {loading ? 'Membatalkan...' : 'Ya, Batalkan'}
                            </Button>
                        </div>
                    </div>
                </div>
            )} */}

            {/* Modal Upload Pembayaran */}
            {showPaymentModal && selectedOrder && (
                <PaymentModal
                    order={selectedOrder}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setSelectedOrder(null);
                    }}
                />
            )}
        </>
    );
}
