import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePage, router } from '@inertiajs/react';
import { useState } from 'react';
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
    total_amount: number;
    items: OrderItem[];
    payments: Payment[];
}

interface PageProps {
    orders: Order[];
    status: string;
}

export default function OrderSummarySection() {
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);

    const { orders, status } = usePage<PageProps>().props;
    const currentPath = `/order/${status}`;

    const handleShowDetail = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const handleCancelOrder = async (orderId: number) => {
        setLoading(true);
        try {
            await router.post(`/order/${orderId}/cancel`, {}, {
                onSuccess: () => {
                    setShowCancelModal(false);
                    setSelectedOrder(null);
                    // Refresh the page to show updated data
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Error cancelling order:', errors);
                    alert('Gagal membatalkan pesanan. Silakan coba lagi.');
                }
            });
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Terjadi kesalahan saat membatalkan pesanan.');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentUpload = (order: Order) => {
        setSelectedOrder(order);
        setShowPaymentModal(true);
    };

    const handlePrintInvoice = async (orderId: number) => {
        try {
            const response = await fetch(`/order/${orderId}/invoice`);
            if (response.ok) {
                const invoiceData = await response.json();
                // Here you would typically generate or download the PDF
                console.log('Invoice data:', invoiceData);
                // For now, just show success message
                alert('Data invoice berhasil diambil. Fitur cetak akan segera tersedia.');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Gagal mengambil data invoice');
            }
        } catch (error) {
            console.error('Error generating invoice:', error);
            alert('Terjadi kesalahan saat mengambil data invoice');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'belum_bayar': 'Belum Bayar',
            'pending': 'Belum Bayar',
            'sedang_proses': 'Sedang Diproses',
            'processing': 'Sedang Diproses',
            'confirmed': 'Dikonfirmasi',
            'selesai': 'Selesai',
            'completed': 'Selesai',
            'dibatalkan': 'Dibatalkan',
            'cancelled': 'Dibatalkan'
        };
        return statusMap[status] || status;
    };

    const canCancel = (orderStatus: string) => {
        return !['selesai', 'completed', 'dibatalkan', 'cancelled'].includes(orderStatus);
    };

    const canUploadPayment = (orderStatus: string) => {
        return ['menunggu pembayaran', 'pending'].includes(orderStatus);
    };

    const canPrintInvoice = (orderStatus: string) => {
        return ['selesai', 'completed', 'dibatalkan', 'cancelled'].includes(orderStatus);
    };

    if (!orders || orders.length === 0) {
        return (
            <section className="mx-auto w-full max-w-4xl p-2 sm:p-8">
                <Card className="rounded-xl border border-gray-200 shadow-sm">
                    <CardContent className="p-10 text-center">
                        <p className="text-gray-500">Tidak ada pesanan dengan status "{getStatusText(status)}"</p>
                    </CardContent>
                </Card>
            </section>
        );
    }

    return (
        <>
            <section className="mx-auto w-full max-w-4xl p-2 sm:p-8 space-y-6">
                {orders.map((order) => (
                    <Card key={order.invoice_id} className="rounded-xl border border-gray-200 shadow-sm">
                        <CardContent className="p-4 sm:p-10">
                            <header className="mb-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-gray-700">
                                        No. Pesanan: <span className="font-normal text-gray-600">#{order.invoice_id}</span>
                                    </p>
                                    <p className="text-sm font-semibold text-gray-700">
                                        Opsi Pengantaran: <span className="font-normal text-gray-600">{order.type || 'Ambil Sendiri'}</span>
                                    </p>
                                    <p className="text-sm font-semibold text-gray-700">
                                        Tanggal: <span className="font-normal text-gray-600">
                                            {new Date(order.invoice_date).toLocaleDateString('id-ID')}
                                        </span>
                                    </p>
                                    <p className="text-sm font-semibold text-gray-700">
                                        Status: <span className={`font-normal ${
                                            ['selesai', 'completed'].includes(order.status) ? 'text-green-600' :
                                            ['dibatalkan', 'cancelled'].includes(order.status) ? 'text-red-600' :
                                            ['sedang_proses', 'processing', 'confirmed'].includes(order.status) ? 'text-blue-600' :
                                            'text-orange-600'
                                        }`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </p>
                                    {order.payments.length > 0 && (
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

                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col justify-between">
                                            <h3 className="text-base font-semibold text-gray-800">{item.product_name}</h3>
                                            <div className="mt-2 flex justify-between sm:mt-6">
                                                <div>
                                                    <p className="text-sm text-gray-500">x{item.quantity} {item.unit}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {formatCurrency(item.price)} per {item.unit}
                                                    </p>
                                                </div>
                                                <p className="text-base font-bold text-orange-600">
                                                    {formatCurrency(item.subtotal)}
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <section className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6 font-sans shadow-sm">
                                <div className="mb-6 text-right">
                                    <p className="text-xl font-semibold text-gray-800 sm:text-2xl">
                                        Total Pesanan: <span className="font-bold text-red-600">
                                            {formatCurrency(order.total_amount)}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    {canCancel(order.status) && (
                                        <Button
                                            className="h-10 rounded-md bg-red-500 px-5 text-sm font-medium text-white transition hover:bg-red-600 sm:w-auto"
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setShowCancelModal(true);
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
            {showCancelModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-red-600">Konfirmasi Pembatalan</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Apakah Anda yakin ingin membatalkan pesanan #{selectedOrder.invoice_id}?
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Tindakan ini tidak dapat dibatalkan.
                        </p>
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
            )}

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
