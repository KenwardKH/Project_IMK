import CategoriesSection from '@/components/section/CategoriesSection';
import FeaturedProductsSection from '@/components/section/FeaturedProductSection';
import Footer from '@/components/section/Footer';
import HeroSlider from '@/components/section/HeroSlider';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import AboutUsPage from './footer/AboutUsPage';
import AboutUs from '@/components/section/AboutUsSection';

export default function LandingPage({ products = [] }) {
    return (
        <>
            <Head title="Beranda | Sinar Pelangi" />
            <AppLayout>
                {/* Hero */}
                {/* <HeroSection /> */}
                <HeroSlider />
                {/* Featured Products */}
                <FeaturedProductsSection products={products} />

                <AboutUs />

                {/* Categories */}
                {/* <CategoriesSection /> */}
            </AppLayout>
            <Footer />
        </>
    );
}
