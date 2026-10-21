import React from 'react';
import { Award, ShieldCheck, Factory, CheckCircle2, History, MapPin } from 'lucide-react';
import { certificates, facilityStats } from '../data/mockData';
import { SiteConfig } from '../types';

interface AboutFacilityProps {
  config: SiteConfig;
}

export const AboutFacility: React.FC<AboutFacilityProps> = ({ config }) => {
  return (
    <section id="kurumsal" className="py-16 bg-neutral-950 text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Heritage Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
              <span>Kurumsal Miras</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>{config.establishedYear}'ten Günümüze</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              40 Yılı Aşkın Et Ustalığı & Doğal Besi Kültürü
            </h2>

            <p className="text-sm text-neutral-300 leading-relaxed">
              {config.establishedYear} yılında temelleri atılan {config.brandName}, geleneksel kasaplık zanaatını modern gıda mühendisliği ve hayvan refahı standartlarıyla buluşturmuştur. Türkiye’de AB normlarında modern et işleme tesisine sahip öncü kuruluşlardan biri olarak, sofralarınıza gerçek et lezzetini en yüksek hijyen kriterleriyle ulaştırmaktayız.
            </p>

            <p className="text-sm text-neutral-400 leading-relaxed">
              Balıkesir ve Trakya yaylalarındaki doğal çiftliklerimizde serbest otlayan yerli besilerimiz; veteriner hekim gözetiminde, İslami usullere tam uygun helal kesim ve modern soğuk hava odalarında titizlikle işlenir.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs text-neutral-300">
                  <strong>Veteriner Hekim Kontrolü:</strong> Kesim öncesi ve sonrası patolojik ve mikrobiyolojik laboratuvar testleri.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs text-neutral-300">
                  <strong>Himalaya Tuz Odalarında Dinlendirme:</strong> Gerçek kuru dinlendirme (Dry-Aged) ile lif yumuşaması ve yoğun et aroması.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs text-neutral-300">
                  <strong>İzlenebilirlik:</strong> Her paketin üzerinde çiftlikten kesimhane ve üretim partisine kadar küpe numarası takip güvencesi.
                </span>
              </div>
            </div>
          </div>

          {/* Plant & Logistics Diagram */}
          <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Beylikdüzü Entegre Et Tesisi</h3>
              </div>
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>İstanbul / Beylikdüzü</span>
              </span>
            </div>

            {/* Metric Blocks */}
            <div className="grid grid-cols-2 gap-4">
              {facilityStats.map((stat, idx) => (
                <div key={idx} className="p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                  <span className="text-2xl font-black text-amber-400 font-mono tabular-nums block">
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-white block mt-0.5">
                    {stat.unit}
                  </span>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-red-950/20 border border-red-900/40 rounded text-xs text-neutral-300 space-y-1">
              <span className="font-bold text-red-400 block">Soğuk Zincir Lojistiğimiz:</span>
              <p className="text-neutral-400 leading-relaxed">
                Tüm et ürünlerimiz 0°C ile +4°C aralığında iklimlendirilmiş hijyenik odalarda işlenir ve müşterilerimize ulaştırılana dek ısı kırılması yaşanmaz.
              </p>
            </div>
          </div>
        </div>

        {/* Quality Certifications */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
            <span>Uluslararası Standartlar</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Gıda Güvenliği</span>
          </div>
          <h3 className="text-xl font-bold text-white">Kalite & Gıda Güvencesi Sertifikalarımız</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert, index) => (
              <div key={index} className="p-5 bg-neutral-900 border border-neutral-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-amber-400">{cert.code}</span>
                  <Award className="w-4 h-4 text-neutral-500" />
                </div>
                <h4 className="text-sm font-bold text-white">{cert.name}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
