import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';
import { HelpCircle, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS, Step } from 'react-joyride';

interface User {
    id: number;
    name: string;
    email: string;
}

interface PageProps {
    auth: {
        user: User | null;
    };
}

interface TutorialTourProps {
    isDropdownOpen: boolean;
    setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TutorialTour = ({ isDropdownOpen, setIsDropdownOpen }: TutorialTourProps) => {
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;
    // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [tourState, setTourState] = useState({
        run: false,
        stepIndex: 0,
        steps: [
            {
                target: 'body',
                content: (
                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-3">
                                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h3 className="mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
                            Selamat Datang di Sinar Pelangi ATK! ✨
                        </h3>
                        <p className="mb-4 leading-relaxed text-gray-600">
                            Kami akan memandu Anda mengenal fitur-fitur utama aplikasi toko alat tulis kantor kami dengan pengalaman belanja yang
                            mudah dan menyenangkan.
                        </p>
                        <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                            <p className="text-sm font-medium text-blue-700">
                                💡 Tutorial ini hanya 2-3 menit dan akan membantu Anda berbelanja dengan lebih efisien
                            </p>
                        </div>
                    </div>
                ),
                placement: 'center' as const,
                disableBeacon: true,
            },
            {
                target: 'img[alt="Logo"]',
                content: (
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="rounded-lg bg-blue-100 p-2">
                                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-bold text-blue-700">Logo Sinar Pelangi</h4>
                        </div>
                        <p className="mb-3 text-sm text-gray-600">
                            Klik logo ini kapan saja untuk kembali ke halaman beranda dan melihat produk-produk terbaru kami.
                        </p>
                        <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-3">
                            <p className="text-xs text-blue-700">
                                <strong>Tips:</strong> Logo selalu menjadi jalan pintas tercepat ke halaman utama!
                            </p>
                        </div>
                    </div>
                ),
                placement: 'bottom' as const,
            },
            {
                target: 'a[href="/products"]',
                content: (
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="rounded-lg bg-indigo-100 p-2">
                                <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-bold text-indigo-700">Katalog Produk</h4>
                        </div>
                        <p className="mb-3 text-sm text-gray-600">
                            Jelajahi koleksi lengkap alat tulis kantor kami, dari pulpen premium hingga peralatan kantor profesional.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-md bg-indigo-50 p-2">
                                <span className="font-medium text-indigo-700">📝 Alat Tulis</span>
                            </div>
                            <div className="rounded-md bg-blue-50 p-2">
                                <span className="font-medium text-blue-700">📄 Kertas & Map</span>
                            </div>
                            <div className="rounded-md bg-purple-50 p-2">
                                <span className="font-medium text-purple-700">✂️ Peralatan</span>
                            </div>
                            <div className="rounded-md bg-cyan-50 p-2">
                                <span className="font-medium text-cyan-700">🖥️ Elektronik</span>
                            </div>
                        </div>
                    </div>
                ),
                placement: 'bottom' as const,
            },
            {
                target: 'button[aria-label="Keranjang Belanja"]',
                content: (
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="rounded-lg bg-emerald-100 p-2">
                                <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6.5-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6.5-5a2 2 0 00-2-2H9a2 2 0 00-2 2"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-bold text-emerald-700">Keranjang Belanja 🛒</h4>
                        </div>
                        <p className="mb-3 text-sm text-gray-600">
                            Kelola semua item pilihan Anda sebelum melakukan checkout. Anda dapat mengubah jumlah atau menghapus item di sini.
                        </p>
                        <div className="space-y-2">
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                                <p className="mb-1 text-xs font-medium text-emerald-700">Fitur Keranjang:</p>
                                <ul className="space-y-1 text-xs text-emerald-600">
                                    <li>• Badge menunjukkan jumlah item</li>
                                    <li>• Hitung total otomatis</li>
                                    <li>• Simpan untuk nanti</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ),
                placement: 'bottom' as const,
            },
            {
                target: '[data-tour="avatar-button"]',
                content: (
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="rounded-lg bg-violet-100 p-2">
                                <svg className="h-5 w-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-bold text-violet-700">Menu Profil Anda 👤</h4>
                        </div>
                        <p className="mb-3 text-sm text-gray-600">
                            Klik tombol ini untuk membuka menu dengan berbagai opsi penting untuk mengelola akun Anda.
                        </p>
                        <div className="rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-blue-50 p-4">
                            <p className="mb-2 text-sm font-bold text-violet-700">Mari kita buka menu ini! 👇</p>
                            <p className="text-xs text-violet-600">
                                Klik tombol "Selanjutnya" dan menu akan terbuka otomatis untuk menunjukkan semua fitur yang tersedia.
                            </p>
                        </div>
                    </div>
                ),
                placement: 'bottom' as const,
            },
            {
                target: 'a[href="/settings/profile"]',
                content: (
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="rounded-lg bg-blue-100 p-2">
                                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-blue-700">Pengaturan Profil ⚙️</h4>
                        </div>
                        <p className="mb-3 text-sm text-gray-600">
                            Update dan kelola informasi pribadi Anda untuk pengalaman berbelanja yang lebih personal.
                        </p>
                        <div className="space-y-2">
                            <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-3">
                                <p className="mb-1 text-xs font-medium text-blue-700">Yang bisa Anda atur:</p>
                                <ul className="space-y-1 text-xs text-blue-600">
                                    <li>📝 Nama lengkap dan info kontak</li>
                                    <li>📍 Alamat pengiriman default</li>
                                    <li>🔒 Password dan keamanan akun</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ),
                placement: 'left' as const,
            },
            {
                target: 'a[href="/order/belum-bayar"]',
                content: (
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="rounded-lg bg-amber-100 p-2">
                                <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-bold text-amber-700">Pesanan Saya 📦</h4>
                        </div>
                        <div className="mb-3 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-3">
                            <p className="text-sm font-bold text-amber-700">🌟 Fitur Paling Penting!</p>
                            <p className="mt-1 text-xs text-amber-600">
                                Pantau semua pesanan Anda dari mulai pembayaran hingga barang sampai di tangan.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-2">
                                <div className="mb-1 flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                                    <span className="font-medium text-yellow-700">Belum Bayar</span>
                                </div>
                                <p className="text-yellow-600">Menunggu pembayaran</p>
                            </div>
                            <div className="rounded-md border border-orange-200 bg-orange-50 p-2">
                                <div className="mb-1 flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                                    <span className="font-medium text-orange-700">Diproses</span>
                                </div>
                                <p className="text-orange-600">Sedang dikemas</p>
                            </div>
                            <div className="rounded-md border border-blue-200 bg-blue-50 p-2">
                                <div className="mb-1 flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                                    <span className="font-medium text-blue-700">Dikirim</span>
                                </div>
                                <p className="text-blue-600">Dalam perjalanan</p>
                            </div>
                            <div className="rounded-md border border-green-200 bg-green-50 p-2">
                                <div className="mb-1 flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                    <span className="font-medium text-green-700">Selesai</span>
                                </div>
                                <p className="text-green-600">Sudah diterima</p>
                            </div>
                        </div>
                    </div>
                ),
                placement: 'left' as const,
            },
            {
                target: '#buttonlogout',

                content: (
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="rounded-lg bg-red-100 p-2">
                                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-bold text-red-700">Logout Aman 🔐</h4>
                        </div>
                        <p className="mb-3 text-sm text-gray-600">
                            Keluar dari akun Anda dengan aman ketika selesai berbelanja, terutama jika menggunakan komputer umum.
                        </p>
                        <div className="rounded-lg border-l-4 border-red-400 bg-red-50 p-3">
                            <p className="text-xs text-red-700">
                                <strong>Keamanan:</strong> Selalu logout setelah selesai, terutama di perangkat yang dibagi dengan orang lain.
                            </p>
                        </div>
                    </div>
                ),
                placement: 'left' as const,
            },
            {
                target: 'body',
                content: (
                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="rounded-full bg-gradient-to-r from-green-400 to-blue-500 p-4">
                                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h3 className="mb-3 bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
                            Selamat! Tutorial Selesai! 🎉
                        </h3>
                        <p className="mb-4 leading-relaxed text-gray-600">
                            Anda sekarang siap untuk menjelajahi dan berbelanja alat tulis kantor berkualitas tinggi di Sinar Pelangi ATK.
                        </p>
                        <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4">
                            <p className="mb-3 text-sm font-bold text-blue-700">🎯 Tips Berbelanja Cerdas:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="rounded-lg border border-blue-100 bg-white/60 p-2">
                                    <span className="font-medium text-blue-700">💡 Bandingkan produk</span>
                                </div>
                                <div className="rounded-lg border border-indigo-100 bg-white/60 p-2">
                                    <span className="font-medium text-indigo-700">⭐ Baca ulasan</span>
                                </div>
                                <div className="rounded-lg border border-purple-100 bg-white/60 p-2">
                                    <span className="font-medium text-purple-700">🏷️ Cari promo</span>
                                </div>
                                <div className="rounded-lg border border-pink-100 bg-white/60 p-2">
                                    <span className="font-medium text-pink-700">❤️ Simpan favorit</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500">Butuh bantuan? Klik tombol bantuan di pojok kanan bawah kapan saja! 🆘</div>
                    </div>
                ),
                placement: 'center' as const,
            },
        ] as Step[],
    });

    // Improved function to handle dropdown interactions
    const handleDropdownInteraction = (action: 'open' | 'close') => {
        if (action === 'open' && !isDropdownOpen) {
            setIsDropdownOpen(true);
        } else if (action === 'close' && isDropdownOpen) {
            setIsDropdownOpen(false);
        }
    };

    const waitForDropdownElements = async (selector: string, timeout = 2000): Promise<boolean> => {
        const interval = 100;
        const maxAttempts = timeout / interval;
        let attempts = 0;

        return new Promise((resolve) => {
            const check = () => {
                if (document.querySelector(selector)) {
                    resolve(true);
                } else if (++attempts >= maxAttempts) {
                    resolve(false);
                } else {
                    setTimeout(check, interval);
                }
            };
            check();
        });
    };

    useEffect(() => {
        if (user && !localStorage.getItem(`atk_tutorial_completed_${user.id}`)) {
            const timer = setTimeout(() => {
                setTourState((prev) => ({ ...prev, run: true }));
            }, 300); // Bisa dikurangi
            return () => clearTimeout(timer);
        }
    }, [user]);

    const handleJoyrideCallback = async (data: CallBackProps) => {
        const { action, index, status, type } = data;

        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setTourState((prev) => ({ ...prev, run: false }));
            handleDropdownInteraction('close');
            markTutorialAsCompleted();
            return;
        }

        if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
            let nextIndex = index;

            if (action === ACTIONS.NEXT) {
                nextIndex = index + 1;

                // Jika next step adalah 5, buka dropdown dulu baru lanjutkan tour
                if (nextIndex >= 5 && nextIndex < 8) {
                    handleDropdownInteraction('open');

                    // Tunggu sampai dropdown element untuk step 5 muncul
                    const ready = await waitForDropdownElements('#dropdowntest');
                    if (!ready) {
                        console.warn('Dropdown element untuk step 5 tidak muncul tepat waktu.');
                        return;
                    }
                }

                // Tutup dropdown kalau sudah lewat step 8
                if (nextIndex > 7 && isDropdownOpen) {
                    handleDropdownInteraction('close');
                }
            } else if (action === ACTIONS.PREV) {
                nextIndex = index - 1;

                if (nextIndex < 5 && isDropdownOpen) {
                    handleDropdownInteraction('close');
                }

                if (nextIndex >= 5 && nextIndex <= 8 && !isDropdownOpen) {
                    handleDropdownInteraction('open');
                    await new Promise((r) => setTimeout(r, 300));
                }
            }

            // Jangan langsung setTourState stepIndex=5 jika dropdown belum siap
            setTourState((prev) => ({
                ...prev,
                stepIndex: nextIndex,
            }));
        }
    };

    const markTutorialAsCompleted = () => {
        if (user) {
            localStorage.setItem(`atk_tutorial_completed_${user.id}`, 'true');
            localStorage.setItem(`atk_tutorial_completed_at_${user.id}`, new Date().toISOString());
        }
    };

    const restartTour = () => {
        setTourState((prev) => ({
            ...prev,
            run: true,
            stepIndex: 0,
        }));
        setIsDropdownOpen(false);
    };

    const resetTutorial = () => {
        if (user) {
            localStorage.removeItem(`atk_tutorial_completed_${user.id}`);
            localStorage.removeItem(`atk_tutorial_completed_at_${user.id}`);
            restartTour();
        }
    };

    // Don't render if user is not logged in
    if (!user) return null;

    return (
        <>
            <Joyride
                callback={handleJoyrideCallback}
                continuous
                run={tourState.run}
                stepIndex={tourState.stepIndex}
                steps={tourState.steps}
                hideCloseButton={false}
                scrollToFirstStep
                showProgress
                showSkipButton
                disableOverlayClose
                disableScrolling={false}
                spotlightPadding={8}
                spotlightClicks={false}
                styles={{
                    options: {
                        primaryColor: '#1e40af',
                        textColor: '#374151',
                        backgroundColor: '#ffffff',
                        overlayColor: 'rgba(0, 0, 0, 0.75)', // Much darker overlay
                        spotlightShadow: '0 0 50px rgba(0, 0, 0, 0.8)', // Stronger spotlight shadow
                        zIndex: 10000,
                        width: 420,
                        arrowColor: '#ffffff',
                    },
                    overlay: {
                        backgroundColor: 'rgba(30, 41, 59, 0.6)', // slate-800 dengan opacity 60%
                    },
                    spotlight: {
                        borderRadius: '12px',
                        border: '3px solid #3b82f6', // Tetap pakai blue-500
                        boxShadow: `
    0 0 0 9999px rgba(30, 41, 59, 0.6),  /* Overlay yang tidak terlalu gelap */
    0 0 25px rgba(59, 130, 246, 0.6)     /* Glow biru yang lebih lembut */
  `,
                    },

                    tooltip: {
                        borderRadius: '16px',
                        fontSize: '14px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)',
                        border: 'none',
                        background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
                        backdropFilter: 'blur(10px)',
                        padding: 0,
                    },
                    tooltipContent: {
                        padding: '24px',
                        lineHeight: '1.6',
                        color: '#374151',
                    },
                    tooltipTitle: {
                        color: '#1f2937',
                        fontSize: '18px',
                        fontWeight: '700',
                        marginBottom: '12px',
                    },
                    buttonNext: {
                        backgroundColor: '#3b82f6', // blue-500
                        fontSize: '14px',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        transition: 'all 0.2s ease',
                    },
                    buttonBack: {
                        color: '#6b7280', // gray-500
                        marginRight: '16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: '#ffffff',
                        transition: 'all 0.2s ease',
                    },
                    buttonSkip: {
                        color: '#6b7280', // gray-500
                        fontSize: '14px',
                        fontWeight: '500',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: '#ffffff',
                        transition: 'all 0.2s ease',
                    },
                    buttonClose: {
                        color: '#ef4444', // red-500
                        fontSize: '18px',
                        fontWeight: 'bold',
                        padding: '8px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                    },
                    // spotlight: {
                    //     borderRadius: '12px',
                    //     transition: 'all 0.3s ease',
                    // },
                    // overlay: {
                    //     backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    //     backdropFilter: 'blur(2px)',
                    // },
                }}
                locale={{
                    back: '← Kembali',
                    // close: '✕',
                    last: '🎉 Selesai',
                    next: 'Selanjutnya →',
                    skip: 'Lewati',
                }}
            />

            {/* Enhanced Floating Help Button */}
            <div className="fixed right-6 bottom-6 z-40 flex flex-col gap-3">
                {localStorage.getItem(`atk_tutorial_completed_${user.id}`) && (
                    <Button
                        onClick={restartTour}
                        size="sm"
                        className="group h-14 w-14 rounded-full border-2 border-white/20 bg-gradient-to-r from-blue-500 to-indigo-600 p-0 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50"
                        title="Ulangi Tutorial"
                    >
                        <HelpCircle className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
                    </Button>
                )}

                {/* Reset Button (development only) */}
                {process.env.NODE_ENV === 'development' && (
                    <Button
                        onClick={resetTutorial}
                        size="sm"
                        variant="outline"
                        className="h-12 w-12 rounded-full border-2 border-blue-200 bg-white/90 p-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        title="Reset Tutorial (Dev Only)"
                    >
                        <RotateCcw className="h-4 w-4 text-blue-600" />
                    </Button>
                )}
            </div>
        </>
    );
};

export default TutorialTour;
