import CategoriesSection from '@/components/section/CategoriesSection';
import FeaturedProductsSection from '@/components/section/FeaturedProductSection';
import Footer from '@/components/section/Footer';
import HeroSection from '@/components/section/HeroSection';
import NavbarSection from '@/components/section/NavbarSection';
import { Head } from '@inertiajs/react';

export default function LandingPage() {
    const contactInfo = [
        { label: 'Email', value: 'sinarpelangi@gmail.com' },
        { label: 'Phone', value: '+62 852 4456 2538' },
        { label: 'Address', value: 'Jl. Sisingamangaraja no.98' },
    ];

    return (
        <>
            <Head title="Beranda | Sinar Pelangi" />
            <div className="flex w-full flex-col items-center bg-[#f6f6f6]">
                <div className="relative w-full max-w-[1440px] bg-[#f6f6f6]">
                    {/* Navbar */}
                    <NavbarSection />

                    {/* Hero */}
                    <HeroSection />

                    {/* Featured Products */}
                    <FeaturedProductsSection />

                    {/* Categories */}
                    <CategoriesSection />

                    {/* Footer */}
                    <Footer />
                </div>
            </div>
        </>
    );
}
