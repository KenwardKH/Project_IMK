import OwnerLayout from '@/components/owner/owner-layout';
import { useState } from 'react';
import {
    LineChart,
    Line,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { usePage } from '@inertiajs/react';

interface BanyakPenjualan {
    id: number;
    tanggal: string;
    jumlah_penjualan: number;
    hasil_penjualan: number;
}

interface FinancialData {
    month: string;
    sales: number;
    expenses: number;
    profit: number;
}

const OwnerLaporanPenjualan = () => {
    const { props } = usePage();
    const salesData = props.salesData as BanyakPenjualan[];
    const financialData = props.financialData as FinancialData[];
    
    const [chartType, setChartType] = useState<'jumlah' | 'hasil'>('jumlah');

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <OwnerLayout>
            <div className="flex w-full flex-col gap-6 px-6 py-4">
                <h1 className="text-center text-4xl font-bold text-gray-800">Laporan Penjualan</h1>

                {/* Grafik */}
                <section className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 shadow-md">
                    <section className="mb-4 flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Toggle Chart */}
                        <div className="flex rounded-full bg-gray-200 p-1">
                            <button
                                onClick={() => setChartType('jumlah')}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                    chartType === 'jumlah' ? 'bg-blue-600 text-white shadow' : 'text-gray-600'
                                }`}
                            >
                                Jumlah Penjualan
                            </button>
                            <button
                                onClick={() => setChartType('hasil')}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                    chartType === 'hasil' ? 'bg-blue-600 text-white shadow' : 'text-gray-600'
                                }`}
                            >
                                Hasil Penjualan
                            </button>
                        </div>
                    </section>
                    <div className="h-64 min-w-[900px] sm:h-72 lg:h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={salesData}
                                margin={{ top: 10, right: 30, left: 50, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="tanggal" />
                                <YAxis />
                                <Tooltip formatter={(value: any) => chartType === 'hasil' ? formatCurrency(value) : value} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey={chartType === 'jumlah' ? 'jumlah_penjualan' : 'hasil_penjualan'}
                                    name={chartType === 'jumlah' ? 'Jumlah Penjualan' : 'Hasil Penjualan'}
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    
                    {/* No Data Message */}
                    {(!salesData || salesData.length === 0) && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Tidak ada data penjualan tersedia untuk 30 hari terakhir</p>
                        </div>
                    )}
                </section>

                {/* Tabel Laporan Finansial */}
                <div className="overflow-x-auto rounded-xl shadow">
                    <h2 className="mb-2 text-3xl font-bold">Laporan Finansial</h2>
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
            </div>
        </OwnerLayout>
    );
};

export default OwnerLaporanPenjualan;