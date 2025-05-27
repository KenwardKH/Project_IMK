import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import { Lock, LogOut, Menu, User } from 'lucide-react';
import { useState } from 'react';
import { CgProfile } from 'react-icons/cg';

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

    return (
        <nav className="relative flex items-center justify-between bg-[#7DC9F5] px-4 py-2 text-black shadow-md">
            <div className="flex items-center">
                <img src="/images/logo.png" alt="logo" className="h-8 sm:h-10 md:h-12" />
            </div>

            {/* Desktop profile section */}
            <div className="hidden items-center gap-4 md:flex">
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex cursor-pointer items-center gap-2 text-black">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/images/default-avatar.png" alt="Avatar" />
                                    <AvatarFallback className="bg-green-100 font-bold text-green-800">{getUserInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-semibold">{user.name}</span>
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-52 rounded-xl border bg-white shadow-md">
                            <DropdownMenuItem className="font-medium text-red-600 hover:bg-red-50 ">
                                <Link href="/owner-profile" className="flex w-full items-center gap-2 text-red-500 hover:text-red-600">
                                    <User className="h-4 w-4 text-green-600" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="font-medium text-red-600 hover:bg-red-50 ">
                                <Link href="/owner-password" className="flex w-full items-center gap-2 text-red-500 hover:text-red-600">
                                    <Lock className="h-4 w-4 text-green-600" />
                                    <span>Password</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="font-medium text-red-600 hover:bg-red-50">
                                <Link method="post" href="/logout" className="flex w-full items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer">
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <>
                        <Link href="/login">
                            <Button className="bg-white text-sm font-semibold text-green-700 hover:bg-green-800">Masuk</Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-green-700 text-sm font-semibold text-white hover:border hover:bg-white hover:text-green-700">
                                Daftar
                            </Button>
                        </Link>{' '}
                    </>
                )}
            </div>

            {/* Mobile menu button */}
            <button className="p-2 md:hidden" onClick={toggleMobileMenu}>
                <Menu className="size-6" />
            </button>

            {/* Mobile menu */}
            {showMobileMenu && (
                <div className="absolute top-full right-0 z-50 w-full bg-[#7DC9F5] shadow-lg md:w-auto">
                    <div className="flex items-center justify-center gap-2 p-4">
                        <CgProfile className="size-8" />
                        <a href="" className="text-xl font-medium hover:underline">
                            Admin
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
