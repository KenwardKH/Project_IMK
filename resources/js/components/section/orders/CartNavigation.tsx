import { Link, usePage } from '@inertiajs/react';

interface NavigationItem {
    id: string;
    label: string;
    href: string;
}

export default function CartNavigationSection() {
    const { url } = usePage();
    const currentPath = url.split('?')[0];

    const navigationItems: NavigationItem[] = [
        { id: 'belum-bayar', label: 'Belum Bayar', href: '/order/belum-bayar' },
        { id: 'sedang-proses', label: 'Menunggu Konfirmasi', href: '/order/sedang-proses' },
        { id: 'proses', label: 'Proses', href: '/order/proses' },
        { id: 'selesai', label: 'Selesai', href: '/order/selesai' },
        { id: 'dibatalkan', label: 'Dibatalkan', href: '/order/dibatalkan' },
    ];

    return (
        <section className="mx-auto w-full max-w-4xl p-2 sm:p-8 font-['Inter',sans-serif]">
            <nav
                aria-label="Navigasi Cart"
                className="flex justify-between gap-2 rounded-xl bg-gray-100 p-1 shadow-sm"
            >
                {navigationItems.map((item) => {
                    const isActive = currentPath === item.href;

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            aria-current={isActive ? 'page' : undefined}
                            className={`flex flex-1 items-center justify-center text-center rounded-lg px-2 py-2 text-xs sm:text-sm font-medium transition-all duration-200
                                ${
                                    isActive
                                        ? 'bg-white text-green-700 shadow-sm italic'
                                        : 'text-gray-600 hover:bg-white hover:text-green-600'
                                }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </section>
    );
}
