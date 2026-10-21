import React from 'react';
import { ArrowRight, ShieldCheck, Snowflake, Award, Sparkles, PhoneCall } from 'lucide-react';
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
    <section id="hero" className="relative bg-neutral-950 text-white overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-neutral-800">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-900/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean unboxed heritage kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
              <span>{config.establishedYear}'ten Beri</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>Geleneksel Türk Kasaplık Sanatı</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>AB Onaylı Entegre Tesis</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              Ustalıkla Dinlendirilmiş, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">Gerçek Et Lezzeti</span> Sofranızda
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl font-normal leading-relaxed">
              Türkiye'nin öncü et üreticisi {config.brandName}; Beylikdüzü'ndeki 15.000 m² entegre tesisinde, %100 yerli besiden sofranıza uzanan kırılmayan +4°C soğuk zincir güvencesiyle en seçkin steakhouse kesimlerini, kuzu etlerini ve gurme şarküteri lezzetlerini sunar.
            </p>

            {/* Primary & Secondary Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreProducts}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-red-700 hover:bg-red-800 rounded-md transition-colors cursor-pointer shadow-lg shadow-red-950/50 whitespace-nowrap shrink-0"
              >
                <span>Ürünlerimizi Keşfedin</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onRequestB2BQuote}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-neutral-200 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Horeca & Kurumsal Tedarik</span>
              </button>
            </div>

            {/* Quick Contact & Dispatch hint */}
            <div className="pt-4 flex items-center gap-6 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Snowflake className="w-4 h-4 text-sky-400" />
                <span>+4°C Termobox Frigorifik Teslimat</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Veteriner Hekim & Helal Onaylı</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Marquee Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl p-6 space-y-5">
              {/* Top featured highlight banner */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Günün Şef Seçkisi</span>
                  <h3 className="text-lg font-bold text-white">Dry-Aged Dallas Steak & Bonfile</h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-red-950/80 text-red-300 border border-red-800/60 rounded">
                  28 Gün Dinlendirilmiş
                </span>
              </div>

              {/* Steak presentation visual */}
              <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 aspect-[16/10]">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80"
                  alt="Efecioğlu Dry-Aged Dallas Steak"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                {/* Floating pill badge */}
                <div className="absolute bottom-3 left-3 bg-neutral-950/90 backdrop-blur border border-neutral-700 rounded px-2.5 py-1 text-[11px] text-neutral-300">
                  <span className="text-amber-400 font-semibold">%100 Yerli Doğal Besi</span> · Balıkesir & Trakya Efecioğlu Çiftliği
                </div>
              </div>

              {/* Meat quality indicators */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-400 block text-[11px]">Dinlendirme</span>
                  <span className="text-white font-bold">28 Gün Kuru</span>
                </div>
                <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-400 block text-[11px]">Yağ Dağılımı</span>
                  <span className="text-white font-bold">A3 Mermerimsi</span>
                </div>
                <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-400 block text-[11px]">Teslimat</span>
                  <span className="text-white font-bold">+4°C Soğuk Zincir</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column KPI / Trust Strip below hero */}
        <div className="mt-16 pt-10 border-t border-neutral-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 block tracking-tight font-mono tabular-nums">
              {config.establishedYear || '1984'}
            </span>
            <h4 className="text-sm font-semibold text-white mt-1">40 Yılı Aşkın Tecrübe</h4>
            <p className="text-xs text-neutral-400 mt-0.5">Yıllardır süregelen doğal besi ve geleneksel kasaplık mirası</p>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight font-mono tabular-nums">
              15.000 m²
            </span>
            <h4 className="text-sm font-semibold text-white mt-1">AB Standartlarında Tesis</h4>
            <p className="text-xs text-neutral-400 mt-0.5">Beylikdüzü entegre et işleme ve soğuk hava lojistik merkezi</p>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-sky-400 block tracking-tight font-mono tabular-nums">
              +4°C
            </span>
            <h4 className="text-sm font-semibold text-white mt-1">Kırılmayan Soğuk Zincir</h4>
            <p className="text-xs text-neutral-400 mt-0.5">Frigorifik özel araçlar ve termobox buz akülü ambalajlama</p>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block tracking-tight font-mono tabular-nums">
              %100
            </span>
            <h4 className="text-sm font-semibold text-white mt-1">Helal & Yerli Besi</h4>
            <p className="text-xs text-neutral-400 mt-0.5">Veteriner hekim kontrollü, TSE ve ISO 22000 sertifikalı</p>
          </div>
        </div>
      </div>
    </section>
  );
};
