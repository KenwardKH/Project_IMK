// import Cart from '@/components/section/cashier/MakeOrder/CashierCart';
import Cart from '@/pages/cashier/CashierCart';
import CategoriesSection from '@/components/section/CategoriesSection';
import FeaturedProductsSection from '@/components/section/FeaturedProductSection';
import Footer from '@/components/section/Footer';
import AppLayout from '@/layouts/cashier-layout';
import { Head } from '@inertiajs/react';

export default function dashboard({ cartItems = [], totalAmount = 0, auth }) {
    return (
        <>
            <Head title="Beranda | Sinar Pelangi" />
            <div className="flex min-h-screen w-full flex-col items-center bg-[#f6f6f6]">
                <div className="relative w-full max-w-[1440px] bg-[#f6f6f6] flex-1">
                    
                        {/* Hero */}
                        <Cart cartItems={cartItems} totalAmount={totalAmount} auth={auth}/>
                        {/* Featured Products */}
                        {/* <FeaturedProductsSection products={products} /> */}

                        {/* Categories */}
                        {/* <CategoriesSection /> */}
                    
                    <Footer />
                </div>
            </div>
        </>
    );
}