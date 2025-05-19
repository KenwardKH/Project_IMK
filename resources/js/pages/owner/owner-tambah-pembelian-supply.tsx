import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { FiArrowLeftCircle } from 'react-icons/fi';

const OwnerTambahPembelianSupply = () => {
    interface supplierOptions {
        value: number;
        label: string;
    }

    const supplierOptions: supplierOptions[] = [
        { value: 1, label: 'ATK Medan Jaya' },
        { value: 2, label: 'PT Perkasa Maju' },
        { value: 3, label: 'PT Indra Makmur' },
        { value: 4, label: 'ATK Cahaya Abadi' },
    ];

    interface ProdukRow {
        produk: string;
        jumlah: string;
        harga: string;
        diskon: string;
    }

    const initialRow: ProdukRow = {
        produk: '',
        jumlah: '',
        harga: '',
        diskon: '',
    };

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const [gambar_invoice, setGambarInvoice] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setGambarInvoice(file);

        if (file) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setIsLoading(false);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
            setIsLoading(false);
        }
    };

    const [rows, setRows] = useState([initialRow]);

    const handleChange = (index: number, field: keyof ProdukRow, value: string) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    const handleAddRow = () => {
        setRows([...rows, initialRow]);
    };

    const handleDeleteRow = (index: number) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    const calculateSubtotal = (row: ProdukRow): number => {
        const jumlah = parseFloat(row.jumlah) || 0;
        const harga = parseFloat(row.harga) || 0;
        return jumlah * harga;
    };

    const hitungDiskonBerlapis = (harga: number, jumlah: number, diskon: string | number): number => {
        let total = harga * jumlah;

        if (typeof diskon === 'number') {
            total -= total * (diskon / 100);
        } else {
            const diskonList = diskon
                .split('+')
                .map((d) => parseFloat(d.trim()))
                .filter((d) => !isNaN(d));

            for (const d of diskonList) {
                total -= total * (d / 100);
            }
        }

        return total;
    };

    const calculateTotal = (row: ProdukRow): number => {
        const jumlah = parseFloat(row.jumlah) || 0;
        const harga = parseFloat(row.harga) || 0;
        const diskon = row.diskon;
        return hitungDiskonBerlapis(harga, jumlah, diskon);
    };

    const grandTotal = rows.reduce((acc, row) => acc + calculateTotal(row), 0);

    return (
        <OwnerLayout>
            <div className="flex justify-center py-8 text-black">
                <div className="mx-auto w-15/17 rounded-lg bg-white p-6 shadow-md">
                    <Link href="/owner-pembelian-supply" className="mb-4 inline-block text-blue-600 hover:underline">
                        <FiArrowLeftCircle size={50} className="text-black" />
                    </Link>

                    <h1 className="mb-6 text-center text-2xl font-bold">Tambah Supply</h1>

                    <form className="space-y-4">
                        <div>
                            <label className="mb-1 block font-semibold">Nama Supplier</label>
                            <select
                                name=""
                                id=""
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">Pilih Supplier</option>
                                {supplierOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Tanggal Supply</label>
                            <input
                                type="date"
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Tanggal Supply"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Nomor Invoice</label>
                            <input
                                type="text"
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nomor Invoice"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">{preview ? 'Preview Gambar Invoice' : 'Unggah Gambar Invoice'}</label>
                            {isLoading ? (
                                <div className="flex justify-center">
                                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                                </div>
                            ) : preview ? (
                                <div className="relative mx-auto w-full max-w-xs">
                                    <img src={preview} alt="Preview" className="rounded-md border shadow-md" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreview(null);
                                            setGambarInvoice(null);
                                        }}
                                        className="absolute top-1 right-1 h-10 w-10 rounded-full border-2 border-red-500 bg-white p-1 text-red-500 shadow hover:cursor-pointer hover:bg-red-100"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div className="relative cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-500">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 cursor-pointer opacity-0"
                                    />
                                    <div>
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M14 22l10-10 10 10m-10 14V12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-600">
                                            <span className="font-medium text-blue-600">Klik untuk upload</span> atau tarik gambar ke sini
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Produk yang dipesan</label>
                            <div className="space-y-2">
                                <div className="overflow-x-auto">
                                    <table className="w-full table-fixed border text-sm">
                                        <thead className="bg-gray-100 text-left font-semibold">
                                            <tr>
                                                <th className="w-3/15 border px-2 py-1">Produk</th>
                                                <th className="w-1.5/15 border px-2 py-1">Jumlah</th>
                                                <th className="w-2/15 border px-2 py-1">Harga Beli (per satuan)</th>
                                                <th className="w-3/15 border px-2 py-1">Subtotal</th>
                                                <th className="w-1.5/15 border px-2 py-1">Diskon</th>
                                                <th className="w-3/15 border px-2 py-1">Total (setelah diskon)</th>
                                                <th className="w-1/15 border px-2 py-1 text-center">Hapus</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, index) => (
                                                <tr key={index}>
                                                    <td className="w-1/15 border px-2 py-1">
                                                        <select
                                                            className="w-full rounded border p-1"
                                                            value={row.produk}
                                                            onChange={(e) => handleChange(index, 'produk', e.target.value)}
                                                        >
                                                            <option value="">Pilih Produk</option>
                                                            <option value="1">Pensil 2B</option>
                                                            <option value="2">Buku Tulis</option>
                                                            <option value="3">Kertas A4</option>
                                                            <option value="4">Spidol Snowman Merah</option>
                                                        </select>
                                                    </td>
                                                    <td className="w-1/15 border px-2 py-1">
                                                        <input
                                                            type="number"
                                                            className="w-full rounded border p-1"
                                                            value={row.jumlah}
                                                            onChange={(e) => handleChange(index, 'jumlah', e.target.value)}
                                                            min="1"
                                                            max="10000"
                                                            onInput={(e) => {
                                                                if (e.target.value.length > 5) {
                                                                    e.target.value = e.target.value.slice(0, 5); // maksimal 5 digit
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="w-1/15 border px-2 py-1">
                                                        <input
                                                            type="number"
                                                            className="w-full rounded border p-1"
                                                            value={row.harga}
                                                            onChange={(e) => handleChange(index, 'harga', e.target.value)}
                                                            min="1"
                                                            max="1000000000"
                                                            onInput={(e) => {
                                                                if (e.target.value.length > 10) {
                                                                    e.target.value = e.target.value.slice(0, 10); // maksimal 12 digit
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="w-2/15 border px-2 py-1 text-right">
                                                        {formatCurrency(parseInt(calculateSubtotal(row).toFixed(2)))}
                                                    </td>
                                                    <td className="w-1/15 border px-2 py-1">
                                                        <input
                                                            type="text"
                                                            className="w-full rounded border p-1"
                                                            value={row.diskon}
                                                            onChange={(e) => handleChange(index, 'diskon', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="w-2/15 border px-2 py-1 text-right">
                                                        {formatCurrency(parseInt(calculateTotal(row).toFixed(2)))}
                                                    </td>
                                                    <td className="w-1/15 border px-2 py-1 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteRow(index)}
                                                            className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <button
                                        type="button"
                                        onClick={handleAddRow}
                                        className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 hover:cursor-pointer"
                                    >
                                        + Tambah Produk
                                    </button>

                                    <div className="text-right font-semibold text-gray-700 text-xl">
                                        Total: <span className="text-green-600">{formatCurrency(parseInt(grandTotal.toFixed(2)))}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="mt-4 w-full rounded bg-[#009a00] px-4 py-2 font-bold text-white hover:bg-green-700 hover:cursor-pointer">
                            Simpan Pesanan
                        </Button>
                    </form>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerTambahPembelianSupply;
