import React from 'react';
import { ShoppingBag, Sliders, Menu, X, ShieldCheck } from 'lucide-react';
import { SiteConfig } from '../types';

interface NavbarProps {
  config: SiteConfig;
  cartCount: number;
  onOpenCart: () => void;
  onOpenCustomizer: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  cartCount,
  onOpenCart,
  onOpenCustomizer,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'urunler', label: 'Ürünlerimiz' },
    { id: 'kurumsal', label: '1905 Mirası' },
    { id: 'pisirme-rehberi', label: 'Şefin Rehberi' },
    { id: 'horeca', label: 'Ev Dışı Tüketim' },
    { id: 'iletisim', label: 'İletişim' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Quiet top announcement strip */}
      <div className="bg-neutral-950 text-neutral-400 text-xs py-1.5 px-4 border-b border-neutral-800 text-center font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="text-amber-400 font-semibold">1905'TEN BERİ</span>
          <span className="text-neutral-600">·</span>
          <span>İstanbul İçi Aynı Gün Frigorifik (+4°C) Soğuk Zincir Teslimat</span>
          <span className="hidden md:inline text-neutral-600">·</span>
          <span className="hidden md:inline">%100 Yerli Besi & Helal Kesim Garantisi</span>
        </div>
      </div>

      {/* Main Top Bar adhering strictly to 3-zone contract */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single text element in display face) */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="text-left group flex items-center gap-2 cursor-pointer shrink-0 focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-sm bg-red-700 flex items-center justify-center text-white font-black text-sm tracking-tighter">
              1905
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-white whitespace-nowrap group-hover:text-amber-400 transition-colors">
                {config.brandName}
              </span>
              <span className="text-[10px] tracking-widest text-neutral-400 uppercase -mt-1 font-semibold">
                Et & Et Ürünleri
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 Clean single-line nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative hover:text-white cursor-pointer ${
                  activeSection === link.id ? 'text-amber-400 font-semibold' : 'text-neutral-300'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Cart / Customizer */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Visual Site Customizer & Code Exporter */}
            <button
              onClick={onOpenCustomizer}
              title="Site Yönetim & Özelleştirme Sihirbazı"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Siteyi Düzenle & İndir</span>
            </button>

            {/* Shopping Cart button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
              aria-label="Alışveriş Sepeti"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Sepetim</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold bg-amber-400 text-neutral-950 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white cursor-pointer"
              aria-label="Menüyü Aç"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="block w-full text-left py-2 text-base font-medium text-neutral-300 hover:text-amber-400 border-b border-neutral-900"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onNavigate('horeca');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-xs font-semibold bg-neutral-800 text-white rounded-md"
              >
                Kurumsal / Horeca Teklif Al
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
