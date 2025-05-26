import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react'; // ✅ Import terbaru

export default function HeroSection() {
  const stats = [
    { number: '100+', description: 'Jenis alat tulis' },
    { number: '30+', description: 'Jenis buku' },
  ];

  const [query, setQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.get('/products', { search: query.trim() }, {
        preserveState: true,
        replace: true,
      });
    }
  };

  return (
    <section className="w-full py-8">
      <Card className="w-full overflow-hidden rounded-2xl bg-[#153e98]">
        <CardContent className="p-0">
          <div className="flex flex-col-reverse items-center p-6 md:flex-row md:p-12">
            <div className="w-full md:w-1/2 md:pr-8">
              <h1 className="mb-8 font-['Inter'] text-4xl font-extrabold leading-tight text-white md:text-5xl">
                Beli peralatan tulis terbaik disini
              </h1>

              <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && (
                      <Separator orientation="vertical" className="mx-4 h-12 bg-white/30" />
                    )}
                    <div>
                      <p className="font-['Inter'] text-3xl font-semibold text-white">{stat.number}</p>
                      <p className="mt-1 font-['Inter'] text-base text-white">{stat.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Pencarian */}
              <form onSubmit={handleSearch} className="relative w-full max-w-md">
                <label htmlFor="search" className="sr-only">Cari alat tulis</label>
                <Input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-14 w-full rounded-xl bg-[#f3f4f6] pl-6 pr-14 text-base text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-0"
                  placeholder="Cari alat tulis..."
                />
                <button
                  type="submit"
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform rounded-xl bg-[#153e98] p-2"
                  aria-label="Cari"
                >
                  <Search className="h-5 w-5 text-white" />
                </button>
              </form>
            </div>

            {/* Gambar Hero */}
            <div className="mb-8 flex w-full justify-center md:mb-0 md:w-1/2">
              <img
                className="h-72 w-72 object-cover md:h-[445px] md:w-[445px]"
                alt="Produk alat tulis"
                src="/images/hero_book.png"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
