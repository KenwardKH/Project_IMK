import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="bg-[#1c283f] text-white px-6 py-12 md:px-12 lg:px-32" id="footer">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Bagian Atas: Logo dan Navigasi */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="md:col-span-1 flex items-start">
            <img
              src="/images/logo_apk.png"
              alt="Logo Sinar Pelangi"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Navigasi */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Tentang Kami */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Tentang Kami</h3>
              <p className="text-sm text-gray-300">
                Sinar Pelangi adalah penyedia alat tulis terpercaya sejak 1990.
              </p>
            </div>

            {/* Layanan */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Layanan</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#">Produk</a></li>
                <li><a href="#">Promo</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>

            {/* Bantuan */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Bantuan</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Kontak</a></li>
                <li><a href="#">Kebijakan Privasi</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator className="my-6 bg-white/20" />

        {/* Hak Cipta */}
        <div className="text-center text-sm text-gray-400">
          © 2025 Sinar Pelangi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
