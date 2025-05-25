import CategoriesSection from '@/components/section/CategoriesSection';
import FeaturedProductsSection from '@/components/section/FeaturedProductSection';
import Footer from '@/components/section/Footer';
import HeroSection from '@/components/section/HeroSection';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function LandingPage({ products = [] }) {
    return (
        <>
            <Head title="Beranda | Sinar Pelangi" />
            <AppLayout>
                {/* Hero */}
                <HeroSection />

                {/* Featured Products */}
                <FeaturedProductsSection products={products} />

                {/* Categories */}
                <CategoriesSection />
            </AppLayout>
            <Footer />
        </>
    );
}
