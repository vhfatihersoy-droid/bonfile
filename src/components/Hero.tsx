import React from 'react';
import { ArrowRight, ShieldCheck, Snowflake, Sparkles, Droplets, Leaf } from 'lucide-react';
import { SiteConfig } from '../types';

interface HeroProps {
  config: SiteConfig;
  onExploreProducts: () => void;
  onRequestB2BQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  config,
  onExploreProducts,
  onRequestB2BQuote,
}) => {
  return (
    <section id="hero" className="relative bg-gradient-to-b from-stone-50 via-white to-red-50/30 text-stone-900 overflow-hidden pt-8 pb-14 lg:pt-14 lg:pb-20 border-b border-stone-200">
      {/* Background ambient warmth */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-100 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-100/70 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Proposition + Appetizing Flank Preview */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean heritage kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-xs font-bold tracking-wider text-red-800 uppercase shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span>{config.establishedYear}'ten Beri</span>
              <span aria-hidden="true" className="text-red-300">·</span>
              <span>Geleneksel Türk Kasaplığı</span>
              <span aria-hidden="true" className="text-red-300">·</span>
              <span>%100 Yerli Besi</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-950 leading-tight" style={{ textWrap: 'balance' }}>
              Ustalıkla Dinlendirilmiş, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-rose-700 to-red-900">Gerçek Et Lezzeti</span> Sofranızda
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl font-normal leading-relaxed">
              {config.brandName}; Balıkesir ve Trakya yaylalarından gelen doğal besileri, soğuk sıkım sızma zeytinyağı ve taze dağ kekiği ile buluşturuyor. Kırılmayan +4°C soğuk zincir güvencesiyle en seçkin steakhouse kesimlerini kapınıza ulaştırıyoruz.
            </p>

            {/* Left Flanking Appetizing Visual Card: Fresh Raw Meat with Olive Oil & Thyme */}
            <div className="bg-white border border-stone-200 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 max-w-xl">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80"
                  alt="Taze Kekik ve Sızma Zeytinyağlı Kırmızı Et"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-1 left-1 bg-red-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                  ÖZEL MARİNE
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Taze Dağ Kekiği & Sızma Zeytinyağlı</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900 leading-tight">
                  Taze Dana Antrikot & Bonfile Marinasyonları
                </h4>
                <p className="text-xs text-stone-500 leading-snug">
                  Kazdağı kekiği, Ayvalık sızma zeytinyağı ve çekilmiş deniz tuzu kristalleriyle harmanlanmış taze kırmızı et seçkisi.
                </p>
              </div>
            </div>

            {/* Primary & Secondary Action buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreProducts}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 rounded-lg transition-all cursor-pointer shadow-lg shadow-red-700/20 hover:shadow-xl hover:shadow-red-700/30 whitespace-nowrap shrink-0"
              >
                <span>Ürünlerimizi Keşfedin</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onRequestB2BQuote}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-stone-800 bg-white border border-stone-300 hover:border-red-400 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
              >
                <span>Horeca & Kurumsal Tedarik</span>
              </button>
            </div>

            {/* Quick Contact & Dispatch hint */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-stone-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Snowflake className="w-4 h-4 text-sky-600" />
                <span>+4°C Termobox Frigorifik Teslimat</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Veteriner Hekim & Helal Onaylı</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-amber-600" />
                <span>Doğal Sızma Zeytinyağlı</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Marquee Showcase (Prime Red Meat with Thyme & Olive Oil) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-xl p-5 space-y-4">
              {/* Top featured highlight banner */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    <span className="text-xs uppercase tracking-wider text-red-700 font-extrabold">Şefin Özel Seçkisi</span>
                  </div>
                  <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
                    Kekikli & Zeytinyağlı Dry-Aged Dallas Steak
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-red-100 text-red-800 border border-red-200 rounded-md">
                  28 Gün Dinlendirilmiş
                </span>
              </div>

              {/* Steak presentation visual with thyme & olive oil */}
              <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 aspect-[16/11] group">
                <img
                  src="https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=1000&auto=format&fit=crop&q=80"
                  alt="Kırmızı et üstünde kekik ve zeytinyağlı lezzet"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating tags */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-stone-200 rounded-md px-2.5 py-1 text-[11px] font-bold text-stone-900 shadow-sm flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Taze Kekik & Çekilmiş Deniz Tuzu</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-stone-900/90 backdrop-blur-xs border border-stone-700/60 rounded-md px-3 py-1.5 text-xs text-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sızma Zeytinyağıyla Marine Edilmiş</span>
                  </div>
                  <span className="text-amber-300 font-bold">%100 Doğal Besi</span>
                </div>
              </div>

              {/* Meat quality indicators in clean light cards */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Dinlendirme</span>
                  <span className="text-red-700 font-extrabold">28 Gün Kuru</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Yağ Dağılımı</span>
                  <span className="text-stone-900 font-extrabold">A3 Mermer Doku</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Teslimat</span>
                  <span className="text-stone-900 font-extrabold">+4°C Frigorifik</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flanking Appetizing Showcase: Red Meat with Thyme & Olive Oil Highlight Strip */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-red-700 font-bold block">Gurme Kasap Tezgahı</span>
              <h3 className="text-lg font-extrabold text-stone-900">Zeytinyağlı & Dağ Kekikli Özel Hazırlanan Seçkilerimiz</h3>
            </div>
            <button
              onClick={onExploreProducts}
              className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Tümünü Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Flank Card 1 */}
            <div className="group bg-white border border-stone-200 rounded-xl p-3 flex items-center gap-3 shadow-2xs hover:shadow-md hover:border-red-300 transition-all cursor-pointer" onClick={onExploreProducts}>
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=300&auto=format&fit=crop&q=80"
                  alt="Zeytinyağlı Taze Kekikli Dana Antrikot"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">Steak Kesimi</span>
                <h4 className="text-xs font-bold text-stone-900 group-hover:text-red-700 transition-colors">
                  Kekikli Dana Antrikot
                </h4>
                <p className="text-[11px] text-stone-500 line-clamp-1">
                  Sızma zeytinyağı ve taze kekik ile marine
                </p>
              </div>
            </div>

            {/* Flank Card 2 */}
            <div className="group bg-white border border-stone-200 rounded-xl p-3 flex items-center gap-3 shadow-2xs hover:shadow-md hover:border-red-300 transition-all cursor-pointer" onClick={onExploreProducts}>
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80"
                  alt="Dry-Aged Dallas Steak ve Baharatlar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">Dry-Aged 28 Gün</span>
                <h4 className="text-xs font-bold text-stone-900 group-hover:text-red-700 transition-colors">
                  Dry-Aged Dallas Steak
                </h4>
                <p className="text-[11px] text-stone-500 line-clamp-1">
                  Deniz tuzu ve dağ kekiği eşliğinde
                </p>
              </div>
            </div>

            {/* Flank Card 3 */}
            <div className="group bg-white border border-stone-200 rounded-xl p-3 flex items-center gap-3 shadow-2xs hover:shadow-md hover:border-red-300 transition-all cursor-pointer" onClick={onExploreProducts}>
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1558030006-450675393462?w=300&auto=format&fit=crop&q=80"
                  alt="Zeytinyağı banyolu lokum bonfile"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">Özel Kesim</span>
                <h4 className="text-xs font-bold text-stone-900 group-hover:text-red-700 transition-colors">
                  Zeytinyağlı Lokum Bonfile
                </h4>
                <p className="text-[11px] text-stone-500 line-clamp-1">
                  Ağızda dağılan yumuşak doku & aromatik kekik
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column KPI / Trust Strip below hero */}
        <div className="mt-12 pt-8 border-t border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div>
            <span className="text-2xl sm:text-3xl font-black text-red-700 block tracking-tight font-mono tabular-nums">
              {config.establishedYear || '1984'}
            </span>
            <h4 className="text-sm font-bold text-stone-900 mt-1">40 Yılı Aşkın Tecrübe</h4>
            <p className="text-xs text-stone-500 mt-0.5">Doğal besi ve geleneksel kasaplık mirası</p>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-stone-900 block tracking-tight font-mono tabular-nums">
              15.000 m²
            </span>
            <h4 className="text-sm font-bold text-stone-900 mt-1">AB Standartlarında Tesis</h4>
            <p className="text-xs text-stone-500 mt-0.5">Beylikdüzü entegre et işleme & soğuk zincir lojistik</p>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-sky-700 block tracking-tight font-mono tabular-nums">
              +4°C
            </span>
            <h4 className="text-sm font-bold text-stone-900 mt-1">Kırılmayan Soğuk Zincir</h4>
            <p className="text-xs text-stone-500 mt-0.5">Frigorifik özel araçlar & termobox teslimat</p>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 block tracking-tight font-mono tabular-nums">
              %100
            </span>
            <h4 className="text-sm font-bold text-stone-900 mt-1">Helal & Yerli Besi</h4>
            <p className="text-xs text-stone-500 mt-0.5">Veteriner hekim kontrollü, TSE Helal sertifikalı</p>
          </div>
        </div>
      </div>
    </section>
  );
};

