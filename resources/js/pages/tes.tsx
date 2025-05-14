
import CategoriesSection from '@/components/section/CategoriesSection';
import FeaturedProductsSection from '@/components/section/FeaturedProductSection';
import HeroSection from '@/components/section/HeroSection';
import NavbarSection from '@/components/section/NavbarSection';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
                    <footer className="w-full bg-[#dfe7f6] px-6 py-16 md:px-12 lg:px-[183px]">
                        <div className="flex flex-col space-y-8">
                            {/* Logo */}
                            <div>
                                <img className="h-[68px] w-[329px] object-cover" alt="Sinar Pelangi Logo" src="images/logo-sinar-pelangi.png" />
                            </div>

                            {/* Contact Us Button */}
                            <div>
                                <Button className="h-12 w-[123px] rounded-[10px] bg-[#bfb8f6] text-black hover:bg-[#a9a1f1]">
                                    <span className="font-['Space_Grotesk-Regular',Helvetica] text-base">Contact Us</span>
                                </Button>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                {contactInfo.map((item, index) => (
                                    <div
                                        key={index}
                                        className="font-['IBM_Plex_Mono-Regular',Helvetica] text-base leading-[22.8px] font-normal tracking-[-0.50px] text-black"
                                    >
                                        {item.label}: {item.value}
                                    </div>
                                ))}
                            </div>

                            {/* Separator */}
                            <Separator className="my-4" />

                            {/* Copyright */}
                            <div className="text-color-4 font-['Poppins-Medium',Helvetica] text-lg font-medium">
                                © 2025 All Rights Reserved – Sinar Pelangi
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
