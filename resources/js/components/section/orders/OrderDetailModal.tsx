// components/OrderDetailModal.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function OrderDetailModal({ onClose }: { onClose: () => void }) {
    const orderInfo = [
        { title: 'Opsi Pengantaran', value: 'Diantar' },
        { title: 'Alamat', value: 'Jl. Sisingamangaraja No.34' },
    ];
    const paymentInfo = [
        { title: 'No. Pesanan', value: '54' },
        { title: 'Metode Pembayaran', value: 'Transfer BRI' },
    ];
    const dateInfo = {
        title: 'Tanggal & Waktu Pembayaran',
        value: '04-05-2023 14:30',
    };
    const orderItems = [
        {
            id: 1,
            image: '../images/buku_campus.jpeg',
            name: 'Buku Tulis Campus Isi 10 / 36 Lembar',
            quantity: 10,
            price: 'Rp 120.000',
        },
        {
            id: 2,
            image: '../images/buku_campus.jpeg',
            name: 'Buku Tulis Campus Isi 10 / 36 Lembar',
            quantity: 10,
            price: 'Rp 120.000',
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
                <button onClick={onClose} className="absolute top-4 right-4 text-xl font-bold text-gray-500 hover:text-black cursor-pointer">
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
                    </CardContent>
                </Card>

                <Card className="mb-6 rounded-[9px] bg-[#f3f3f3]">
                    <CardContent className="p-3">
                        <div className="flex py-1">
                            <span className="w-48 text-sm font-bold">{dateInfo.title}</span>
                            <span className="text-sm">: {dateInfo.value}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Items */}
                <Separator className="mb-4" />
                <div className="space-y-4">
                    {orderItems.map((item) => (
                        <Card key={item.id} className="rounded-[9px]">
                            <CardContent className="p-0">
                                <div className="flex items-center p-4">
                                    <div className="mr-4 h-[100px] w-[100px] bg-gray-200">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="mb-2 text-base font-medium">{item.name}</h3>
                                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                                    </div>
                                    <div className="text-sm font-medium text-orange-600">{item.price}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Total */}
                <Card className="mt-4 rounded-lg bg-[#f4f4f4]">
                    <CardContent className="flex justify-end p-4">
                        <div className="text-base font-bold text-[#b92e00]">Total Pesanan: Rp 3.600.000</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
