import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/react';
import { Search, ShoppingCart } from 'lucide-react';

export function NavbarSection() {
    // Navigation links data
    const navLinks = [
        { title: 'Home', href: '/', active: true },
        { title: 'Products', href: '/produk', active: false },
        { title: 'Contacts', href: '/kontak', active: false },
    ];

    return (
        <nav className="flex h-[55px] w-full items-center justify-between">
            {/* Logo */}
            <img className="h-10 w-[193px] object-cover" alt="Company logo" src="images/logo.png" />

            {/* Navigation Links */}
            <div className="ml-6 flex items-center gap-5">
                {navLinks.map((link, index) => (
                    <Link
                        key={index}
                        href={link.href}
                        className={`text-lg font-medium ${link.active ? 'text-color-2' : 'text-color-4'} font-['Poppins-Medium',Helvetica]`}
                    >
                        {link.title}
                    </Link>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative mx-auto w-[402px]">
                <Input
                    className="text-color-4 h-[55px] rounded-xl bg-[#e7e7e7] pr-16 pl-6 font-['Poppins-Regular',Helvetica] text-[15px]"
                    placeholder="Cari alat tulis ...."
                />
                <Button size="icon" className="bg-color-1 absolute top-1/2 right-2 h-[34px] w-[34px] -translate-y-1/2 transform rounded-xl">
                    <Search className="h-[15px] w-4" />
                </Button>
            </div>

            {/* Cart Icon & Auth Buttons */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-[37px] w-[37px] p-0">
                    <ShoppingCart className="h-[37px] w-[37px]" />
                </Button>

                <Separator orientation="vertical" className="h-[37px]" />

                <Link href="/login">
                    <Button
                        variant="outline"
                        className="h-7 w-[98px] rounded font-['Times_New_Roman-Bold',Helvetica] text-[13px] font-bold tracking-[0.26px] text-[#136a04]"
                    >
                        Masuk
                    </Button>
                </Link>

                <Link href="/register">
                    <Button className="h-7 w-[98px] rounded font-['Times_New_Roman-Bold',Helvetica] text-[13px] font-bold tracking-[0.26px] text-[#f3f3f3]">
                        Daftar
                    </Button>
                </Link>
            </div>
        </nav>
    );
}

export default NavbarSection;
