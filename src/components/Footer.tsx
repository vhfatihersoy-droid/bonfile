import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { SiteConfig } from '../types';
import { OzlemceLogo } from './OzlemceLogo';

interface FooterProps {
  config: SiteConfig;
  onNavigate: (sectionId: string) => void;
  onOpenCustomizer: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onNavigate, onOpenCustomizer, onOpenAdmin }) => {
  return (
    <footer id="iletisim" className="bg-stone-900 text-stone-400 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Heritage */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <OzlemceLogo variant="dark" size="md" />
            </div>

            <p className="text-stone-400 leading-relaxed max-w-sm">
              {config.establishedYear || '1984'} yılından bugüne Türk kasaplık kültürünün öncüsü. AB standartlarındaki entegre tesisimizde, %100 yerli besiden çiftlikten sofraya soğuk zincir güvencesiyle taze et, dağ kekikli marine seçkiler ve şarküteri üretimi.
            </p>

            <div className="pt-2 flex items-center gap-3 text-stone-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px]">TSE Helal Gıda & ISO 22000 Belgeli</span>
            </div>
          </div>

          {/* Col 2: Hızlı Bağlantılar */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hızlı Bağlantılar</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('urunler')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Tüm Ürünlerimiz
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('anatomi-rehberi')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Karkas & Kesim Anatomisi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pisirme-hesaplayici')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Mühürleme & Pişirme Asistanı
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('soguk-zincir')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Soğuk Zincir (+4°C) Takibi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kurumsal')} className="hover:text-red-400 transition-colors cursor-pointer">
                  {config.establishedYear || '1984'} Entegre Tesis Mirası
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('horeca')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Horeca & Kurumsal Tedarik
                </button>
              </li>
              {onOpenAdmin && (
                <li>
                  <button onClick={onOpenAdmin} className="text-red-400 hover:text-red-300 transition-colors cursor-pointer font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Yönetim Paneli (Kasap Girişi)</span>
                  </button>
                </li>
              )}
              <li>
                <button onClick={onOpenCustomizer} className="text-stone-400 hover:text-white transition-colors cursor-pointer">
                  Siteyi Özelleştir & İndir
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Ürün Kategorileri */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kategoriler</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('urunler')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Dry-Aged Steak Kesimleri
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('urunler')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Taze Dana Bonfile & Antrikot
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('urunler')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Balıkesir Kıvırcık Kuzu Eti
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('urunler')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Geleneksel Kasap Köfteler
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('urunler')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Doğal Fermente Kayseri Sucuk
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: İletişim & Fabrika Satış Mağazası */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tesis & İletişim</h4>
            <div className="space-y-2.5 text-stone-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  {config.address}, {config.city}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <a href={`tel:${config.phone}`} className="hover:text-white">
                  {config.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <a href={`mailto:${config.email}`} className="hover:text-white">
                  {config.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-stone-400">
                <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>Pzt - Cts: 08:00 - 18:30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} {config.brandName} Gıda Sanayi ve Ticaret A.Ş. Tüm hakları saklıdır.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="hover:text-stone-300 cursor-pointer">Kişisel Verilerin Korunması (KVKK)</span>
            <span className="text-stone-700">·</span>
            <span className="hover:text-stone-300 cursor-pointer">Çerez Politikası</span>
            <span className="text-stone-700">·</span>
            <span className="hover:text-stone-300 cursor-pointer">Mesafeli Satış Sözleşmesi</span>
            <span className="text-stone-700">·</span>
            <span className="hover:text-stone-300 cursor-pointer">Teslimat & İade Şartları</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
