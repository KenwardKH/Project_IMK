import { Card, CardContent } from '@/components/ui/card';

function FeaturedProductsSection() {
    const products = [
        {
            id: 1,
            name: 'Buku CAMPUS Isi 10',
            price: 'Rp 120.000',
            image: '',
            alt: 'Buku Campus Isi 10',
        },
        {
            id: 2,
            name: 'Buku CAMPUS Isi 10',
            price: 'Rp 120.000',
            image: '',
            alt: 'Buku Campus Isi 10',
        },
        {
            id: 3,
            name: 'Buku CAMPUS Isi 10',
            price: 'Rp 120.000',
            image: '',
            alt: 'Buku Campus Isi 10',
        },
        {
            id: 4,
            name: 'Buku CAMPUS Isi 10',
            price: 'Rp 120.000',
            image: '',
            alt: 'Buku Campus Isi 10',
        },
    ];

    return (
        <section className="w-full py-12">
            <div className="container mx-auto">
                <div className="mb-10 flex flex-col items-center">
                    <h2 className="text-center [font-family:'Poppins-Bold',Helvetica] text-[32px] font-bold">Featured Products</h2>
                    <p className="mt-2 [font-family:'Poppins-Medium',Helvetica] text-lg font-medium text-[#f3f3f3]">
                        Cari jenis barang yang kamu inginkan
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <Card key={product.id} className="overflow-hidden rounded-[10px] border-none">
                            <div className="relative">
                                <img src="images/buku_campus.jpeg" alt={product.alt} className="h-[255px] w-full object-cover" />
                                <div className="absolute top-3 right-3 rounded bg-red-600 px-2 py-1 text-xs text-white">BEST SELLER</div>
                            </div>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <h3 className="[font-family:'Poppins-Medium',Helvetica] text-[13px] font-medium text-[#1c283f]">
                                        {product.name}
                                    </h3>
                                    <p className="[font-family:'Poppins-Medium',Helvetica] text-[15px] font-medium text-[#56b280]">{product.price}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturedProductsSection;
