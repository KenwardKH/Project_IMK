import OwnerLayout from '@/components/owner/owner-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { AlertCircle, Calendar, CheckCircle, Clock, Eye, Mail, MessageCircle, Search, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

interface Customer {
    id: number;
    name: string;
    email: string;
    message: string;
    status: 'unread' | 'read' | 'replied';
    created_at: string;
    replied_at?: string;
    reply_message?: string;
}

interface CustomerPageProps {
    customers: {
        data: Customer[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    stats: {
        total: number;
        unread: number;
        read: number;
        replied: number;
    };
    filters: {
        status?: string;
        search?: string;
    };
}

export default function CustomerIndex({ customers, stats, filters }: CustomerPageProps) {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'unread':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Belum Dibaca</Badge>;
            case 'read':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Sudah Dibaca</Badge>;
            case 'replied':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Sudah Dibalas</Badge>;
            default:
                return <Badge>Unknown</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'unread':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            case 'read':
                return <Eye className="h-4 w-4 text-yellow-500" />;
            case 'replied':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const handleSearch = (search: string) => {
        router.get('/customers', { ...filters, search }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (status: string) => {
        router.get('/customers', { ...filters, status }, { preserveState: true, replace: true });
    };

    const handleViewCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setReplyMessage('');
    };

    // const handleReply = async () => {
    //     if (!selectedCustomer || !replyMessage.trim()) return;

    //     setIsReplying(true);

    //     try {
    //         const response = await fetch(`/admin/customers/${selectedCustomer.id}/status`, {
    //             method: 'PATCH',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
    //             },
    //             body: JSON.stringify({
    //                 status: 'replied',
    //                 reply_message: replyMessage,
    //             }),
    //         });

    //         const data = await response.json();

    //         if (data.success) {
    //             Swal.fire({
    //                 icon: 'success',
    //                 title: 'Berhasil!',
    //                 text: 'Balasan berhasil dikirim',
    //                 confirmButtonColor: '#22c55e',
    //             });
    //             setSelectedCustomer(null);
    //             router.reload();
    //         }
    //     } catch (error) {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Gagal!',
    //             text: 'Terjadi kesalahan saat mengirim balasan',
    //             confirmButtonColor: '#ef4444',
    //         });
    //     } finally {
    //         setIsReplying(false);
    //     }
    // };

    const handleDelete = async (customer: Customer) => {
        const result = await Swal.fire({
            title: 'Hapus Data?',
            text: `Apakah Anda yakin ingin menghapus pesan dari ${customer.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/customers/${customer.id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Terhapus!',
                        text: 'Data berhasil dihapus',
                        confirmButtonColor: '#22c55e',
                    });
                    router.reload();
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Terjadi kesalahan saat menghapus data',
                    confirmButtonColor: '#ef4444',
                });
            }
        }
    };

    return (
        <OwnerLayout>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Keluhan Customer</h1>
                    <p className="mt-2 text-gray-600">Kelola dan tanggapi pesan dari customer</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100">Total Pesan</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                                <MessageCircle className="h-8 w-8 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card> */}

                    {/* <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-100">Belum Dibaca</p>
                                    <p className="text-2xl font-bold">{stats.unread}</p>
                                </div>
                                <AlertCircle className="h-8 w-8 text-red-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100">Sudah Dibaca</p>
                                    <p className="text-2xl font-bold">{stats.read}</p>
                                </div>
                                <Eye className="h-8 w-8 text-yellow-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100">Sudah Dibalas</p>
                                    <p className="text-2xl font-bold">{stats.replied}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-200" />
                            </div>
                        </CardContent>
                    </Card> */}
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Cari nama, email, atau pesan..."
                                        className="w-96 pr-4 pl-10"
                                        defaultValue={filters.search || ''}
                                        onChange={(e) => {
                                            const timer = setTimeout(() => {
                                                handleSearch(e.target.value);
                                            }, 500);
                                            return () => clearTimeout(timer);
                                        }}
                                    />
                                </div>

                                {/* <Select value={filters.status || 'all'} onValueChange={handleStatusFilter}>
                                    <SelectTrigger className="w-40">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Filter Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="unread">Belum Dibaca</SelectItem>
                                        <SelectItem value="read">Sudah Dibaca</SelectItem>
                                        <SelectItem value="replied">Sudah Dibalas</SelectItem>
                                    </SelectContent>
                                </Select> */}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Messages Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Daftar Keluhan Customer
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {customers.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-4 text-gray-500">Tidak ada pesan customer</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {customers.data.map((customer) => (
                                    <div key={customer.id} className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center gap-3">
                                                    {getStatusIcon(customer.status)}
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-gray-500" />
                                                        <span className="font-semibold text-gray-900">{customer.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-gray-500" />
                                                        <span className="text-gray-600">{customer.email}</span>
                                                    </div>
                                                    {/* {getStatusBadge(customer.status)} */}
                                                </div>

                                                <p className="mb-3 line-clamp-2 text-gray-700">{customer.message}</p>

                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>
                                                            {new Date(customer.created_at).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </span>
                                                    </div>
                                                    {customer.replied_at && (
                                                        <div className="flex items-center gap-1">
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                            <span>Dibalas: {new Date(customer.replied_at).toLocaleDateString('id-ID')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="ml-4 flex items-center gap-2">
                                                <Button
                                                    onClick={() => handleViewCustomer(customer)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    Detail
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(customer)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {customers.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Menampilkan {(customers.current_page - 1) * customers.per_page + 1} -{' '}
                                    {Math.min(customers.current_page * customers.per_page, customers.total)} dari {customers.total} pesan
                                </p>
                                <div className="flex items-center gap-2">
                                    {customers.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => link.url && router.visit(link.url)}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            className="min-w-[40px]"
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Customer Detail Modal */}
                {selectedCustomer && (
                    <div className="bg-black/80 fixed inset-0 z-50 flex items-center justify-center">
                        <div className="m-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
                            <div className="p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">Detail Pesan Customer</h2>
                                    <Button onClick={() => setSelectedCustomer(null)} variant="outline" size="sm">
                                        ✕
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {/* Customer Info */}
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Nama</Label>
                                                <p className="mt-1 text-gray-900">{selectedCustomer.name}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Email</Label>
                                                <p className="mt-1 text-gray-900">{selectedCustomer.email}</p>
                                            </div>
                                            {/* <div>
                                                <Label className="text-sm font-medium text-gray-700">Status</Label>
                                                <div className="mt-1">{getStatusBadge(selectedCustomer.status)}</div>
                                            </div> */}
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Tanggal</Label>
                                                <p className="mt-1 text-gray-900">
                                                    {new Date(selectedCustomer.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Pesan</Label>
                                        <div className="mt-2 rounded-lg bg-gray-50 p-4">
                                            <p className="whitespace-pre-wrap text-gray-900">{selectedCustomer.message}</p>
                                        </div>
                                    </div>

                                    {/* Previous Reply */}
                                    {selectedCustomer.reply_message && (
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Balasan Sebelumnya</Label>
                                            <div className="mt-2 rounded-lg border border-green-200 bg-green-50 p-4">
                                                <p className="whitespace-pre-wrap text-gray-900">{selectedCustomer.reply_message}</p>
                                                {selectedCustomer.replied_at && (
                                                    <p className="mt-2 text-sm text-green-600">
                                                        Dibalas pada:{' '}
                                                        {new Date(selectedCustomer.replied_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Reply Form */}
                                    {/* {selectedCustomer.status !== 'replied' && (
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Balas Pesan</Label>
                                            <Textarea
                                                value={replyMessage}
                                                onChange={(e) => setReplyMessage(e.target.value)}
                                                placeholder="Tulis balasan untuk customer..."
                                                rows={4}
                                                className="mt-2"
                                            />
                                            <div className="mt-4 flex gap-2">
                                                <Button
                                                    onClick={handleReply}
                                                    disabled={!replyMessage.trim() || isReplying}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {isReplying ? (
                                                        <>
                                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                            Mengirim...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Kirim Balasan
                                                        </>
                                                    )}
                                                </Button>
                                                <Button onClick={() => setSelectedCustomer(null)} variant="outline">
                                                    Batal
                                                </Button>
                                            </div>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </OwnerLayout>
    );
}
