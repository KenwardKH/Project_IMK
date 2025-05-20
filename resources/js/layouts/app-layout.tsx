// BEFORE
// import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
// import { type BreadcrumbItem } from '@/types';
// import { type ReactNode } from 'react';

// interface AppLayoutProps {
//     children: ReactNode;
//     breadcrumbs?: BreadcrumbItem[];
// }

// export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
//     <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
//         {children}
//     </AppLayoutTemplate>
// );

// resources/js/Layouts/AppLayout.jsx\

import Footer from '@/components/section/Footer';
import NavbarSection from '@/components/section/NavbarSection';
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
