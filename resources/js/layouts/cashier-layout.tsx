import React, { ReactNode } from 'react';
import { router, usePage } from '@inertiajs/react';
import NavbarSectionCashier from '@/components/section/NavbarSectionCashier';

// Type yang sama dengan NavbarSectionCashier
type SectionId = 'buat-pesanan' | 'konfirmasi-pesanan' | 'status-pesanan' | 'stok-barang' | 'logout';

interface CashierLayoutProps {
    children: ReactNode;
    title?: string;
}

const CashierLayout: React.FC<CashierLayoutProps> = ({ children, title = "Kasir" }) => {
    const { url } = usePage();

    const getActiveSection = (): SectionId => {
        if (url === '/cashier' || url.startsWith('/cashier/orders/create')) {
            return 'buat-pesanan';
        }
        if (url.startsWith('/cashier/orders/status')) {
            return 'status-pesanan';
        }
        if (url.startsWith('/cashier/orders')) {
            return 'konfirmasi-pesanan'; // ini harus diletakkan setelah 'status' agar tidak tertimpa
        }
        if (url.startsWith('/cashier/inventory')) {
            return 'stok-barang';
        }
        return 'buat-pesanan';
    };


    const handleSectionChange = (sectionId: SectionId) => {
        switch (sectionId) {
            case 'buat-pesanan':
                router.visit('/cashier');
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