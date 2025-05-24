import NavbarSection from '@/components/section/NavbarSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Filter, Grid, List, Search, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

// Sample data sesuai dengan struktur yang diminta
const sampleProducts = [
    {
        ProductID: 1,
        ProductName: 'Pulpen Pilot G2 0.7mm',
        Description: 'Pulpen gel dengan tinta halus dan nyaman untuk menulis',
        ProductUnit: 'Pcs',
        CurrentStock: 150,
        ProductPrice: 15000,
        image: '/images/buku_campus.jpeg',
    },
    {
        ProductID: 2,
        ProductName: 'Kertas A4 80gsm',
        Description: 'Kertas putih berkualitas tinggi untuk keperluan kantor',
        ProductUnit: 'Rim',
        CurrentStock: 75,
        ProductPrice: 65000,
        image: '/images/buku_campus.jpeg',
    },
    {
        ProductID: 3,
        ProductName: 'Stabilo Boss Highlighter',
        Description: 'Stabilo warna-warni untuk menandai dokumen penting',
        ProductUnit: 'Set',
        CurrentStock: 40,
        ProductPrice: 45000,
        image: '/images/buku_campus.jpeg',
    },
    {
        ProductID: 4,
        ProductName: 'Stapler Kenko HD-10',
        Description: 'Stapler heavy duty untuk kebutuhan kantor sehari-hari',
        ProductUnit: 'Pcs',
        CurrentStock: 25,
        ProductPrice: 35000,
        image: '/images/buku_campus.jpeg',
    },
    {
        ProductID: 5,
        ProductName: 'Amplop Coklat Folio',
        Description: 'Amplop coklat ukuran folio untuk surat resmi',
        ProductUnit: 'Pack',
        CurrentStock: 60,
        ProductPrice: 25000,
        image: '/images/buku_campus.jpeg',
    },
    {
        ProductID: 6,
        ProductName: 'Binder Clip 32mm',
        Description: 'Penjepit kertas ukuran sedang untuk dokumen',
        ProductUnit: 'Box',
        CurrentStock: 80,
        ProductPrice: 18000,
        image: '/images/buku_campus.jpeg',
    },
    {
        ProductID: 7,
        ProductName: 'Correction Tape Joyko',
        Description: 'Tip-ex tape untuk koreksi tulisan dengan rapi',
        ProductUnit: 'Pcs',
        CurrentStock: 90,
        ProductPrice: 12000,
        image: '/images/buku_campus.jpeg',
    },
    {
        ProductID: 8,
        ProductName: 'Post-it Notes 3x3',
        Description: 'Kertas catatan tempel untuk reminder dan notes',
        ProductUnit: 'Pack',
        CurrentStock: 120,
        ProductPrice: 28000,
        image: '/images/buku_campus.jpeg',
    },
    {
        ProductID: 9,
        ProductName: 'Penggaris Plastik 30cm',
        Description: 'Penggaris transparan dengan skala yang jelas',
        ProductUnit: 'Pcs',
        CurrentStock: 45,
        ProductPrice: 8000,
        image: '/images/buku_campus.jpeg',
    },
    {
        ProductID: 10,
        ProductName: 'Lem Kertas UHU Stick',
        Description: 'Lem batang praktis untuk menempel kertas',
        ProductUnit: 'Pcs',
        CurrentStock: 65,
        ProductPrice: 22000,
        image: '/images/buku_campus.jpeg',
    },
];

type Product = {
    ProductID: string;
    ProductName: string;
    ProductPrice: number;
    ProductUnit: string;
    Description: string;
    CurrentStock: number;
    image: string;
};

const ProductsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const itemsPerPage = 6;

    const { search } = usePage().props as { search?: string };
    const products = usePage().props.products as Product[];
    const dataSource: Product[] = products ?? sampleProducts;

    const filteredProducts = useMemo(() => {
        let filtered = dataSource.filter((product) => {
            const matchesSearch = product.ProductName.toLowerCase().includes(searchTerm.toLowerCase());

            const price = product.ProductPrice;
            const max = maxPrice !== '' ? parseFloat(maxPrice) : null;
            const min = minPrice !== '' ? Number(minPrice) : null;

            const matchesMin = min !== null ? price >= min : true;
            const matchesMax = max === null || (!isNaN(max) && max >= 0 && price <= max);

            let matchesStock = true;
            if (stockFilter === 'low') matchesStock = product.CurrentStock < 50;
            else if (stockFilter === 'medium') matchesStock = product.CurrentStock >= 50 && product.CurrentStock <= 100;
            else if (stockFilter === 'high') matchesStock = product.CurrentStock > 100;

            return matchesSearch && matchesMin && matchesMax && matchesStock;
        });

        if (priceFilter === 'asc') {
            filtered.sort((a, b) => a.ProductPrice - b.ProductPrice);
        } else if (priceFilter === 'desc') {
            filtered.sort((a, b) => b.ProductPrice - a.ProductPrice);
        }

        return filtered;
    }, [searchTerm, priceFilter, minPrice, maxPrice, stockFilter]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    useEffect(()=>{
        if (search) {
            setSearchTerm(search);
          }
    }, [])

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, priceFilter, stockFilter]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setPriceFilter('');
        setMinPrice('');
        setMaxPrice('');
        setStockFilter('all');
    };

    const getStockBadgeVariant = (stock: number) => {
        // if (stock < 50) return 'destructive';
        // if (stock < 100) return 'secondary';
        return 'secondary';
    };

    const getStockLabel = (stock: number) => {
        //     if (stock < 50) return 'Stok Rendah';
        //     if (stock < 100) return 'Stok Sedang';
        return 'Stok Tersedia';
    };

    return (
        <>
            <NavbarSection />
            <div className="bg-background my-6 min-h-screen p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="mb-2 text-3xl font-bold">Katalog Produk</h1>
                        <p className="text-muted-foreground">Temukan alat tulis kantor berkualitas untuk kebutuhan Anda</p>
                    </div>

                    {/* Search and Filter Card */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            {/* Search Bar */}
                            <div className="relative mb-6">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                                <Input
                                    placeholder="Cari produk berdasarkan nama..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Filter Controls */}
                            <div className="mb-4 flex items-center justify-between">
                                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filter Produk
                                    {(priceFilter !== '' || stockFilter !== 'all') && (
                                        <Badge variant="secondary" className="ml-2">
                                            {(priceFilter !== '' ? 1 : 0) + (stockFilter !== 'all' ? 1 : 0)}
                                        </Badge>
                                    )}
                                </Button>

                                <div className="flex gap-2">
                                    <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Filter Options */}
                            {showFilters && (
                                <>
                                    <Separator className="mb-4" />
                                    <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
                                        {/* Urutkan Harga */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Urutkan Harga</label>
                                            <Select value={priceFilter} onValueChange={setPriceFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Urutkan berdasarkan harga" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="asc">Harga Terendah</SelectItem>
                                                    <SelectItem value="desc">Harga Tertinggi</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* <div className="space-y-2">
                                            <label className="text-sm font-medium">Filter Stok</label>
                                            <Select value={stockFilter} onValueChange={setStockFilter}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua Stok</SelectItem>
                                                    <SelectItem value="low">Stok Rendah (&lt; 50)</SelectItem>
                                                    <SelectItem value="medium">Stok Sedang (50-100)</SelectItem>
                                                    <SelectItem value="high">Stok Tinggi (&gt; 100)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div> */}

                                        {/* Harga Minimum */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Harga Minimum</label>
                                            <div className="relative">
                                                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-500">Rp</span>
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    className="pl-10"
                                                    placeholder="Minimal"
                                                    value={minPrice}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        if (!/^\d*$/.test(raw)) return;
                                                        if (raw.length > 1 && raw.startsWith('0')) return;
                                                        const val = parseInt(raw, 10);
                                                        if (val > 1000000) return;
                                                        setMinPrice(raw);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Harga Maksimum */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Harga Maksimum</label>
                                            <div className="relative">
                                                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-500">Rp</span>
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    className="pl-10"
                                                    placeholder="Maksimal"
                                                    value={maxPrice}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        if (!/^\d*$/.test(raw)) return;
                                                        if (raw.length > 1 && raw.startsWith('0')) return;
                                                        const val = parseInt(raw, 10);
                                                        if (val > 1000000) return;
                                                        setMaxPrice(raw);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Tombol Hapus Filter */}
                                        <div className="flex justify-end pb-1">
                                            <Button onClick={clearFilters} className="w-full gap-2 bg-red-500 text-white hover:bg-red-600 md:w-auto">
                                                <X className="h-4 w-4" />
                                                Hapus Filter
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Results Info */}
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-muted-foreground">
                            Menampilkan {currentProducts.length} dari {filteredProducts.length} produk
                        </p>
                    </div>

                    {/* Products Display */}
                    {filteredProducts.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Search className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                                <h3 className="mb-2 text-lg font-medium">Produk tidak ditemukan</h3>
                                <p className="text-muted-foreground mb-4">Coba ubah kata kunci pencarian atau filter yang digunakan</p>
                                <Button onClick={clearFilters}>Reset Pencarian</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {currentProducts.map((product) => (
                                        <Link
                                            key={product.ProductID}
                                            href={`/product/${product.ProductID}`}
                                            className="block rounded-lg border shadow transition hover:shadow-lg"
                                        >
                                            <Card key={product.ProductID} className="overflow-hidden transition-shadow hover:shadow-lg">
                                                <div className="bg-muted aspect-square overflow-hidden">
                                                    <img
                                                        src={`storage/${product.image}`}
                                                        alt={product.ProductName}
                                                        className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                                                    />
                                                </div>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="line-clamp-1">{product.ProductName}</CardTitle>
                                                    <CardDescription className="line-clamp-2">
                                                        {' '}
                                                        {product.Description.length > 40
                                                            ? `${product.Description.slice(0, 42)}...`
                                                            : product.Description}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground text-sm">Stok:</span>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={getStockBadgeVariant(product.CurrentStock)} className="text-xs">
                                                                {getStockLabel(product.CurrentStock)}
                                                            </Badge>
                                                            <span className="text-sm font-medium">
                                                                {product.CurrentStock} {product.ProductUnit}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-price text-2xl font-bold">{formatPrice(product.ProductPrice)}</span>
                                                        <span className="text-muted-foreground text-xs">per {product.ProductUnit}</span>
                                                    </div>
                                                </CardContent>
                                                <CardFooter>
                                                    <Button className="w-full bg-[#153e98] hover:bg-[#0f2e73]">Tambah ke Keranjang</Button>
                                                </CardFooter>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="mb-8 space-y-4">
                                    {currentProducts.map((product) => (
                                        <Link
                                            key={product.ProductID}
                                            href={`/product/${product.ProductID}`}
                                            className="block rounded-lg border shadow transition hover:shadow-lg"
                                        >
                                            <Card>
                                                <CardContent className="p-4">
                                                    <div className="flex gap-4">
                                                        <div className="bg-muted h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                                                            <img
                                                                src={product.image}
                                                                alt={product.ProductName}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="mb-2 flex items-start justify-between">
                                                                <h3 className="font-semibold">{product.ProductName}</h3>
                                                                <span className="text-primary text-xl font-bold">
                                                                    {formatPrice(product.ProductPrice)}
                                                                </span>
                                                            </div>
                                                            <p className="text-muted-foreground mb-3 text-sm">{product.Description}</p>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant={getStockBadgeVariant(product.CurrentStock)}>
                                                                        {getStockLabel(product.CurrentStock)}
                                                                    </Badge>
                                                                    <span className="text-sm">
                                                                        {product.CurrentStock} {product.ProductUnit}
                                                                    </span>
                                                                </div>
                                                                <Button>Tambah ke Keranjang</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductsPage;
