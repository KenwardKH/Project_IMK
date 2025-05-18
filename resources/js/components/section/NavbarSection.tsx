import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/react';
import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';

export function NavbarSection() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { title: 'Home', href: '/' },
        { title: 'Products', href: '#produk' },
        { title: 'Contacts', href: '#footer' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#f6f6f6] py-2 shadow-sm">
            <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/">
                    <img src="/images/logo_apk.png" alt="Logo" className="h-10 w-auto" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link, i) => (
                        <Link key={i} href={link.href} className="text-sm font-medium text-gray-700 transition hover:text-green-700">
                            {link.title}
                        </Link>
                    ))}
                </div>

                {/* Search Bar (Desktop) */}
                <div className="relative hidden w-80 md:block">
                    <Input
                        placeholder="Cari alat tulis..."
                        className="h-10 w-full rounded-md border-none bg-gray-200 px-4 pr-10 text-sm text-gray-800 placeholder:text-gray-500"
                    />

                    <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>

                {/* Cart & Auth */}
                <div className="hidden items-center gap-4 md:flex">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-full text-gray-700 transition-colors duration-200 hover:bg-green-100 hover:text-green-800 focus:ring-2 focus:ring-green-500 focus:outline-none hover:border"
                        aria-label="Keranjang Belanja"
                    >
                        <ShoppingCart className="h-5 w-5" />
                    </Button>

                    <Separator orientation="vertical" className="h-6" />
                    <Link href="/login">
                        <Button variant="outline" className="bg-white text-sm font-semibold text-green-700 hover:bg-green-800">
                            Masuk
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="bg-green-700 text-sm font-semibold text-white hover:border hover:bg-white hover:text-green-700">
                            Daftar
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X className="h-6 w-6 text-[#1f1f1f]" /> : <Menu className="h-6 w-6 text-[#1f1f1f]" />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="px-4 pb-4 md:hidden">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link, i) => (
                            <Link key={i} href={link.href} className="text-gray-700 transition hover:text-green-700">
                                {link.title}
                            </Link>
                        ))}
                        <div className="relative mt-3">
                            <Input placeholder="Cari alat tulis..." className="h-10 w-full rounded-md bg-gray-100 px-4 pr-10 text-sm" />
                            <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        </div>
                        <div className="mt-4 flex gap-3">
                            <Link href="/login" className="flex-1">
                                <Button variant="outline" className="w-full text-sm font-semibold text-green-700">
                                    Masuk
                                </Button>
                            </Link>
                            <Link href="/register" className="flex-1">
                                <Button className="w-full bg-green-700 text-sm font-semibold text-white hover:bg-green-800">Daftar</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavbarSection;
