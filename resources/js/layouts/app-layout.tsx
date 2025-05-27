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
import TutorialTour from '@/components/TutorialTour';
import { ReactNode, useState } from 'react';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    return (
        <>
            <div className="flex w-full flex-col items-center">
                <div className="relative w-full max-w-[1440px]">
                    <TutorialTour isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
                    <NavbarSection isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
                    <main className="min-h-screen p-4">{children}</main>
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
}
