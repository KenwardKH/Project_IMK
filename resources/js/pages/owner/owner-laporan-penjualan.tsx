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

interface BanyakPenjualan {
    id: number;
    tanggal: string;
    jumlah_penjualan: number;
    hasil_penjualan: number;
}

const OwnerLaporanPenjualan = () => {
    const [chartType, setChartType] = useState<'jumlah' | 'hasil'>('jumlah');

    const banyakPenjualan: BanyakPenjualan[] = [
        { id: 1, tanggal: '2023-10-01', jumlah_penjualan: 100, hasil_penjualan: 1000000 },
        { id: 2, tanggal: '2023-10-02', jumlah_penjualan: 150, hasil_penjualan: 1500000 },
        { id: 3, tanggal: '2023-10-03', jumlah_penjualan: 220, hasil_penjualan: 2200000 },
        { id: 4, tanggal: '2023-10-04', jumlah_penjualan: 258, hasil_penjualan: 2580000 },
        { id: 5, tanggal: '2023-10-05', jumlah_penjualan: 310, hasil_penjualan: 3100000 },
        { id: 6, tanggal: '2023-10-06', jumlah_penjualan: 365, hasil_penjualan: 3650000 },
        { id: 7, tanggal: '2023-10-07', jumlah_penjualan: 410, hasil_penjualan: 4100000 },
        { id: 8, tanggal: '2023-10-08', jumlah_penjualan: 470, hasil_penjualan: 4700000 },
        { id: 9, tanggal: '2023-10-09', jumlah_penjualan: 520, hasil_penjualan: 5200000 },
        { id: 10, tanggal: '2023-10-10', jumlah_penjualan: 580, hasil_penjualan: 5800000 },
        { id: 11, tanggal: '2023-10-11', jumlah_penjualan: 640, hasil_penjualan: 6400000 },
        { id: 12, tanggal: '2023-10-12', jumlah_penjualan: 700, hasil_penjualan: 7000000 },
        { id: 13, tanggal: '2023-10-13', jumlah_penjualan: 760, hasil_penjualan: 7600000 },
        { id: 14, tanggal: '2023-10-14', jumlah_penjualan: 820, hasil_penjualan: 8200000 },
        { id: 15, tanggal: '2023-10-15', jumlah_penjualan: 880, hasil_penjualan: 8800000 },
        { id: 16, tanggal: '2023-10-16', jumlah_penjualan: 940, hasil_penjualan: 9400000 },
        { id: 17, tanggal: '2023-10-17', jumlah_penjualan: 1000, hasil_penjualan: 10000000 },
        { id: 18, tanggal: '2023-10-18', jumlah_penjualan: 1060, hasil_penjualan: 10600000 },
    ];

    const financialData = [
        { month: '2025-5', sales: 7000000, expenses: 3000000, profit: 4000000 },
        { month: '2025-4', sales: 8000000, expenses: 3500000, profit: 4500000 },
        { month: '2025-3', sales: 6000000, expenses: 2000000, profit: 4000000 },
        { month: '2025-2', sales: 8000000, expenses: 4000000, profit: 4000000 },
    ];

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
                                data={banyakPenjualan}
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
                                <th className="border px-4 py-3 text-center font-semibold">Keuntungan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {financialData.map((item, idx) => (
                                <tr key={idx} className="text-center even:bg-gray-100">
                                    <td className="border px-4 py-2">{item.month}</td>
                                    <td className="border px-4 py-2">{formatCurrency(item.sales)}</td>
                                    <td className="border px-4 py-2">{formatCurrency(item.expenses)}</td>
                                    <td className="border px-4 py-2">{formatCurrency(item.profit)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerLaporanPenjualan;
