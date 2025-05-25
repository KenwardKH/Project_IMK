import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white" id="footer">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-8">

          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo_apk.png"
                alt="Logo Sinar Pelangi ATK"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Penyedia alat tulis kantor terpercaya sejak 1990.
              Melayani kebutuhan ATK untuk rumah, sekolah, dan kantor.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Informasi</h4>
            <nav className="space-y-3">
              <a
                href="/about"
                className="block text-sm text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
              >
                Tentang Kami
              </a>
              <a
                href="/contact"
                className="block text-sm text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
              >
                Kontak
              </a>
              <a
                href="/faq"
                className="block text-sm text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
              >
                FAQ
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Kontak Kami</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-slate-300">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>(021) 1234-5678</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-300">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>info@sinarpelangi.com</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-slate-300">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Jl. Pendidikan No. 123<br />Jakarta Selatan, 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-300">
                <Clock className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>Sen-Jum: 08:00-17:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator className="bg-slate-600 opacity-50" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 space-y-4 sm:space-y-0">
          <div className="text-sm text-slate-400">
            © 2025 Sinar Pelangi ATK. Hak cipta dilindungi.
          </div>
        </div>
      </div>
    </footer>
  );
}
