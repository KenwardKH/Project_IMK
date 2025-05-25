import CartNavigationSection from '@/components/section/orders/CartNavigation';
import OrderSummarySection from '@/components/section/orders/OrderSummary';
import AppLayout from '@/layouts/app-layout';

export default function DaftarPesananBelum() {
    return (
        <AppLayout>
            <CartNavigationSection />
            {/* Main Content */}
            <main className="flex w-full flex-col">
                <OrderSummarySection />
                {/* <OrderDetailsSection /> */}
            </main>
        </AppLayout>
    );
}
