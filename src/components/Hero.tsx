import React from 'react';
import { ArrowRight, Snowflake, ShieldCheck, Droplets, Leaf } from 'lucide-react';
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
    <section id="hero" className="relative bg-white text-stone-900 border-b border-stone-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Quiet, unboxed metadata kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-red-700 uppercase">
              <span>{config.establishedYear || '1984'}'ten Beri</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Entegre Tesis Güvencesi</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>%100 Yerli Besi</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-950 leading-[1.1]">
              Ustalıkla Dinlendirilmiş, <span className="text-red-700">Taze Et</span> Sofranızda
            </h1>

            {/* Editorial Body */}
            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-xl">
              Balıkesir ve Trakya yaylalarının seçkin besileri, Ayvalık sızma zeytinyağı ve taze dağ kekiğiyle marine ediliyor. +4°C kesintisiz soğuk zincirle en taze haliyle kapınıza ulaşıyor.
            </p>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreProducts}
                className="flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-red-700 hover:bg-red-800 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <span>Taze Et Kataloğunu İncele</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onRequestB2BQuote}
                className="px-6 py-3.5 text-sm font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                Entegre Tesis & Mirasımız
              </button>
            </div>

            {/* Minimalist Trust Features */}
            <div className="pt-6 border-t border-stone-100 grid grid-cols-3 gap-4 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Snowflake className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="font-medium">+4°C Frigo Lojistik</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">TSE Helal & ISO 22000</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium">Sızma Zeytinyağlı</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual - Single, High-Impact Editorial Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden bg-stone-100 shadow-lg group">
              <div className="aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=1200&auto=format&fit=crop&q=85"
                  alt="Özlemce Et - Taze Dağ Kekikli ve Sızma Zeytinyağlı Kırmızı Et"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Minimalist caption bar at bottom */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent p-6 flex items-end justify-between text-white">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-300">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dağ Kekiği & Çekilmiş Deniz Tuzu</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Özlemce Dry-Aged Dallas Steak
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-300 font-mono block">Himalaya Tuz Odası</span>
                  <span className="text-sm font-bold text-amber-300">28 Gün Dinlendirilmiş</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
