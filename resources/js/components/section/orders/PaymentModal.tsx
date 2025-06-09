import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { ChangeEvent, useState } from 'react';
import Swal from 'sweetalert2';

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
    items: any[];
    payments: any[];
}

interface PaymentModalProps {
    order: Order;
    onClose: () => void;
}

export default function PaymentModal({ order, onClose }: PaymentModalProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('File harus berupa gambar');
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('Ukuran file maksimal 2MB');
                return;
            }

            setError(null);
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Pilih file terlebih dahulu');
            return;
        }

        const confirm = await Swal.fire ({
            title: 'Konfirmasi Upload',
            text: 'Apakah Anda yakin bukti pembayaran ini telah sesuai?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Upload',
            cancelButtonText: 'Batal',
        })

        if (!confirm.isConfirmed) {
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('payment_proof', selectedFile);

        try {
            await router.post(`/order/${order.invoice_id}/upload-payment`, formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    const message = page.props?.flash?.success || 'Bukti pembayaran berhasil diupload';
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: message,
                        confirmButtonColor: '#3085d6',
                    }).then(() => {
                        onClose();
                        router.reload(); // refresh data
                    });
                },
                onError: (errors) => {
                    console.error('Upload error:', errors);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: 'Gagal mengupload bukti pembayaran. Silakan coba lagi.',
                        confirmButtonColor: '#d33',
                    });
                },
            });
        } catch (err) {
            console.error('Unexpected error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Kesalahan',
                text: 'Terjadi kesalahan saat mengupload. Silakan coba lagi.',
                confirmButtonColor: '#d33',
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Upload Bukti Pembayaran</h2>

                {/* Order Info */}
                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                    <p className="text-sm font-medium text-gray-700">Pesanan #{order.invoice_id}</p>
                    <p className="text-sm text-gray-600">Total: {formatCurrency(order.total_amount)}</p>
                    <p className="text-sm text-gray-600">Metode: {order.payment_option}</p>
                </div>

                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Pilih Bukti Pembayaran (JPG, PNG - Max 2MB)</label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleImageChange}
                        disabled={isUploading}
                        className="block w-full cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-200 disabled:opacity-50"
                    />
                </div>

                {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-3">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {imagePreview && (
                    <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
                        <img src={imagePreview} alt="Preview bukti pembayaran" className="max-h-64 w-full object-cover" />
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <Button type="button" className="bg-gray-400 px-4 text-sm text-white hover:bg-gray-500" onClick={onClose} disabled={isUploading}>
                        Batal
                    </Button>
                    <Button
                        type="button"
                        className="bg-green-600 px-4 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                    >
                        {isUploading ? 'Mengupload...' : 'Kirim'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
