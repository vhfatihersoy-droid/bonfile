import React, { useState } from 'react';
import { ShoppingBag, Sliders, Menu, X, ShieldCheck, Search, Flame, Snowflake, Phone, ChevronRight } from 'lucide-react';
import { SiteConfig, MeatCategory } from '../types';
import { OzlemceLogo } from './OzlemceLogo';

interface NavbarProps {
  config: SiteConfig;
  cartCount: number;
  cartTotal?: number;
  onOpenCart: () => void;
  onOpenCustomizer: () => void;
  onOpenAdmin?: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSelectCategory?: (category: MeatCategory) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  cartCount,
  cartTotal = 0,
  onOpenCart,
  onOpenCustomizer,
  onOpenAdmin,
  activeSection,
  onNavigate,
  searchQuery = '',
  onSearchChange,
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const subCategories: { id: MeatCategory; label: string }[] = [
    { id: 'all', label: 'Tüm Etler' },
    { id: 'steak', label: 'Steakhouse Kesimleri' },
    { id: 'beef', label: 'Taze Dana Eti' },
    { id: 'lamb', label: 'Kıvırcık Kuzu' },
    { id: 'meatball', label: 'Köfte & Burger' },
    { id: 'charcuterie', label: 'Şarküteri & Sucuk' },
    { id: 'doner', label: 'Yaprak Döner' },
    { id: 'horeca', label: 'Horeca B2B' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(localSearch);
    }
    onNavigate('urunler');
  };

  const handleCategoryClick = (catId: MeatCategory) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    onNavigate('urunler');
    setMobileMenuOpen(false);
  };

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* 1. Top Utility & Announcement Strip (Bonfilet Style) */}
      <div className="bg-stone-900 text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-red-700 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider">
              {config.establishedYear || '1984'}'TEN BERİ
            </span>
            <span className="text-stone-300 hidden sm:inline">
              İstanbul İçi Aynı Gün Frigorifik (+4°C) Soğuk Zincir Teslimat
            </span>
          </div>

          <div className="flex items-center gap-5 text-[11px] font-medium text-stone-300">
            <span className="hidden md:inline text-amber-400 font-semibold">
              {config.freeShippingThreshold.toLocaleString('tr-TR')} TL ve Üzeri Ücretsiz Kargo
            </span>
            <a
              href={`tel:${config.phone.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>{config.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Brand & Search Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Brand Logo */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="text-left group flex items-center gap-2 cursor-pointer shrink-0 focus-visible:outline-none"
            aria-label="Özlemce Et Entegre Tesisi Anasayfa"
          >
            <OzlemceLogo size="md" />
          </button>

          {/* Bonfilet-style Integrated Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl relative"
          >
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              placeholder="Dana bonfile, Dallas steak, köfte veya sucuk ara..."
              className="w-full pl-10 pr-24 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-full text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-700 focus:bg-white focus:ring-1 focus:ring-red-700 transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 text-xs font-bold bg-red-700 hover:bg-red-800 text-white rounded-full transition-colors cursor-pointer"
            >
              Ara
            </button>
          </form>

          {/* Quick Shortcuts & Cart */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Quick Searing Calculator shortcut */}
            <button
              onClick={() => handleLinkClick('pisirme-hesaplayici')}
              title="Steak Mühürleme Hesaplayıcısı"
              className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-red-700 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
            >
              <Flame className="w-4 h-4 text-red-600" />
              <span>Pişirme Asistanı</span>
            </button>

            {/* Quick Cold Chain shortcut */}
            <button
              onClick={() => handleLinkClick('soguk-zincir')}
              title="Soğuk Zincir Sıcaklık Monitörü"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-red-700 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
            >
              <Snowflake className="w-4 h-4 text-sky-600" />
              <span>Soğuk Zincir (+4°C)</span>
            </button>

            {/* Admin Management Dashboard */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                title="Mağaza & Sipariş Yönetim Paneli"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-stone-800 bg-stone-100 border border-stone-200 hover:border-red-400 rounded-lg hover:bg-stone-50 hover:text-red-700 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-red-700" />
                <span className="hidden sm:inline">Yönetim</span>
              </button>
            )}

            {/* Customizer */}
            <button
              onClick={onOpenCustomizer}
              title="Site Tasarım & Özelleştirme"
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-stone-600" />
            </button>

            {/* Shopping Cart button with Price & Count (Bonfilet Style) */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-all cursor-pointer shadow-md shadow-red-700/20 hover:scale-102"
              aria-label="Alışveriş Sepeti"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 text-stone-950 font-black text-[10px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left leading-tight hidden sm:flex">
                <span className="text-[10px] text-red-200 font-medium">Sepetim</span>
                <span className="text-xs font-black font-mono">
                  {cartTotal > 0 ? `${cartTotal.toLocaleString('tr-TR')} TL` : '0 TL'}
                </span>
              </div>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 cursor-pointer"
              aria-label="Menüyü Aç"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 3. Bonfilet Sub-Navigation Ribbon (Horizontal Category Bar) */}
        <div className="bg-stone-50 border-t border-stone-200 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between gap-1 py-1.5 overflow-x-auto scrollbar-none text-xs font-bold text-stone-700">
              <div className="flex items-center gap-1">
                {subCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="px-3 py-1.5 rounded-md hover:bg-red-700 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pl-4 border-l border-stone-300">
                <button
                  onClick={() => handleLinkClick('anatomi-rehberi')}
                  className="px-2.5 py-1 text-red-700 hover:text-red-900 font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  Karkas Anatomisi
                </button>
                <button
                  onClick={() => handleLinkClick('kurumsal')}
                  className="px-2.5 py-1 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Entegre Tesis
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-stone-200 px-6 py-4 space-y-4 shadow-xl">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                placeholder="Ürün ara..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </form>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Kategoriler
              </span>
              {subCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="block w-full text-left py-2 text-sm font-semibold text-stone-800 hover:text-red-700 border-b border-stone-100 flex items-center justify-between"
                >
                  <span>{cat.label}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-200">
              <button
                onClick={() => handleLinkClick('anatomi-rehberi')}
                className="block w-full text-left py-1.5 text-xs font-bold text-red-700"
              >
                🥩 Karkas & Kesim Anatomisi
              </button>
              <button
                onClick={() => handleLinkClick('pisirme-hesaplayici')}
                className="block w-full text-left py-1.5 text-xs font-bold text-stone-800"
              >
                🔥 Steak Mühürleme Hesaplayıcısı
              </button>
              <button
                onClick={() => handleLinkClick('soguk-zincir')}
                className="block w-full text-left py-1.5 text-xs font-bold text-sky-700"
              >
                ❄️ Soğuk Zincir (+4°C) Takibi
              </button>
              <button
                onClick={() => handleLinkClick('horeca')}
                className="w-full text-center py-2.5 text-xs font-bold bg-red-700 text-white rounded-lg hover:bg-red-800 mt-2"
              >
                Horeca & Kurumsal Tedarik
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
