import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, usePage } from '@inertiajs/react';
import { LogOut, Menu, PackageSearch, Search, ShoppingCart, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type PageProps = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
};

interface NavbarProps {
    isDropdownOpen: boolean;
    setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavbarSection({ isDropdownOpen, setIsDropdownOpen }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;
    const currentUrl = usePage().url;

    const navLinks = [
        { title: 'Beranda', href: '/' },
        { title: 'Produk', href: '/products' },
        { title: 'Kontak', href: '/contact' },
    ];

    // Simulasi loading user
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setIsLoadingUser(false), 300);
        return () => clearTimeout(timeout);
    }, []);

    const getUserInitials = (name: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-gray-50 py-2 shadow-sm">
            <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-6">
                {/* Logo & Navigation */}
                <div className="flex items-center space-x-6">
                    <Link href="/">
                        <img src="/images/logo_apk.png" alt="Logo" className="h-10 w-auto" />
                    </Link>
                    <div className="hidden space-x-14 md:flex">
                        {navLinks.map((link, i) => {
                            const isActive = currentUrl === link.href || (link.href !== '/' && currentUrl.startsWith(link.href));
                            return (
                                <Link
                                    key={i}
                                    href={link.href}
                                    className={`text-sm font-medium transition ${
                                        isActive ? 'font-semibold text-green-700' : 'text-gray-700 hover:text-green-700'
                                    }`}
                                >
                                    {link.title}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop Cart & Auth */}
                <div className="hidden items-center gap-4 md:flex">
                    <Link href="/cart">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-11 w-11 rounded-full text-gray-700 hover:border hover:bg-green-100 hover:text-green-800 ${currentUrl === '/cart' ? 'border bg-green-100 text-green-800' : 'hover:border hover:bg-green-100 hover:text-green-800'}`}
                            aria-label="Keranjang Belanja"
                        >
                            <ShoppingCart className="h-[37px] w-[37px]" />
                        </Button>
                    </Link>
                    <Separator orientation="vertical" />

                    {isLoadingUser ? (
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ) : user ? (
                        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen} modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 text-green-700 hover:text-green-800"
                                    data-tour="avatar-button"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/images/default-avatar.png" alt="Avatar" />
                                        <AvatarFallback className="bg-green-100 font-bold text-green-800">
                                            {getUserInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-semibold">{user.name}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 rounded-xl border border-green-100 bg-white shadow-lg backdrop-blur-sm"
                                sideOffset={5}
                                onCloseAutoFocus={(e) => e.preventDefault()}
                                onPointerDownOutside={(e) => e.preventDefault()}
                                onInteractOutside={(e) => e.preventDefault()} // penting agar klik di luar tidak menutup menu
                            >
                                <div className="border-b border-green-50 px-3 py-2" id="dropdowntest">
                                    <p className="text-sm font-medium text-green-800">Menu Profil</p>
                                    <p className="text-xs text-green-600">Kelola akun Anda</p>
                                </div>

                                <DropdownMenuItem asChild className="cursor-pointer font-medium text-green-700 hover:bg-green-50 focus:bg-green-50">
                                    <Link href="/settings/profile" className="flex w-full items-center gap-3 py-3">
                                        <div className="rounded-lg bg-blue-100 p-1.5">
                                            <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">Pengaturan Profil</span>
                                            <span className="text-xs text-gray-500">Edit informasi pribadi</span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild className="cursor-pointer font-medium text-green-700 hover:bg-green-50 focus:bg-green-50">
                                    <Link href="/order/belum-bayar" className="flex w-full items-center gap-3 py-3">
                                        <div className="rounded-lg bg-amber-100 p-1.5">
                                            <PackageSearch className="h-4 w-4 text-amber-600" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">Pesanan Saya</span>
                                            <span className="text-xs text-gray-500">Lacak status pesanan</span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-green-100" />

                                <DropdownMenuItem asChild className="cursor-pointer font-medium hover:bg-red-50 focus:bg-red-50">
                                    <Link
                                        method="post"
                                        href="/logout"
                                        as="button"
                                        className="flex w-full items-center gap-3 py-3 text-red-600 hover:text-red-700"
                                        id="logoutdrop"
                                    >
                                        <div className="rounded-lg bg-red-100 p-1.5" id="buttonlogout">
                                            <LogOut className="h-4 w-4 text-red-500" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-left text-sm font-medium">Logout</span>
                                            <span className="text-xs text-red-400">Keluar dari akun</span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="outline" className="text-sm font-semibold text-green-700 hover:bg-green-800">
                                    Masuk
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-green-700 text-sm font-semibold text-white hover:bg-green-800">Daftar</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X className="h-6 w-6 text-[#1f1f1f]" /> : <Menu className="h-6 w-6 text-[#1f1f1f]" />}
                </button>
            </div>

            {/* Mobile Dropdown */}
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

                        {isLoadingUser ? (
                            <div className="mt-4 flex items-center gap-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-36" />
                                </div>
                            </div>
                        ) : user ? (
                            <div className="mt-4 flex flex-col gap-3 rounded-lg bg-green-50 p-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/images/default-avatar.png" alt="Avatar" />
                                        <AvatarFallback className="bg-green-100 font-bold text-green-800">
                                            {getUserInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-green-800">{user.name}</p>
                                        <p className="text-xs text-green-600">{user.email}</p>
                                    </div>
                                    <Link method="post" href="/logout" as="button" className="text-red-500 hover:text-red-600">
                                        <LogOut className="h-4 w-4" />
                                    </Link>
                                </div>

                                {/* Tambahan navigasi versi mobile */}
                                <div className="flex flex-col gap-2 text-sm">
                                    <Link
                                        href="/settings/profile"
                                        className="flex items-center gap-3 rounded-md bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                                    >
                                        <User className="h-4 w-4" />
                                        <div>
                                            <p className="font-medium">Pengaturan Profil</p>
                                            <p className="text-xs text-gray-500">Edit informasi pribadi</p>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/order/belum-bayar"
                                        className="flex items-center gap-3 rounded-md bg-amber-100 p-2 text-amber-700 hover:bg-amber-200"
                                    >
                                        <PackageSearch className="h-4 w-4" />
                                        <div>
                                            <p className="font-medium">Pesanan Saya</p>
                                            <p className="text-xs text-gray-500">Lacak status pesanan</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ) : (
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
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavbarSection;
