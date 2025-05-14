import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import React from 'react';

export default function HeroSection() {
    // Data for statistics
    const stats = [
        { number: '100+', description: 'Jenis alat tulis' },
        { number: '30+', description: 'Jenis buku' },
    ];

    return (
        <section className="w-full py-8">
            <Card className="w-full overflow-hidden rounded-[20px] bg-[#153e98]">
                <CardContent className="p-0">
                    <div className="flex flex-row items-center p-6">
                        <div className="flex-1 pr-4">
                            <h1 className="mb-16 font-['Poppins-ExtraBold',Helvetica] text-5xl leading-[64px] font-extrabold text-[#dadada]">
                                Beli peralatan tulis terbaik disini
                            </h1>

                            <div className="mb-16 flex items-center space-x-8">
                                {stats.map((stat, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && <Separator orientation="vertical" className="h-16 bg-[#dadada]/30" />}
                                        <div>
                                            <p className="font-['Poppins-Medium',Helvetica] text-[32px] font-medium text-[#d9d9d9]">{stat.number}</p>
                                            <p className="mt-3 font-['Poppins-Medium',Helvetica] text-lg font-medium text-[#d9d9d9]">
                                                {stat.description}
                                            </p>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="relative w-full max-w-[502px]">
                                <Input
                                    className="h-[57px] rounded-xl py-4 pr-16 pl-6 font-['Poppins-Regular',Helvetica] text-xl text-gray-500"
                                    placeholder="Cari alat tulis ...."
                                />
                                <div className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-[#153e98]">
                                    <Search className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <img className="h-[445px] w-[445px] object-cover" alt="Stationery products" src="images/hero_book.png" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
