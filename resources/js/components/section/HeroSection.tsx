import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import React from 'react';

export default function HeroSection() {
  const stats = [
    { number: '100+', description: 'Jenis alat tulis' },
    { number: '30+', description: 'Jenis buku' },
  ];

  return (
    <section className="w-full py-8">
      <Card className="w-full overflow-hidden rounded-2xl bg-[#153e98]">
        <CardContent className="p-0">
          <div className="flex flex-col-reverse md:flex-row items-center p-6 md:p-12">
            {/* Teks dan Statistik */}
            <div className="w-full md:w-1/2 md:pr-8">
              <h1 className="mb-8 font-extrabold text-4xl md:text-5xl leading-tight text-white font-['Inter']">
                Beli peralatan tulis terbaik disini
              </h1>

              <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && (
                      <Separator orientation="vertical" className="h-12 mx-4 bg-white/30" />
                    )}
                    <div>
                      <p className="text-3xl font-semibold text-white font-['Inter']">{stat.number}</p>
                      <p className="mt-1 text-base text-white font-['Inter']">{stat.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pencarian */}
              <div className="relative w-full max-w-md">
                <label htmlFor="search" className="sr-only">
                  Cari alat tulis
                </label>
                <Input
                  id="search"
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
              </div>
            </div>

            {/* Gambar Hero */}
            <div className="w-full md:w-1/2 mb-8 md:mb-0 flex justify-center">
              <img
                className="h-72 w-72 md:h-[445px] md:w-[445px] object-cover"
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
