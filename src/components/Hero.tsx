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
              <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-black/40">
                <svg viewBox="0 0 400 240" className="w-full h-52 object-cover">
                  <defs>
                    <radialGradient id="charcoalGrad" cx="50%" cy="50%" r="60%">
                      <stop offset="0%" stopColor="#27272A" />
                      <stop offset="100%" stopColor="#09090B" />
                    </radialGradient>
                  </defs>
                  <rect width="400" height="240" fill="url(#charcoalGrad)" />
                  {/* Grill grid lines */}
                  <g stroke="#3F3F46" strokeWidth="1.5" opacity="0.4">
                    <line x1="40" y1="20" x2="360" y2="220" />
                    <line x1="80" y1="10" x2="380" y2="180" />
                    <line x1="20" y1="70" x2="320" y2="230" />
                    <line x1="360" y1="20" x2="40" y2="220" />
                    <line x1="380" y1="70" x2="80" y2="230" />
                  </g>
                  {/* Sizzling pan & steak */}
                  <ellipse cx="200" cy="120" rx="130" ry="75" fill="#18181B" stroke="#52525B" strokeWidth="4" />
                  <g transform="translate(115, 65)">
                    <path
                      d="M30 25 C60 5, 140 10, 155 40 C170 70, 160 105, 130 115 C90 125, 45 115, 20 95 C5 75, 10 45, 30 25 Z"
                      fill="#7F1D1D"
                      stroke="#991B1B"
                      strokeWidth="2"
                    />
                    {/* Marbling */}
                    <path d="M50 35 Q85 45 115 35 Q135 45 145 65" stroke="#FEE2E2" strokeWidth="2.5" fill="none" opacity="0.75" />
                    <path d="M45 65 Q80 75 110 65 Q130 75 140 90" stroke="#FEE2E2" strokeWidth="2.5" fill="none" opacity="0.7" />
                    {/* Butter & Rosemary */}
                    <circle cx="85" cy="55" r="10" fill="#FDE68A" opacity="0.9" />
                    <path d="M80 80 Q105 65 130 75" stroke="#15803D" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </g>
                </svg>
                {/* Floating pill badge */}
                <div className="absolute bottom-3 left-3 bg-neutral-950/90 backdrop-blur border border-neutral-700 rounded px-2.5 py-1 text-[11px] text-neutral-300">
                  <span className="text-amber-400 font-semibold">%100 Yerli Besi</span> · Balıkesir & Trakya Meraları
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
              1905
            </span>
            <h4 className="text-sm font-semibold text-white mt-1">120 Yıllık Tecrübe</h4>
            <p className="text-xs text-neutral-400 mt-0.5">Dört kuşaktır aktarılan geleneksel Türk kasaplık mirası</p>
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
