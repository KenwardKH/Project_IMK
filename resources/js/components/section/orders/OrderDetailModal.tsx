// components/OrderDetailModal.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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

interface OrderDetailModalProps {
    order: Order;
    onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const orderInfo = [
        { title: 'Opsi Pengantaran', value: order.type || 'Ambil Sendiri' },
        { title: 'Nama Pelanggan', value: order.customer_name },
        { title: 'Kontak', value: order.customer_contact },
    ];

    const paymentInfo = [
        { title: 'No. Pesanan', value: order.invoice_id.toString() },
        { title: 'Metode Pembayaran', value: order.payment_option },
        { title: 'Status', value: order.status },
    ];

    const dateInfo = {
        title: 'Tanggal Pesanan',
        value: formatDateTime(order.invoice_date),
    };

    // Get payment info if available
    const latestPayment = order.payments.length > 0 ? order.payments[0] : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-xl font-bold text-gray-500 hover:text-black cursor-pointer"
                >
                    &times;
                </button>

                <h2 className="mb-4 text-lg font-semibold">Detail Pesanan</h2>

                {/* Order Info */}
                <Card className="mb-4 rounded-[9px] bg-[#f3f3f3]">
                    <CardContent className="p-3">
                        {orderInfo.map((info, index) => (
                            <div key={index} className="flex py-1">
                                <span className="w-48 text-sm font-bold">{info.title}</span>
                                <span className="text-sm">: {info.value}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="mb-4 rounded-[9px] bg-[#f3f3f3]">
                    <CardContent className="p-3">
                        {paymentInfo.map((info, index) => (
                            <div key={index} className="flex py-1">
                                <span className="w-48 text-sm font-bold">{info.title}</span>
                                <span className="text-sm">: {info.value}</span>
                            </div>
                        ))}
                        {order.cashier_name && (
                            <div className="flex py-1">
                                <span className="w-48 text-sm font-bold">Kasir</span>
                                <span className="text-sm">: {order.cashier_name}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="mb-6 rounded-[9px] bg-[#f3f3f3]">
                    <CardContent className="p-3">
                        <div className="flex py-1">
                            <span className="w-48 text-sm font-bold">{dateInfo.title}</span>
                            <span className="text-sm">: {dateInfo.value}</span>
                        </div>
                        {latestPayment && (
                            <div className="flex py-1">
                                <span className="w-48 text-sm font-bold">Tanggal Pembayaran</span>
                                <span className="text-sm">: {formatDateTime(latestPayment.payment_date)}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Proof if available */}
                {latestPayment && latestPayment.proof_image && (
                    <Card className="mb-6 rounded-[9px] bg-[#f3f3f3]">
                        <CardContent className="p-3">
                            <div className="mb-2">
                                <span className="text-sm font-bold">Bukti Pembayaran:</span>
                            </div>
                            <img 
                                src={`/storage/${latestPayment.proof_image}`} 
                                alt="Bukti Pembayaran" 
                                className="max-w-full h-auto rounded-lg"
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Order Items */}
                <Separator className="mb-4" />
                <div className="space-y-4">
                    {order.items.map((item) => (
                        <Card key={item.product_id} className="rounded-[9px]">
                            <CardContent className="p-0">
                                <div className="flex items-center p-4">
                                    <div className="mr-4 h-[100px] w-[100px] bg-gray-200">
                                        {item.product_image ? (
                                            <img 
                                                src={`/storage/${item.product_image}`} 
                                                alt={item.product_name} 
                                                className="h-full w-full object-cover rounded" 
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                                                
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="mb-2 text-base font-medium">{item.product_name}</h3>
                                        <p className="text-sm text-gray-500">
                                            x{item.quantity} {item.unit}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {formatCurrency(item.price)} per {item.unit}
                                        </p>
                                    </div>
                                    <div className="text-sm font-medium text-orange-600">
                                        {formatCurrency(item.subtotal)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Total */}
                <Card className="mt-4 rounded-lg bg-[#f4f4f4]">
                    <CardContent className="flex justify-end p-4">
                        <div className="text-base font-bold text-[#b92e00]">
                            Total Pesanan: {formatCurrency(order.total_amount)}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}