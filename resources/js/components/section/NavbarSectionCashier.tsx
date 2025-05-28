import React, { useState } from 'react';
import { 
    ShoppingCart, 
    CheckCircle, 
    Clock, 
    Package, 
    LogOut 
} from 'lucide-react';
import { router } from '@inertiajs/react';


type SectionId = 'buat-pesanan' | 'konfirmasi-pesanan' | 'status-pesanan' | 'stok-barang' | 'logout';

interface NavbarSectionCashierProps {
    activeSection?: SectionId;  // Hanya menerima string yang valid
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
            color: 'text-blue-600 hover:text-blue-700'
        },
        {
            id: 'konfirmasi-pesanan',
            name: 'Konfirmasi Pesanan',
            icon: CheckCircle,
            color: 'text-green-600 hover:text-green-700'
        },
        {
            id: 'status-pesanan',
            name: 'Status Pesanan',
            icon: Clock,
            color: 'text-yellow-600 hover:text-yellow-700'
        },
        {
            id: 'stok-barang',
            name: 'Stok Barang',
            icon: Package,
            color: 'text-purple-600 hover:text-purple-700'
        },
        {
            id: 'logout',
            name: 'Logout',
            icon: LogOut,
            color: 'text-red-600 hover:text-red-700'
        }
    ];

    const handleItemClick = (itemId: string) => {
    if (itemId === 'logout') {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            router.post('/logout');
        }
    } else {
        onSectionChange?.(itemId as SectionId);
    }
};

    return (
        <div className="fixed left-0 top-0 h-full w-16 bg-white shadow-lg border-r border-gray-200 flex flex-col items-center py-6 z-50">
            {/* Logo/Brand */}
            <div className="mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">K</span>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col space-y-4 flex-1">
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                        <div
                            key={item.id}
                            className="relative group"
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <button
                                onClick={() => handleItemClick(item.id)}
                                className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
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
                                <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 z-50">
                                    <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                                        {item.name}
                                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
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