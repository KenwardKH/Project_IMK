import CategoriesSection from '@/components/section/CategoriesSection';
import FeaturedProductsSection from '@/components/section/FeaturedProductSection';
import Footer from '@/components/section/Footer';
import HeroSlider from '@/components/section/HeroSlider';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import AboutUs from '@/components/section/AboutUsSection';

interface LandingPageProps {
    products?: any[];
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

export default function LandingPage({ products = [], auth }: LandingPageProps) {
    // CSRF Token Management - Jalankan saat halaman dimuat
    useEffect(() => {
        const initializeCsrfToken = async () => {
            try {
                // Cek apakah user sudah login
                if (auth?.user) {
                    console.log('User logged in, refreshing CSRF token...');
                    
                    // Ambil CSRF token fresh dari server
                    await fetch('/sanctum/csrf-cookie', {
                        method: 'GET',
                        credentials: 'same-origin',
                        headers: {
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    });

                    // Update meta tag dengan token baru jika ada
                    const response = await fetch('/api/csrf-token', {
                        method: 'GET',
                        credentials: 'same-origin',
                        headers: {
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.csrf_token) {
                            // Update meta tag CSRF
                            const metaTag = document.querySelector('meta[name="csrf-token"]');
                            if (metaTag) {
                                metaTag.setAttribute('content', data.csrf_token);
                                console.log('CSRF token updated successfully');
                            }
                        }
                    }
                }
            } catch (error) {
                console.log('CSRF token refresh failed, will use existing token:', error);
                // Tidak masalah jika gagal, akan menggunakan token yang ada
            }
        };

        // Jalankan saat komponen dimount
        initializeCsrfToken();

        // Set up periodic refresh untuk mencegah token expired (optional)
        const refreshInterval = setInterval(() => {
            if (auth?.user) {
                initializeCsrfToken();
            }
        }, 30 * 60 * 1000); // Refresh setiap 30 menit

        // Cleanup interval saat komponen unmount
        return () => {
            clearInterval(refreshInterval);
        };
    }, [auth?.user]);

    // Function untuk memastikan CSRF token selalu fresh (bisa digunakan oleh komponen child)
    const ensureFreshCsrfToken = async (): Promise<string> => {
        try {
            // Coba ambil dari meta tag dulu
            let metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            if (!metaToken || metaToken === '') {
                console.log('Meta token not found or empty, fetching fresh token...');
                
                // Refresh CSRF cookie
                await fetch('/sanctum/csrf-cookie', {
                    method: 'GET',
                    credentials: 'same-origin',
                });

                // Ambil token baru
                const response = await fetch('/api/csrf-token', {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    metaToken = data.csrf_token;
                    
                    // Update meta tag
                    const metaTagElement = document.querySelector('meta[name="csrf-token"]');
                    if (metaTagElement && metaToken) {
                        metaTagElement.setAttribute('content', metaToken);
                    }
                }
            }

            return metaToken || '';
        } catch (error) {
            console.error('Error ensuring fresh CSRF token:', error);
            return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        }
    };

    // Expose function ke window object agar bisa diakses komponen lain
    useEffect(() => {
        // @ts-ignore
        window.ensureFreshCsrfToken = ensureFreshCsrfToken;
        
        return () => {
            // @ts-ignore
            delete window.ensureFreshCsrfToken;
        };
    }, []);

    return (
        <>
            <Head title="Beranda | Sinar Pelangi" />
            <AppLayout>
                {/* Hero */}
                <HeroSlider />
                
                {/* Featured Products - Pass CSRF helper function */}
                <FeaturedProductsSection 
                    products={products} 
                    auth={auth}
                    ensureFreshCsrfToken={ensureFreshCsrfToken}
                />

                <AboutUs />

                {/* Categories */}
                {/* <CategoriesSection /> */}
            </AppLayout>
            <Footer />
        </>
    );
}