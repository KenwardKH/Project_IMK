import Footer from '@/components/section/Footer';
import NavbarSection from '@/components/section/NavbarSectionCashier';
import { ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <>
            <NavbarSection />
            <main className="min-h-screen bg-gray-50 p-4">{children}</main>
            {/* <Footer /> */}
        </>
    );
}