import OwnerLayout from '@/components/owner/owner-layout';
import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';

const OwnerTambahPembelianSupply = ({ suppliers, products }) => {
    // Form state using Inertia useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        supplier_id: '',
        tanggal_supply: '',
        nomor_invoice: '',
        gambar_invoice: null,
        produk: [
            {
                product_id: '',
                produk_name: '',
                jumlah: '',
                harga: '',
                diskon: '',
                unit: ''
            }
        ]
    });

    // UI State
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchInputs, setSearchInputs] = useState([""]);
    const [dropdownOpen, setDropdownOpen] = useState([false]);
    const [filteredProducts, setFilteredProducts] = useState([[]]);
    const dropdownRefs = useRef([]);
    const searchInputRefs = useRef([]);

    // Initialize dropdown refs and position state
    const [dropdownPositions, setDropdownPositions] = useState([]);

    // Initialize dropdown refs
    useEffect(() => {
        dropdownRefs.current = Array(data.produk.length).fill().map((_, i) => dropdownRefs.current[i] || React.createRef());
        searchInputRefs.current = Array(data.produk.length).fill().map((_, i) => searchInputRefs.current[i] || React.createRef());
        
        // Calculate positions for each dropdown
        updateDropdownPositions();
    }, [data.produk.length]);
    
    // Function to update dropdown positions
    const updateDropdownPositions = () => {
        setTimeout(() => {
            const newPositions = dropdownRefs.current.map(ref => {
                if (ref.current) {
                    const rect = ref.current.getBoundingClientRect();
                    return {
                        left: rect.left,
                        top: rect.bottom,
                        width: ref.current.offsetWidth
                    };
                }
                return null;
            });
            setDropdownPositions(newPositions);
        }, 0);
    };

    // Handle outside click to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            dropdownRefs.current.forEach((ref, index) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    setDropdownOpen(prev => {
                        const newState = [...prev];
                        newState[index] = false;
                        return newState;
                    });
                }
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Filter products based on search input
    useEffect(() => {
        const newFilteredProducts = searchInputs.map(search => {
            if (!search.trim()) return [];
            const searchLower = search.toLowerCase();
            return products.filter(product => 
                product.ProductName.toLowerCase().includes(searchLower)
            ).slice(0, 10); // Limit to 10 results
        });
        setFilteredProducts(newFilteredProducts);
    }, [searchInputs, products]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setData('gambar_invoice', file);

        if (file) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setIsLoading(false);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
            setIsLoading(false);
        }
    };

    const handleChange = (index, field, value) => {
        const updatedProduk = [...data.produk];
        updatedProduk[index][field] = value;
        setData('produk', updatedProduk);
    };

    const handleProductSearch = (index, value) => {
        const newSearchInputs = [...searchInputs];
        newSearchInputs[index] = value;
        setSearchInputs(newSearchInputs);
        
        // Always open dropdown when typing and there are search results
        const newDropdownOpen = [...dropdownOpen];
        newDropdownOpen[index] = true;
        setDropdownOpen(newDropdownOpen);
        
        // Update the display name in the form
        const updatedProduk = [...data.produk];
        updatedProduk[index].produk_name = value;
        setData('produk', updatedProduk);
        
        // Update dropdown positions
        updateDropdownPositions();
    };

    const handleProductSelect = (index, product) => {
        const updatedProduk = [...data.produk];
        updatedProduk[index].product_id = product.ProductID;
        updatedProduk[index].produk_name = product.ProductName;
        updatedProduk[index].unit = product.ProductUnit;
        setData('produk', updatedProduk);
        
        // Close dropdown and update search input
        const newSearchInputs = [...searchInputs];
        newSearchInputs[index] = product.ProductName;
        setSearchInputs(newSearchInputs);
        
        const newDropdownOpen = [...dropdownOpen];
        newDropdownOpen[index] = false;
        setDropdownOpen(newDropdownOpen);
        
        // Focus on the quantity field after selecting a product
        const nextRow = document.querySelector(`input[name="jumlah-${index}"]`);
        if (nextRow) nextRow.focus();
    };

    const handleFocusSearch = (index) => {
        // Open dropdown when input is focused if there's text
        if (searchInputs[index] && searchInputs[index].trim() !== '') {
            const newDropdownOpen = [...dropdownOpen];
            newDropdownOpen[index] = true;
            setDropdownOpen(newDropdownOpen);
            
            // Update dropdown positions
            updateDropdownPositions();
        }
    };

    const handleAddRow = () => {
        setData('produk', [
            ...data.produk,
            {
                product_id: '',
                produk_name: '',
                jumlah: '',
                harga: '',
                diskon: '',
                unit: ''
            }
        ]);
        
        // Update UI state arrays
        setSearchInputs([...searchInputs, ""]);
        setDropdownOpen([...dropdownOpen, false]);
        setFilteredProducts([...filteredProducts, []]);
        
        // Focus on the new search input after adding a row
        setTimeout(() => {
            const lastIndex = data.produk.length;
            if (searchInputRefs.current[lastIndex] && searchInputRefs.current[lastIndex].current) {
                searchInputRefs.current[lastIndex].current.focus();
            }
        }, 100);
    };

    const handleDeleteRow = (index) => {
        const updatedProduk = data.produk.filter((_, i) => i !== index);
        setData('produk', updatedProduk);
        
        // Update UI state arrays
        const newSearchInputs = searchInputs.filter((_, i) => i !== index);
        const newDropdownOpen = dropdownOpen.filter((_, i) => i !== index);
        const newFilteredProducts = filteredProducts.filter((_, i) => i !== index);
        
        setSearchInputs(newSearchInputs);
        setDropdownOpen(newDropdownOpen);
        setFilteredProducts(newFilteredProducts);
    };

    const calculateSubtotal = (row) => {
        const jumlah = parseFloat(row.jumlah) || 0;
        const harga = parseFloat(row.harga) || 0;
        return jumlah * harga;
    };

    const hitungDiskonBerlapis = (harga, jumlah, diskon) => {
        let total = harga * jumlah;

        if (!diskon) return total;

        const diskonList = diskon
            .split('+')
            .map((d) => parseFloat(d.trim()))
            .filter((d) => !isNaN(d));

        for (const d of diskonList) {
            total -= total * (d / 100);
        }

        return total;
    };

    const calculateTotal = (row) => {
        const jumlah = parseFloat(row.jumlah) || 0;
        const harga = parseFloat(row.harga) || 0;
        const diskon = row.diskon;
        return hitungDiskonBerlapis(harga, jumlah, diskon);
    };

    const grandTotal = data.produk.reduce((acc, row) => acc + calculateTotal(row), 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('owner.pembelian.supply.store'), {
            onSuccess: () => {
                reset();
                setPreview(null);
            }
        });
    };

    // Handle keyboard navigation within product search
    const handleKeyDown = (e, index) => {
        if (e.key === 'ArrowDown' && dropdownOpen[index] && filteredProducts[index].length > 0) {
            e.preventDefault();
            // Get the first dropdown item and focus it
            const dropdownItems = dropdownRefs.current[index].current.querySelectorAll('.dropdown-item');
            if (dropdownItems.length > 0) {
                dropdownItems[0].focus();
            }
        } else if (e.key === 'Escape') {
            // Close dropdown on Escape
            const newDropdownOpen = [...dropdownOpen];
            newDropdownOpen[index] = false;
            setDropdownOpen(newDropdownOpen);
        } else if (e.key === 'Enter' && dropdownOpen[index] && filteredProducts[index].length > 0) {
            // Select first item on Enter if dropdown is open
            e.preventDefault();
            handleProductSelect(index, filteredProducts[index][0]);
        }
    };

    // Handle keyboard navigation within dropdown
    const handleDropdownKeyDown = (e, index, productIndex) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const dropdownItems = dropdownRefs.current[index].current.querySelectorAll('.dropdown-item');
            const nextIndex = (productIndex + 1) % dropdownItems.length;
            if (dropdownItems[nextIndex]) {
                dropdownItems[nextIndex].focus();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const dropdownItems = dropdownRefs.current[index].current.querySelectorAll('.dropdown-item');
            const prevIndex = (productIndex - 1 + dropdownItems.length) % dropdownItems.length;
            if (productIndex === 0) {
                // Go back to search input if at the first item
                if (searchInputRefs.current[index].current) {
                    searchInputRefs.current[index].current.focus();
                }
            } else if (dropdownItems[prevIndex]) {
                dropdownItems[prevIndex].focus();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleProductSelect(index, filteredProducts[index][productIndex]);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            const newDropdownOpen = [...dropdownOpen];
            newDropdownOpen[index] = false;
            setDropdownOpen(newDropdownOpen);
            if (searchInputRefs.current[index].current) {
                searchInputRefs.current[index].current.focus();
            }
        }
    };

    return (
        <OwnerLayout>
            <div className="flex justify-center py-8 text-black">
                <div className="mx-auto w-15/17 rounded-lg bg-white p-6 shadow-md">
                    <Link href="/owner-pembelian-supply" className="mb-4 inline-block text-blue-600 hover:underline">
                        <FiArrowLeftCircle size={50} className="text-black" />
                    </Link>

                    <h1 className="mb-6 text-center text-2xl font-bold">Tambah Supply</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block font-semibold">Nama Supplier</label>
                            <select
                                value={data.supplier_id}
                                onChange={(e) => setData('supplier_id', e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">Pilih Supplier</option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier.SupplierID} value={supplier.SupplierID}>
                                        {supplier.SupplierName}
                                    </option>
                                ))}
                            </select>
                            {errors.supplier_id && <div className="text-red-500 text-sm mt-1">{errors.supplier_id}</div>}
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Tanggal Supply</label>
                            <input
                                type="date"
                                value={data.tanggal_supply}
                                onChange={(e) => setData('tanggal_supply', e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.tanggal_supply && <div className="text-red-500 text-sm mt-1">{errors.tanggal_supply}</div>}
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold">Nomor Invoice (Opsional)</label>
                            <input
                                type="text"
                                value={data.nomor_invoice}
                                onChange={(e) => setData('nomor_invoice', e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nomor Invoice (opsional)"
                            />
                            {errors.nomor_invoice && <div className="text-red-500 text-sm mt-1">{errors.nomor_invoice}</div>}
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
                                            setData('gambar_invoice', null);
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
                            {errors.gambar_invoice && <div className="text-red-500 text-sm mt-1">{errors.gambar_invoice}</div>}
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
                                            {data.produk.map((row, index) => (
                                                <tr key={index}>
                                                    <td className="w-1/15 border px-2 py-1">
                                                        <div className="relative" ref={dropdownRefs.current[index]}>
                                                            <div className="flex items-center border rounded overflow-hidden">
                                                                <input
                                                                    type="text"
                                                                    ref={searchInputRefs.current[index]}
                                                                    value={searchInputs[index] || ''}
                                                                    onChange={(e) => handleProductSearch(index, e.target.value)}
                                                                    onFocus={() => handleFocusSearch(index)}
                                                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                                                    className="w-full p-1 outline-none"
                                                                    placeholder="Cari produk..."
                                                                    autoComplete="off"
                                                                />
                                                                <div className="px-2 text-gray-500">
                                                                    <FaSearch />
                                                                </div>
                                                            </div>
                                                            
                                                            {dropdownOpen[index] && filteredProducts[index] && filteredProducts[index].length > 0 && (
                                                                <div className="fixed shadow-lg max-h-60 overflow-y-auto" 
                                                                    style={{ 
                                                                        zIndex: 9999, 
                                                                        backgroundColor: 'white',
                                                                        border: '1px solid #ccc',
                                                                        borderRadius: '4px',
                                                                        left: dropdownPositions[index]?.left + 'px', 
                                                                        top: dropdownPositions[index]?.top + 'px', 
                                                                        width: dropdownPositions[index]?.width + 'px' 
                                                                    }}>
                                                                    {filteredProducts[index].map((product, productIndex) => (
                                                                        <div
                                                                            key={product.ProductID}
                                                                            className="p-2 hover:bg-gray-100 cursor-pointer dropdown-item"
                                                                            onClick={() => handleProductSelect(index, product)}
                                                                            onKeyDown={(e) => handleDropdownKeyDown(e, index, productIndex)}
                                                                            tabIndex="0"
                                                                        >
                                                                            <div className="font-medium">{product.ProductName}</div>
                                                                            <div className="text-xs text-gray-500">
                                                                                Stok: {product.CurrentStock || 0} {product.ProductUnit}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {errors[`produk.${index}.product_id`] && (
                                                                <div className="text-red-500 text-xs mt-1">
                                                                    {errors[`produk.${index}.product_id`]}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="w-1/15 border px-2 py-1">
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="number"
                                                                name={`jumlah-${index}`}
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
                                                            {row.unit && (
                                                                <span className="flex items-center text-gray-600 text-sm">
                                                                    {row.unit}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {errors[`produk.${index}.jumlah`] && 
                                                            <div className="text-red-500 text-xs">{errors[`produk.${index}.jumlah`]}</div>
                                                        }
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
                                                                    e.target.value = e.target.value.slice(0, 10); // maksimal 10 digit
                                                                }
                                                            }}
                                                        />
                                                        {errors[`produk.${index}.harga`] && 
                                                            <div className="text-red-500 text-xs">{errors[`produk.${index}.harga`]}</div>
                                                        }
                                                    </td>
                                                    <td className="w-2/15 border px-2 py-1 text-right">
                                                        {formatCurrency(calculateSubtotal(row))}
                                                    </td>
                                                    <td className="w-1/15 border px-2 py-1">
                                                        <input
                                                            type="text"
                                                            className="w-full rounded border p-1"
                                                            value={row.diskon}
                                                            onChange={(e) => handleChange(index, 'diskon', e.target.value)}
                                                            placeholder="10+5+2"
                                                        />
                                                        {errors[`produk.${index}.diskon`] && 
                                                            <div className="text-red-500 text-xs">{errors[`produk.${index}.diskon`]}</div>
                                                        }
                                                    </td>
                                                    <td className="w-2/15 border px-2 py-1 text-right">
                                                        {formatCurrency(calculateTotal(row))}
                                                    </td>
                                                    <td className="w-1/15 border px-2 py-1 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteRow(index)}
                                                            disabled={data.produk.length === 1}
                                                            className={`rounded ${
                                                                data.produk.length === 1 
                                                                ? 'bg-gray-400' 
                                                                : 'bg-red-500 hover:bg-red-600'
                                                            } px-2 py-1 text-white`}
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
                                        Total: <span className="text-green-600">{formatCurrency(grandTotal)}</span>
                                    </div>
                                </div>
                            </div>
                            {errors.produk && <div className="text-red-500 text-sm mt-1">{errors.produk}</div>}
                        </div>

                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="mt-4 w-full rounded bg-[#009a00] px-4 py-2 font-bold text-white hover:bg-green-700 hover:cursor-pointer"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Pesanan'}
                        </Button>
                    </form>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerTambahPembelianSupply;