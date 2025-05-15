import OwnerLayout from '@/components/owner/owner-layout';
import { Box, ClipboardList, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { usePage } from '@inertiajs/react'; //untuk data dari controller


interface FinancialData {
    month: string;
    sales: number;
    expenses: number;
    profit: number;
}

const OwnerDashboard = () => {
    const { props } = usePage();       //test untuk product count
    const productCount = props.productCount as number;
    const customerCount = props.customerCount as number; 
    const transactionCount = props.transactionCount as number;//jangan dihapus bujank
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Financial data for both table and chart
    const financialData: FinancialData[] = [
        { month: '2025-5', sales: 7000000, expenses: 3000000, profit: 4000000 },
        { month: '2025-4', sales: 8000000, expenses: 3500000, profit: 4500000 },
        { month: '2025-3', sales: 6000000, expenses: 2000000, profit: 4000000 },
        { month: '2025-2', sales: 8000000, expenses: 4000000, profit: 4000000 },
    ];

    // Format numbers for display
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const getCardSize = (): string => {
        if (windowWidth < 640) return 'w-full mb-4'; // Small screens
        if (windowWidth < 1024) return 'w-full sm:w-64 mb-4'; // Medium screens
        return 'w-100'; // Large screens
    };

    return (
        <OwnerLayout>
            <div className="flex h-full flex-1 flex-col gap-4">
                <section className="grid grid-cols-1 justify-items-center gap-4 px-2 py-3 sm:grid-cols-2 sm:px-4 xl:grid-cols-3">
                    <div
                        className={`flex h-32 sm:h-40 ${getCardSize()} flex-col items-center justify-center rounded-xl bg-[#FFD9B3] p-2 text-black ring-2`}
                    >
                        <p className="text-xl font-medium sm:text-2xl lg:text-4xl">Banyak Produk</p>
                        <div className="flex w-full flex-row items-center justify-around">
                            <Box className="size-12 sm:size-16 lg:size-20 xl:size-24" />
                            <p className="text-4xl font-bold sm:text-5xl lg:text-7xl">{productCount}</p>
                        </div>
                    </div>
                    <div
                        className={`flex h-32 sm:h-40 ${getCardSize()} flex-col items-center justify-center rounded-xl bg-[#FFD9B3] p-2 text-black ring-2`}
                    >
                        <p className="text-xl font-medium sm:text-2xl lg:text-4xl">Banyak Pelanggan</p>
                        <div className="flex w-full flex-row items-center justify-around">
                            <Users className="size-12 sm:size-16 lg:size-20 xl:size-24" />
                            <p className="text-4xl font-bold sm:text-5xl lg:text-7xl">{customerCount}</p>
                        </div>
                    </div>
                    <div
                        className={`flex h-32 sm:h-40 ${getCardSize()} flex-col items-center justify-center rounded-xl bg-[#FFD9B3] p-2 text-black ring-2`}
                    >
                        <p className="text-xl font-medium sm:text-2xl lg:text-4xl">Banyak Transaksi</p>
                        <div className="flex w-full flex-row items-center justify-around">
                            <ClipboardList className="size-12 sm:size-16 lg:size-20 xl:size-24" />
                            <p className="text-4xl font-bold sm:text-5xl lg:text-7xl">{transactionCount}</p>
                        </div>
                    </div>
                </section>

                <section className="px-2 sm:px-4">
                    <h1 className="mb-4 text-2xl font-bold text-black sm:mb-6 sm:text-3xl lg:mb-10 lg:text-5xl">Laporan Finansial</h1>

                    {/* Financial Chart - Visible on medium screens and up */}
                    <div className="mb-6 hidden h-64 sm:block lg:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="sales" name="Total Penjualan" fill="#8884d8" />
                                <Bar dataKey="expenses" name="Total Pengeluaran" fill="#82ca9d" />
                                <Bar dataKey="profit" name="Keuntungan" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Responsive Financial Table */}
                    <div className="relative overflow-x-auto rounded-lg shadow-md">
                        <table className="w-full text-left">
                            <thead className="bg-[#6b7280] text-[#ffffff]">
                                <tr>
                                    <th className="border border-gray-200 p-2 text-center text-sm font-bold sm:p-3 sm:text-lg lg:p-4 lg:text-3xl">
                                        Bulan
                                    </th>
                                    <th className="border border-gray-200 p-2 text-center text-sm font-bold sm:p-3 sm:text-lg lg:p-4 lg:text-3xl">
                                        Total Penjualan
                                    </th>
                                    <th className="border border-gray-200 p-2 text-center text-sm font-bold sm:p-3 sm:text-lg lg:p-4 lg:text-3xl">
                                        Total Pengeluaran
                                    </th>
                                    <th className="border border-gray-200 p-2 text-center text-sm font-bold sm:p-3 sm:text-lg lg:p-4 lg:text-3xl">
                                        Keuntungan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-gray-800">
                                {financialData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-200 p-2 text-center text-xs sm:p-3 sm:text-lg lg:p-4 lg:text-2xl">
                                            {item.month}
                                        </td>
                                        <td className="border border-gray-200 p-2 text-center text-xs sm:p-3 sm:text-lg lg:p-4 lg:text-2xl">
                                            {formatCurrency(item.sales)}
                                        </td>
                                        <td className="border border-gray-200 p-2 text-center text-xs sm:p-3 sm:text-lg lg:p-4 lg:text-2xl">
                                            {formatCurrency(item.expenses)}
                                        </td>
                                        <td className="border border-gray-200 p-2 text-center text-xs sm:p-3 sm:text-lg lg:p-4 lg:text-2xl">
                                            {formatCurrency(item.profit)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </OwnerLayout>
    );
};

export default OwnerDashboard;