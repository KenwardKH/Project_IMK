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

import NavbarSection from '@/components/section/NavbarSection';
import { ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <>
            <div className="flex w-full flex-col items-center">
                <div className="relative w-full max-w-[1440px]">
                    <NavbarSection />
                    <main className="min-h-screen p-4">{children}</main>
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
}
