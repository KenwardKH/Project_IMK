import OwnerLayout from '@/components/owner/owner-layout';
import { Box, ClipboardList, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer,
    Tooltip, XAxis, YAxis
} from 'recharts';
import { Head, usePage } from '@inertiajs/react';

interface FinancialData {
    month: string;
    sales: number;
    expenses: number;
    profit: number;
}

const OwnerDashboard = () => {
    const { props } = usePage();
    const productCount = props.productCount as number;
    const customerCount = props.customerCount as number;
    const transactionCount = props.transactionCount as number;
    const financialData = props.financialData as FinancialData[];

    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const stats = [
        { title: 'Banyak Produk', icon: <Box className="w-10 h-10 sm:w-12 sm:h-12" />, value: productCount },
        { title: 'Banyak Pelanggan', icon: <Users className="w-10 h-10 sm:w-12 sm:h-12" />, value: customerCount },
        { title: 'Banyak Transaksi', icon: <ClipboardList className="w-10 h-10 sm:w-12 sm:h-12" />, value: transactionCount },
    ];

    return (
        <OwnerLayout>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 px-4 py-6">
                {/* Stats Cards */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-between rounded-2xl bg-[#FFD9B3] p-4 text-black shadow-md ring-2 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <p className="text-lg font-semibold sm:text-xl">{stat.title}</p>
                            <div className="mt-2 flex w-full items-center justify-around px-2 sm:px-4 gap-1">
                                {stat.icon}
                                <p className="text-3xl font-bold sm:text-4xl lg:text-5xl">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Financial Section */}
                <section>
                    <h2 className="mb-4 text-2xl font-bold text-black sm:text-3xl lg:text-4xl">Laporan Finansial</h2>

                    {/* Financial Chart - Only Sales and Expenses */}
                    <div className="mb-6 h-64 sm:h-72 lg:h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financialData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="sales" name="Penjualan" fill="#6366f1" />
                                <Bar dataKey="expenses" name="Pengeluaran" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Financial Table - Including Profit */}
                    <div className="overflow-x-auto rounded-xl shadow">
                        <table className="min-w-full border-collapse bg-white text-sm sm:text-base">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    <th className="border px-4 py-3 text-center font-semibold">Bulan</th>
                                    <th className="border px-4 py-3 text-center font-semibold">Penjualan</th>
                                    <th className="border px-4 py-3 text-center font-semibold">Pengeluaran</th>
                                    <th className="border px-4 py-3 text-center font-semibold">Keuntungan/Kerugian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {financialData && financialData.length > 0 ? (
                                    financialData.map((item, idx) => (
                                        <tr key={idx} className="text-center even:bg-gray-100">
                                            <td className="border px-4 py-2">{item.month}</td>
                                            <td className="border px-4 py-2">{formatCurrency(item.sales)}</td>
                                            <td className="border px-4 py-2">{formatCurrency(item.expenses)}</td>
                                            <td className={`border px-4 py-2 ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatCurrency(item.profit)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="border px-4 py-2 text-center text-gray-500">
                                            Tidak ada data finansial tersedia
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </OwnerLayout>
    );
};

export default OwnerDashboard;