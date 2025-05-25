import React, { ReactNode } from 'react';
import { router, usePage } from '@inertiajs/react';
import NavbarSectionCashier from '@/components/section/NavbarSectionCashier';

interface CashierLayoutProps {
    children: ReactNode;
    title?: string;
}

const CashierLayout: React.FC<CashierLayoutProps> = ({ children, title = "Kasir" }) => {
    const { url } = usePage();

    // Tentukan active section berdasarkan current route
    const getActiveSection = () => {
        if (url.includes('/cashier/orders/create') || url === '/cashier') return 'buat-pesanan';
        if (url.includes('/cashier/orders')) return 'konfirmasi-pesanan';
        if (url.includes('/cashier/orders/status')) return 'status-pesanan';
        if (url.includes('/cashier/inventory')) return 'stok-barang';
        return 'buat-pesanan';
    };

    const handleSectionChange = (sectionId: string) => {
        // Navigate ke route yang sesuai menggunakan Inertia router
        switch (sectionId) {
            case 'buat-pesanan':
                router.visit('/cashier/orders/create');
                break;
            case 'konfirmasi-pesanan':
                router.visit('/cashier/orders');
                break;
            case 'status-pesanan':
                router.visit('/cashier/orders/status');
                break;
            case 'stok-barang':
                router.visit('/cashier/inventory');
                break;
            default:
                router.visit('/cashier');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <NavbarSectionCashier 
                activeSection={getActiveSection()}
                onSectionChange={handleSectionChange}
            />
            
            {/* Main Content */}
            <div className="ml-16 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            {title}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                {new Date().toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default CashierLayout;