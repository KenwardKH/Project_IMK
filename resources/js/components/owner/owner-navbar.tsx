import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Lock, LogOut, Menu, User } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

type PageProps = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
};

const Navbar = () => {
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { post } = useForm();

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    const getUserInitials = (name: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Apakah Anda yakin ingin keluar?',
            text: 'Anda akan keluar dari akun saat ini.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, keluar',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                post('/logout');
            }
        });
    };

    return (
        <>
            <nav className="sticky top-0 z-50 border-b border-blue-500/20 bg-gray-200/50 shadow-xl backdrop-blur-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo Section */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="hidden sm:block">
                                    <h1 className="text-xl font-bold text-gray-800">Admin</h1>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-[0.8rem] text-gray-600">
                                            {new Date().toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </div>
                                    </div>
                                    {/* <p className="text-xs text-black">Management System</p> */}
                                </div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center space-x-4 md:flex">
                            {/* Notifications */}
                            {/* <button className="relative p-2 text-black hover:text-black hover:bg-white/10 rounded-lg transition-all duration-200">
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-black flex items-center justify-center">3</span>
                            </button> */}

                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex cursor-pointer items-center space-x-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-black backdrop-blur-sm transition-all duration-200 hover:bg-white/20">
                                            <Avatar className="h-8 w-8 ring-2 ring-white/30">
                                                <AvatarImage src="/images/default-avatar.png" alt="Avatar" />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-black">
                                                    {getUserInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="hidden text-left lg:block">
                                                <p className="text-sm font-semibold">{user.name}</p>
                                                {/* <p className="text-xs text-black">Owner</p> */}
                                            </div>
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-64 rounded-2xl border-0 bg-white/95 shadow-2xl backdrop-blur-xl">
                                        <div className="border-b border-gray-100 p-4">
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src="/images/default-avatar.png" alt="Avatar" />
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-black">
                                                        {getUserInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2">
                                            <DropdownMenuItem className="rounded-lg transition-colors hover:bg-blue-500">
                                                <Link href="/owner-profile" className="flex w-full items-center space-x-3 px-3 py-2">
                                                    <div className="rounded-lg bg-blue-100 p-2">
                                                        <User className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Profile</p>
                                                        <p className="text-xs text-gray-500">Kelola akun anda</p>
                                                    </div>
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem className="rounded-lg transition-colors hover:bg-green-50">
                                                <Link href="/owner-password" className="flex w-full items-center space-x-3 px-3 py-2">
                                                    <div className="rounded-lg bg-green-100 p-2">
                                                        <Lock className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Keamanan</p>
                                                        <p className="text-xs text-gray-500">Ubah password</p>
                                                    </div>
                                                </Link>
                                            </DropdownMenuItem>
                                        </div>

                                        <DropdownMenuSeparator className="my-2" />

                                        <div className="p-2">
                                            <DropdownMenuItem className="rounded-lg transition-colors hover:bg-red-50">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center gap-3 px-2 py-3 text-red-600 hover:text-red-700"
                                                    id="logoutdrop"
                                                >
                                                    <div className="rounded-xl bg-red-100 p-2 shadow-sm" id="buttonlogout">
                                                        <LogOut className="h-4 w-4 text-red-500" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-left text-sm font-semibold">Logout</span>
                                                        <span className="text-xs text-red-400">Keluar dari akun</span>
                                                    </div>
                                                </button>
                                            </DropdownMenuItem>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link href="/login">
                                        <button className="rounded-xl border border-white/20 bg-white/10 px-6 py-2 text-sm font-semibold text-black backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-blue-700">
                                            Masuk
                                        </button>
                                    </Link>
                                    <Link href="/register">
                                        <button className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-2 text-sm font-semibold text-black shadow-lg transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:shadow-xl">
                                            Daftar
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button className="rounded-lg p-2 text-black transition-colors hover:bg-white/10 md:hidden" onClick={toggleMobileMenu}>
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {showMobileMenu && (
                    <div className="border-t border-blue-500/20 bg-white backdrop-blur-lg md:hidden">
                        <div className="space-y-4 px-4 py-6">
                            {user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 rounded-xl bg-white/10 p-4">
                                        <Avatar className="h-12 w-12 ring-2 ring-white/30">
                                            <AvatarImage src="/images/default-avatar.png" alt="Avatar" />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-black">
                                                {getUserInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-black">{user.name}</p>
                                            <p className="text-sm text-black">Owner Account</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Link
                                            href="/owner-profile"
                                            className="flex items-center space-x-3 rounded-lg p-3 text-black transition-colors hover:bg-black/10"
                                        >
                                            <User className="h-5 w-5" />
                                            <span>Profile</span>
                                        </Link>
                                        <Link
                                            href="/owner-password"
                                            className="flex items-center space-x-3 rounded-lg p-3 text-black transition-colors hover:bg-black/10"
                                        >
                                            <Lock className="h-5 w-5" />
                                            <span>Password</span>
                                        </Link>
                                        <Link
                                            method="post"
                                            href="/logout"
                                            className="flex w-full cursor-pointer items-center space-x-3 rounded-lg p-3 text-red-300 transition-colors hover:bg-red-500/10"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span>Logout</span>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link
                                        href="/login"
                                        className="block w-full rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-center text-black backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-blue-700"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-center text-black transition-all duration-200 hover:from-green-600 hover:to-green-700"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
