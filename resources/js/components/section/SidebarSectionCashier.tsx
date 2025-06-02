import React, { useState } from 'react';
import {
    ShoppingCart,
    CheckCircle,
    Clock,
    History,
    Package,
    LogOut
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';


type SectionId = 'buat-pesanan' | 'konfirmasi-pesanan' | 'status-pesanan' | 'stok-barang' | 'riwayat-pesanan' | 'logout';

interface NavbarSectionCashierProps {
    activeSection?: SectionId; // Hanya menerima string yang valid
    onSectionChange?: (sectionId: SectionId) => void;
}

const NavbarSectionCashier: React.FC<NavbarSectionCashierProps> = ({
    activeSection = 'buat-pesanan',
    onSectionChange
}) => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const menuItems = [
        {
            id: 'buat-pesanan',
            name: 'Buat Pesanan',
            icon: ShoppingCart,
            color: 'text-blue-600 hover:text-blue-700',
        },
        {
            id: 'konfirmasi-pesanan',
            name: 'Konfirmasi Pesanan',
            icon: CheckCircle,
            color: 'text-green-600 hover:text-green-700',
        },
        {
            id: 'status-pesanan',
            name: 'Status Pesanan',
            icon: Clock,
            color: 'text-yellow-600 hover:text-yellow-700',
        },
        {
            id: 'stok-barang',
            name: 'Stok Barang',
            icon: Package,
            color: 'text-purple-600 hover:text-purple-700',
        },
        {
            id: 'riwayat-pesanan',
            name: 'Riwayat Pesanan',
            icon: History,
            color: 'text-yellow-400 hover:text-yellow-700',
        },
        {
            id: 'logout',
            name: 'Logout',
            icon: LogOut,
            color: 'text-red-600 hover:text-red-700',
        },
    ];

  const handleItemClick = (itemId: string) => {
    if (itemId === 'logout') {
        Swal.fire({
            title: 'Apakah Anda yakin ingin logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, logout',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post('/logout');
            }
        });
    } else {
        onSectionChange?.(itemId as SectionId);
    }
};


    return (
        <div className="fixed top-0 left-0 z-50 flex h-full w-16 flex-col items-center border-r border-gray-200 bg-white py-6 shadow-lg">
            {/* Logo/Brand */}
            <div className="mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                    <span className="text-lg font-bold text-white">K</span>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex flex-1 flex-col space-y-4">
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                        <div
                            key={item.id}
                            className="group relative"
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <button
                                onClick={() => handleItemClick(item.id)}
                                className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer
                                    ${isActive
                                        ? 'bg-blue-100 border-2 border-blue-300 shadow-md'
                                        : 'hover:bg-gray-100 border-2 border-transparent hover:shadow-sm'
                                    }
                                    ${item.color}
                                `}
                            >
                                <IconComponent
                                    size={24}
                                    className={isActive ? 'text-blue-600' : ''}
                                />
                            </button>

                            {/* Tooltip */}
                            {hoveredItem === item.id && (
                                <div className="absolute top-1/2 left-full z-50 ml-3 -translate-y-1/2 transform">
                                    <div className="rounded-lg bg-gray-800 px-3 py-2 text-sm whitespace-nowrap text-white shadow-lg">
                                        {item.name}
                                        <div className="absolute top-1/2 left-0 h-0 w-0 -translate-x-1 -translate-y-1/2 transform border-t-4 border-r-4 border-b-4 border-transparent border-r-gray-800"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Bottom spacer */}
            <div className="mt-auto"></div>
        </div>
    );
};

export default NavbarSectionCashier;
