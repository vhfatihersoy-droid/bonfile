import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Snowflake, Droplets, Flame, Award } from 'lucide-react';
import { SiteConfig } from '../types';

interface BonfiletHeroSliderProps {
  config: SiteConfig;
  onExploreProducts: () => void;
  onRequestB2BQuote: () => void;
  onNavigateSection: (sectionId: string) => void;
}

interface SlideItem {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  titleHighlight: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  targetCategory?: string;
  targetSection?: string;
  image: string;
  accentNote: string;
}

const slides: SlideItem[] = [
  {
    id: 1,
    badge: 'HİMALAYA TUZ ODASI · 28 GÜN DRY-AGED',
    badgeColor: 'text-amber-300 bg-amber-950/70 border-amber-500/30',
    title: 'Ustalıkla Dinlendirilmiş,',
    titleHighlight: 'Gerçek Steakhouse',
    description: 'Himalaya tuz odalarında 28 gün olgunlaştırılan Dallas Steak, T-Bone ve lokum bonfileler. Taze dağ kekiği ve soğuk sıkım Ayvalık zeytinyağı ile sofranızda.',
    primaryButtonText: 'Steakhouse Kesimlerini Keşfet',
    secondaryButtonText: 'Şefin Pişirme Rehberi',
    targetSection: 'urunler',
    image: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=1600&auto=format&fit=crop&q=85',
    accentNote: 'Özel mermerleşmiş yerli besi antrikot seçkisi',
  },
  {
    id: 2,
    badge: '%100 YERLİ BESİ · GELENEKSEL BAHARAT',
    badgeColor: 'text-red-300 bg-red-950/70 border-red-500/30',
    title: 'Doğal Fermente Evlik Kangal',
    titleHighlight: 'Sucuk & Pastırma',
    description: 'Koruyucu ve yapay katkı maddesi içermeyen, geleneksel yöntemlerle kurutulmuş fermente sucuk, antrikot pastırma ve odun ateşinde pişmiş yaprak döner lezzeti.',
    primaryButtonText: 'Şarküteri Ürünlerini Gör',
    secondaryButtonText: 'Horeca / Toptan Tedarik',
    targetSection: 'urunler',
    image: 'https://images.unsplash.com/photo-1585325701165-351af916e581?w=1600&auto=format&fit=crop&q=85',
    accentNote: 'Kayseri ve Trakya reçetesiyle katkısız üretim',
  },
  {
    id: 3,
    badge: 'BALIKESİR & TRAKYA YAYLALARI · HELAL KESİM',
    badgeColor: 'text-emerald-300 bg-emerald-950/70 border-emerald-500/30',
    title: 'Kokusuz, Yumuşacık',
    titleHighlight: 'Kıvırcık Kuzu Pirzola',
    description: 'Doğal meralarda kekik ve yonca ile serbest otlayan yerli besiler. Ağır koku içermeyen, lokum kıvamında kuzu pirzola ve fırınlık kemikli incik çeşitleri.',
    primaryButtonText: 'Kuzu Çeşitlerini İncele',
    secondaryButtonText: 'Soğuk Zincir Güvencesi',
    targetSection: 'urunler',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&auto=format&fit=crop&q=85',
    accentNote: 'Veteriner hekim kontrollü hijyenik kesim',
  },
];

export const BonfiletHeroSlider: React.FC<BonfiletHeroSliderProps> = ({
  config,
  onExploreProducts,
  onRequestB2BQuote,
  onNavigateSection,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, 5500);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlide, isPaused]);

  const activeSlide = slides[currentSlide];

  return (
    <div
      className="relative w-full overflow-hidden bg-stone-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Canvas */}
      <div className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] flex items-center">
        {/* Background images with cross-fade */}
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover object-center filter brightness-[0.45]"
            />
            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />
          </div>
        ))}

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="max-w-2xl space-y-6">
            
            {/* Slide Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase border shadow-sm backdrop-blur-md bg-stone-900/80 border-stone-700 text-stone-200">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>{activeSlide.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              {activeSlide.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">
                {activeSlide.titleHighlight}
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl font-normal">
              {activeSlide.description}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => {
                  if (activeSlide.targetSection) {
                    onNavigateSection(activeSlide.targetSection);
                  } else {
                    onExploreProducts();
                  }
                }}
                className="flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-all cursor-pointer shadow-lg shadow-red-700/30 hover:scale-102"
              >
                <span>{activeSlide.primaryButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (activeSlide.id === 1) onNavigateSection('pisirme-hesaplayici');
                  else if (activeSlide.id === 2) onRequestB2BQuote();
                  else onNavigateSection('soguk-zincir');
                }}
                className="flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold text-stone-200 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors cursor-pointer backdrop-blur-md"
              >
                <span>{activeSlide.secondaryButtonText}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Previous / Next Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 z-30 p-2.5 rounded-full bg-black/40 hover:bg-red-700 text-white backdrop-blur-md transition-all cursor-pointer border border-white/10 hidden sm:flex items-center justify-center"
          aria-label="Önceki Slayt"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 z-30 p-2.5 rounded-full bg-black/40 hover:bg-red-700 text-white backdrop-blur-md transition-all cursor-pointer border border-white/10 hidden sm:flex items-center justify-center"
          aria-label="Sonraki Slayt"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators (Dots) */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 transition-all rounded-full cursor-pointer ${
                i === currentSlide ? 'w-8 bg-red-600' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slayt ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bonfilet-style 4-Pillar Trust Strip directly under slider */}
      <div className="bg-stone-900 border-t border-stone-800 text-stone-300 py-3.5 px-4 text-xs font-semibold">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <Snowflake className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Kırılmayan +4°C Frigo Lojistik</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Veteriner Kontrollü %100 Helal</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <Droplets className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Dağ Kekiği & Sızma Zeytinyağlı</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <Award className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Himalaya Tuz Odasında Dry-Aged</span>
          </div>
        </div>
      </div>
    </div>
  );
};
