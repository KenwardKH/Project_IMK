import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, usePage } from '@inertiajs/react';
import { LogOut, Menu, PackageSearch, Search, ShoppingCart, User, X, ChevronRight, Home, Package, Phone, Settings, ShoppingBag, FileText, XCircle, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CgPassword } from 'react-icons/cg';

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

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
    isActive?: boolean;
}

export function NavbarSection({ isDropdownOpen, setIsDropdownOpen }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;
    const currentUrl = usePage().url;

    const navLinks = [
        { title: 'Beranda', href: '/', icon: Home },
        { title: 'Produk', href: '/products', icon: Package },
        { title: 'Kontak', href: '/contact', icon: Phone },
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

    // Generate breadcrumbs based on current URL
    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        const pathSegments = currentUrl.split('/').filter(segment => segment !== '');
        const breadcrumbs: BreadcrumbItem[] = [
            { label: 'Beranda', href: '/', icon: <Home className="h-4 w-4" /> }
        ];

        if (pathSegments.length === 0) {
            breadcrumbs[0].isActive = true;
            return breadcrumbs;
        }

const routeMap: Record<string, { label: string; icon: React.ReactNode; href?: string }> = {
    'products': { label: 'Produk', icon: <Package className="h-4 w-4" /> },
    'product': { label: 'Produk', icon: <Package className="h-4 w-4" />, href: '/products' }, // special case
    'contact': { label: 'Kontak', icon: <Phone className="h-4 w-4" /> },
    'cart': { label: 'Keranjang', icon: <ShoppingCart className="h-4 w-4" /> },
    'settings': { label: 'Pengaturan', icon: <Settings className="h-4 w-4" /> },
    'profile': { label: 'Profil', icon: <User className="h-4 w-4" /> },
    'password': { label: 'Password', icon: <CgPassword className="h-4 w-4" /> },
    'order': { label: 'Pesanan', icon: <ShoppingBag className="h-4 w-4" /> },
    'belum-bayar': { label: 'Belum Bayar', icon: <FileText className="h-4 w-4" /> },
    'menunggu-konfirmasi': { label: 'Menunggu Konfirmasi', icon: <Clock className="h-4 w-4" /> },
    'selesai': { label: 'Selesai', icon: <CheckCircle className="h-4 w-4" /> },
    'dibatalkan': { label: 'Dibatalkan', icon: <XCircle className="h-4 w-4" /> },
    'login': { label: 'Masuk', icon: <User className="h-4 w-4" /> },
    'register': { label: 'Daftar', icon: <User className="h-4 w-4" /> },
};

let currentPath = '';
pathSegments.forEach((segment, index) => {
    // Jika segment angka (misalnya ID), jangan tampilkan atau tampilkan sebagai "Detail"
    if (!isNaN(Number(segment))) {
        breadcrumbs.push({
            label: 'Detail Produk', // bisa juga disesuaikan jadi 'Detail Pesanan', dll
            isActive: true
        });
        return;
    }

    currentPath += `/${segment}`;
    const routeInfo = routeMap[segment];

    if (routeInfo) {
        breadcrumbs.push({
            label: routeInfo.label,
            href: index === pathSegments.length - 1 ? undefined : (routeInfo.href ?? currentPath),
            icon: routeInfo.icon,
            isActive: index === pathSegments.length - 1
        });
    } else {
        breadcrumbs.push({
            label: segment.charAt(0).toUpperCase() + segment.slice(1),
            href: index === pathSegments.length - 1 ? undefined : currentPath,
            isActive: index === pathSegments.length - 1
        });
    }
});


        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <>
            {/* Main Navigation */}
            <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-white to-gray-50 shadow-lg backdrop-blur-sm border-b border-gray-100 p-2">
                <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-6">
                    {/* Logo & Navigation */}
                    <div className="flex items-center space-x-6">
                        <Link href="/" className="transition-transform hover:scale-105">
                            <img src="/images/logo_apk.png" alt="Logo" className="h-10 w-auto drop-shadow-sm" />
                        </Link>
                        <div className="hidden space-x-8 md:flex">
                            {navLinks.map((link, i) => {
                                const isActive = currentUrl === link.href || (link.href !== '/' && currentUrl.startsWith(link.href));
                                const IconComponent = link.icon;
                                return (
                                    <Link
                                        key={i}
                                        href={link.href}
                                        className={`group flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'font-semibold text-green-700 border-b-2 border-green-600 pb-1'
                                                : 'text-gray-700 hover:text-green-700 hover:scale-105'
                                        }`}
                                    >
                                        <IconComponent className={`h-4 w-4 transition-transform ${!isActive && 'group-hover:scale-110'}`} />
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
                                className={`h-11 w-11 rounded-full transition-all duration-200 ${
                                    currentUrl === '/cart'
                                        ? 'border-2 border-green-600 bg-green-100 text-green-800 shadow-md'
                                        : 'text-gray-700 hover:border-2 hover:border-green-500 hover:bg-green-100 hover:text-green-800 hover:shadow-md'
                                }`}
                                aria-label="Keranjang Belanja"
                            >
                                <ShoppingCart className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Separator orientation="vertical" className="h-6 bg-gray-300" />

                        {isLoadingUser ? (
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300" />
                                <Skeleton className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300" />
                            </div>
                        ) : user ? (
                            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen} modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-2 text-green-700 hover:text-green-800 hover:bg-green-50 rounded-full px-3 py-2 transition-all duration-200 hover:shadow-md"
                                        data-tour="avatar-button"
                                    >
                                        <Avatar className="h-8 w-8 ring-2 ring-green-200 ring-offset-2">
                                            <AvatarImage src="/images/default-avatar.png" alt="Avatar" />
                                            <AvatarFallback className="bg-gradient-to-br from-green-100 to-green-200 font-bold text-green-800">
                                                {getUserInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-semibold">{user.name}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-64 rounded-2xl border-2 border-green-100 bg-white/95 shadow-2xl backdrop-blur-md"
                                    sideOffset={8}
                                    onCloseAutoFocus={(e) => e.preventDefault()}
                                    onPointerDownOutside={(e) => e.preventDefault()}
                                    onInteractOutside={(e) => e.preventDefault()}
                                >
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-t-2xl" id="dropdowntest">
                                        <p className="text-sm font-semibold text-green-800">Menu Profil</p>
                                        <p className="text-xs text-green-600">Kelola akun Anda dengan mudah</p>
                                    </div>

                                    <DropdownMenuItem asChild className="cursor-pointer font-medium text-green-700 hover:bg-green-50 focus:bg-green-50 mx-2 my-1 rounded-xl">
                                        <Link href="/settings/profile" className="flex w-full items-center gap-3 py-3 px-2">
                                            <div className="rounded-xl bg-blue-100 p-2 shadow-sm">
                                                <User className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">Pengaturan Profil</span>
                                                <span className="text-xs text-gray-500">Edit informasi pribadi</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild className="cursor-pointer font-medium text-green-700 hover:bg-green-50 focus:bg-green-50 mx-2 my-1 rounded-xl">
                                        <Link href="/order/belum-bayar" className="flex w-full items-center gap-3 py-3 px-2">
                                            <div className="rounded-xl bg-amber-100 p-2 shadow-sm">
                                                <PackageSearch className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">Pesanan Saya</span>
                                                <span className="text-xs text-gray-500">Lacak status pesanan</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-green-200 to-transparent mx-4 my-2" />

                                    <DropdownMenuItem asChild className="cursor-pointer font-medium hover:bg-red-50 focus:bg-red-50 mx-2 mb-2 rounded-xl">
                                        <Link
                                            method="post"
                                            href="/logout"
                                            as="button"
                                            className="flex w-full items-center gap-3 py-3 px-2 text-red-600 hover:text-red-700"
                                            id="logoutdrop"
                                        >
                                            <div className="rounded-xl bg-red-100 p-2 shadow-sm" id="buttonlogout">
                                                <LogOut className="h-4 w-4 text-red-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-left text-sm font-semibold">Logout</span>
                                                <span className="text-xs text-red-400">Keluar dari akun</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex gap-3">
                                <Link href="/login">
                                    <Button variant="outline" className="text-sm font-semibold text-green-700 border-green-300 hover:bg-green-800 hover:text-white transition-all duration-200 hover:shadow-md">
                                        Masuk
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-gradient-to-r from-green-700 to-green-800 text-sm font-semibold text-white hover:from-green-800 hover:to-green-900 transition-all duration-200 hover:shadow-lg hover:scale-105">
                                        Daftar
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {isMenuOpen && (
                    <div className="px-4 pb-4 md:hidden bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
                        <div className="flex flex-col gap-3 pt-4">
                            {navLinks.map((link, i) => {
                                const IconComponent = link.icon;
                                const isActive = currentUrl === link.href;
                                return (
                                    <Link
                                        key={i}
                                        href={link.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? 'bg-green-100 text-green-700 font-semibold'
                                                : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                                        }`}
                                    >
                                        <IconComponent className="h-4 w-4" />
                                        {link.title}
                                    </Link>
                                );
                            })}

                            <div className="relative mt-2">
                                <Input placeholder="Cari alat tulis..." className="h-11 w-full rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 px-4 pr-12 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                <Search className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            </div>

                            {isLoadingUser ? (
                                <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-36" />
                                    </div>
                                </div>
                            ) : user ? (
                                <div className="mt-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-4 shadow-sm border border-green-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Avatar className="h-10 w-10 ring-2 ring-green-200">
                                            <AvatarImage src="/images/default-avatar.png" alt="Avatar" />
                                            <AvatarFallback className="bg-gradient-to-br from-green-100 to-green-200 font-bold text-green-800">
                                                {getUserInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-green-800">{user.name}</p>
                                            <p className="text-xs text-green-600">{user.email}</p>
                                        </div>
                                        <Link method="post" href="/logout" as="button" className="p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                                            <LogOut className="h-4 w-4" />
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        <Link
                                            href="/settings/profile"
                                            className="flex items-center gap-3 rounded-xl bg-blue-100 p-3 text-blue-700 hover:bg-blue-200 transition-colors"
                                        >
                                            <div className="rounded-lg bg-blue-200 p-1.5">
                                                <User className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">Pengaturan Profil</p>
                                                <p className="text-xs text-blue-600">Edit informasi pribadi</p>
                                            </div>
                                        </Link>
                                        <Link
                                            href="/order/belum-bayar"
                                            className="flex items-center gap-3 rounded-xl bg-amber-100 p-3 text-amber-700 hover:bg-amber-200 transition-colors"
                                        >
                                            <div className="rounded-lg bg-amber-200 p-1.5">
                                                <PackageSearch className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">Pesanan Saya</p>
                                                <p className="text-xs text-amber-600">Lacak status pesanan</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <Link href="/login">
                                        <Button variant="outline" className="w-full text-sm font-semibold text-green-700 border-green-300 hover:bg-green-50">
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button className="w-full bg-gradient-to-r from-green-700 to-green-800 text-sm font-semibold text-white hover:from-green-800 hover:to-green-900">
                                            Daftar
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Breadcrumbs Section */}
            {breadcrumbs.length > 1 && (
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 shadow-sm">
                    <div className="mx-auto max-w-screen-xl px-4 md:px-6">
                        <nav className="flex items-center space-x-1 py-3 text-sm" aria-label="Breadcrumb">
                            <div className="flex items-center space-x-1 overflow-x-auto pb-1">
                                {breadcrumbs.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-1 whitespace-nowrap">
                                        {index > 0 && (
                                            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        )}
                                        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                            item.isActive
                                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 font-semibold shadow-sm border border-green-200'
                                                : item.href
                                                ? 'text-gray-600 hover:text-green-700 hover:bg-green-50 cursor-pointer'
                                                : 'text-gray-500'
                                        }`}>
                                            {item.icon && (
                                                <span className={`flex-shrink-0 ${item.isActive ? 'text-green-600' : ''}`}>
                                                    {item.icon}
                                                </span>
                                            )}
                                            {item.href ? (
                                                <Link href={item.href} className="hover:underline decoration-green-500 underline-offset-2">
                                                    {item.label}
                                                </Link>
                                            ) : (
                                                <span className="font-medium">{item.label}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}

export default NavbarSection;
