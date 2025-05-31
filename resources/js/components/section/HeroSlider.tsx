import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

// Hero Slider Component
export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const slides = [
        {
            id: 1,
            image: '/images/slider/1.jpg', // Ganti dengan path gambar cantik Anda
            alt: 'Premium Stationery Collection',
        },
        {
            id: 2,
            image: '/images/slider/2.jpg', // Ganti dengan path gambar cantik Anda
            alt: 'Office Supplies Excellence',
        },
        {
            id: 3,
            image: '/images/slider/3.jpg', // Ganti dengan path gambar cantik Anda
            alt: 'Quality School Supplies',
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            handleSlideChange((prev) => (prev + 1) % slides.length);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    const handleSlideChange = (newSlide) => {
        if (typeof newSlide === 'function') {
            newSlide = newSlide(currentSlide);
        }
        if (newSlide !== currentSlide) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentSlide(newSlide);
                setIsTransitioning(false);
            }, 150);
        }
    };

    const nextSlide = () => handleSlideChange((currentSlide + 1) % slides.length);
    const prevSlide = () => handleSlideChange((currentSlide - 1 + slides.length) % slides.length);

    return (
        <div className="group relative">
            {/* Main Slider Container */}
            <div className="relative mx-auto mt-6 h-[200px] max-w-[1200px] overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl md:h-[300px] lg:h-[450px]">
                {/* Image Slides */}
                <div className="relative h-full w-full">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-all duration-1000 ease-out ${
                                index === currentSlide
                                    ? 'scale-100 opacity-100'
                                    : index === (currentSlide - 1 + slides.length) % slides.length
                                      ? '-translate-x-full scale-110 opacity-0'
                                      : 'translate-x-full scale-90 opacity-0'
                            }`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.alt}
                                className={`h-full w-full object-cover object-top transition-transform duration-1000 ${
                                    index === currentSlide ? 'scale-100' : 'scale-105'
                                }`}
                            />

                            {/* Subtle Vignette Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10"></div>
                        </div>
                    ))}
                </div>

                {/* Luxury Navigation Arrows */}
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:px-8">
                    <button
                        onClick={prevSlide}
                        className="group/btn relative cursor-pointer rounded-full border border-white/20 bg-white/90 p-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-2xl md:p-5"
                    >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"></div>
                        <ChevronLeft className="relative z-10 h-6 w-6 text-gray-700 transition-colors duration-300 group-hover/btn:text-blue-600 md:h-7 md:w-7" />

                        {/* Ripple Effect */}
                        <div className="absolute inset-0 scale-0 rounded-full bg-blue-500/20 transition-all duration-500 group-hover/btn:scale-100 group-hover/btn:opacity-0"></div>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="group/btn relative cursor-pointer rounded-full border border-white/20 bg-white/90 p-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-2xl md:p-5"
                    >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"></div>
                        <ChevronRight className="relative z-10 h-6 w-6 text-gray-700 transition-colors duration-300 group-hover/btn:text-blue-600 md:h-7 md:w-7" />

                        {/* Ripple Effect */}
                        <div className="absolute inset-0 scale-0 rounded-full bg-blue-500/20 transition-all duration-500 group-hover/btn:scale-100 group-hover/btn:opacity-0"></div>
                    </button>
                </div>

                {/* Premium Dots Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-8">
                    <div className="flex items-center space-x-3 rounded-full border border-white/20 bg-black/20 px-6 py-3 backdrop-blur-xl">
                        {slides.map((_, index) => (
                            <button key={index} onClick={() => handleSlideChange(index)} className="group/dot relative">
                                <div
                                    className={`h-3 w-3 rounded-full transition-all duration-500 md:h-4 md:w-4 ${
                                        index === currentSlide ? 'scale-125 bg-white shadow-lg' : 'bg-white/40 hover:scale-110 hover:bg-white/70'
                                    }`}
                                />

                                {/* Active Indicator Ring */}
                                {index === currentSlide && (
                                    <div className="absolute inset-0 scale-150 animate-ping rounded-full border-2 border-white/50"></div>
                                )}

                                {/* Hover Glow */}
                                <div className="absolute inset-0 scale-0 rounded-full bg-white/30 opacity-0 transition-transform duration-300 group-hover/dot:scale-200 group-hover/dot:opacity-100"></div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Elegant Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
                    <div
                        className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-7000 ease-linear"
                        style={{
                            width: `${((currentSlide + 1) / slides.length) * 100}%`,
                            transition: isTransitioning ? 'none' : 'width 7s linear',
                        }}
                    ></div>
                </div>

                {/* Slide Counter Badge */}
                <div className="absolute top-6 right-6 md:top-8 md:right-8">
                    <div className="rounded-2xl border border-white/20 bg-black/30 px-4 py-2 backdrop-blur-xl">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-white md:text-base">{String(currentSlide + 1).padStart(2, '0')}</span>
                            <div className="h-px w-8 bg-white/50"></div>
                            <span className="text-sm text-white/70 md:text-base">{String(slides.length).padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 h-20 w-20 rounded-tl-3xl border-t-4 border-l-4 border-white/30"></div>
                <div className="absolute top-0 right-0 h-20 w-20 rounded-tr-3xl border-t-4 border-r-4 border-white/30"></div>
                <div className="absolute bottom-0 left-0 h-20 w-20 rounded-bl-3xl border-b-4 border-l-4 border-white/30"></div>
                <div className="absolute right-0 bottom-0 h-20 w-20 rounded-br-3xl border-r-4 border-b-4 border-white/30"></div>
            </div>

            {/* Reflection Effect */}
            {/* <div className="relative h-32 overflow-hidden">
                <div className="absolute inset-0 origin-top scale-y-75 transform rounded-b-3xl bg-gradient-to-b from-black/5 via-transparent to-transparent">
                    <img
                        src={slides[currentSlide].image}
                        alt="reflection"
                        className="h-full w-full scale-y-[-1] transform object-cover opacity-20 blur-sm"
                    />
                </div>
            </div> */}
        </div>
    );
}
