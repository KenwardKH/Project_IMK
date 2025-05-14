import { Card, CardContent } from '@/components/ui/card';

function CategoriesSection() {
    const categories = [
        {
            id: 1,
            title: 'Peralatan Kantor',
            image: '',
            alt: 'Perlengkapan kantor',
        },
        {
            id: 2,
            title: 'Peralatan Sekolah',
            image: '',
            alt: 'Perlengkapan sekolah',
        },
        {
            id: 3,
            title: 'Pulpen dan kertas',
            image: '',
            alt: 'Pulpen dan pensil',
        },
        {
            id: 4,
            title: 'Lainnya',
            image: '',
            alt: 'Buku dan kertas',
        },
    ];

    return (
        <section className="w-full px-4 py-16">
            <div className="mx-auto max-w-6xl">
                {/* Section header */}
                <div className="mb-12 text-center">
                    <h2 className="mb-2 text-center font-['Poppins-Bold',Helvetica] text-3xl font-bold">Kategori</h2>
                    <p className="font-['Poppins-Medium',Helvetica] text-lg font-medium text-[#1e1e1e80]">Cari jenis barang yang kamu inginkan</p>
                </div>

                {/* Category grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {categories.map((category) => (
                        <Card key={category.id} className="overflow-hidden rounded-[13px] border-none bg-[#d1d6f6] transition-shadow hover:shadow-md">
                            <CardContent className="flex flex-col items-center justify-center p-8">
                                <div className="mb-6 flex h-[200px] items-center justify-center">
                                    <img src={category.image} alt={category.alt} className="max-h-full object-contain" />
                                </div>
                                <h3 className="text-center font-['JejuGothic-Regular',Helvetica] text-3xl text-black">{category.title}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CategoriesSection;
