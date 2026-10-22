import React from 'react';
import { ShoppingBag, Sliders, Menu, X, ShieldCheck } from 'lucide-react';
import { SiteConfig } from '../types';
import { OzlemceLogo } from './OzlemceLogo';

interface NavbarProps {
  config: SiteConfig;
  cartCount: number;
  onOpenCart: () => void;
  onOpenCustomizer: () => void;
  onOpenAdmin?: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  cartCount,
  onOpenCart,
  onOpenCustomizer,
  onOpenAdmin,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'urunler', label: 'Taze Et Kataloğu' },
    { id: 'anatomi-rehberi', label: 'Karkas Anatomisi' },
    { id: 'pisirme-hesaplayici', label: 'Mühürleme Asistanı' },
    { id: 'soguk-zincir', label: 'Soğuk Zincir (+4°C)' },
    { id: 'horeca', label: 'Horeca & Toptan' },
    { id: 'kurumsal', label: 'Entegre Tesis' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Butcher red top announcement strip */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-stone-900 text-white text-xs py-2 px-4 border-b border-red-950 text-center font-medium shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">{config.establishedYear || '1984'}'TEN BERİ</span>
          <span className="text-red-300">·</span>
          <span>İstanbul İçi Aynı Gün Frigorifik (+4°C) Soğuk Zincir Teslimat</span>
          <span className="hidden md:inline text-red-300">·</span>
          <span className="hidden md:inline">%100 Yerli Besi & Helal Kesim Garantisi</span>
        </div>
      </div>

      {/* Main Top Bar adhering strictly to 3-zone contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Official Özlemce Logo */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="text-left group flex items-center gap-3 cursor-pointer shrink-0 focus-visible:outline-none"
            aria-label="Özlemce Et Entegre Tesisi Anasayfa"
          >
            <OzlemceLogo size="md" />
          </button>

          {/* Zone 2: 4-5 Clean single-line nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-700">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative hover:text-red-700 cursor-pointer ${
                  activeSection === link.id ? 'text-red-700 font-extrabold' : 'text-stone-700'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-700 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Cart / Customizer */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Store Admin Panel button */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                title="Mağaza & Sipariş Yönetim Paneli"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-stone-800 bg-stone-100 border border-stone-300 hover:border-red-400 rounded-md hover:bg-stone-50 hover:text-red-700 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
                <span className="hidden md:inline">Yönetim Paneli</span>
              </button>
            )}

            {/* Visual Site Customizer & Code Exporter */}
            <button
              onClick={onOpenCustomizer}
              title="Site Tasarım & Özelleştirme Sihirbazı"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 border border-stone-300 rounded-md hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sliders className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden xl:inline">Tasarım</span>
            </button>

            {/* Shopping Cart button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-sm shadow-red-700/20"
              aria-label="Alışveriş Sepeti"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Sepetim</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-black bg-amber-400 text-stone-950 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 cursor-pointer"
              aria-label="Menüyü Aç"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 px-6 py-4 space-y-3 shadow-md">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="block w-full text-left py-2 text-base font-semibold text-stone-800 hover:text-red-700 border-b border-stone-100"
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
                className="w-full text-center py-2.5 text-xs font-bold bg-red-700 text-white rounded-md hover:bg-red-800"
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
