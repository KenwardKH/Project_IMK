import { Card, CardContent } from '@/components/ui/card'

function CategoriesSection() {
  const categories = [
    {
      id: 1,
      title: 'Peralatan Kantor',
      image: 'images/buku_campus.jpeg',
      alt: 'Perlengkapan kantor',
    },
    {
      id: 2,
      title: 'Peralatan Sekolah',
      image: 'images/buku_campus.jpeg',
      alt: 'Perlengkapan sekolah',
    },
    {
      id: 3,
      title: 'Pulpen dan Kertas',
      image: 'images/buku_campus.jpeg',
      alt: 'Pulpen dan pensil',
    },
    {
      id: 4,
      title: 'Lainnya',
      image: 'images/buku_campus.jpeg',
      alt: 'Buku dan kertas',
    },
  ]

  return (
    <section className="w-full bg-[#f6f6f6] px-4 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-[#153e98] font-[Poppins]">Kategori</h2>
          <p className="mt-2 text-lg text-gray-600 font-[Poppins]">
            Jelajahi berbagai kategori produk terbaik kami
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group flex cursor-pointer flex-col items-center justify-center gap-5 rounded-2xl bg-white px-6 py-10 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
            >
              <div className="h-24 w-24">
                <img
                  src={category.image}
                  alt={category.alt}
                  className="h-full w-full object-contain"
                />
              </div>
              <CardContent className="p-0">
                <h3 className="text-center font-[Poppins] text-lg font-semibold text-[#1c283f]">
                  {category.title}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoriesSection
