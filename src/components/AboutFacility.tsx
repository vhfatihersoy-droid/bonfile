import React from 'react';
import { Award, ShieldCheck, Factory, CheckCircle2, History, MapPin } from 'lucide-react';
import { certificates, facilityStats } from '../data/mockData';
import { SiteConfig } from '../types';

interface AboutFacilityProps {
  config: SiteConfig;
}

export const AboutFacility: React.FC<AboutFacilityProps> = ({ config }) => {
  return (
    <section id="kurumsal" className="py-16 bg-white text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Heritage Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-red-700 uppercase">
              <span>Kurumsal Miras</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{config.establishedYear}'ten Günümüze</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-950 leading-tight">
              40 Yılı Aşkın Et Ustalığı & Doğal Besi Kültürü
            </h2>

            <p className="text-sm text-stone-600 leading-relaxed">
              {config.establishedYear} yılında temelleri atılan {config.brandName}, geleneksel kasaplık zanaatını modern gıda mühendisliği ve hayvan refahı standartlarıyla buluşturmuştur. Türkiye’de AB normlarında modern et işleme tesisine sahip öncü kuruluşlardan biri olarak, sofralarınıza gerçek et lezzetini en yüksek hijyen kriterleriyle ulaştırmaktayız.
            </p>

            <p className="text-sm text-stone-600 leading-relaxed">
              Balıkesir ve Trakya yaylalarındaki doğal çiftliklerimizde serbest otlayan yerli besilerimiz; veteriner hekim gözetiminde, İslami usullere tam uygun helal kesim ve modern soğuk hava odalarında titizlikle işlenir.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span className="text-xs text-stone-700">
                  <strong className="text-stone-900">Veteriner Hekim Kontrolü:</strong> Kesim öncesi ve sonrası patolojik ve mikrobiyolojik laboratuvar testleri.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span className="text-xs text-stone-700">
                  <strong className="text-stone-900">Himalaya Tuz Odalarında Dinlendirme:</strong> Gerçek kuru dinlendirme (Dry-Aged) ile lif yumuşaması ve yoğun et aroması.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span className="text-xs text-stone-700">
                  <strong className="text-stone-900">İzlenebilirlik:</strong> Her paketin üzerinde çiftlikten kesimhane ve üretim partisine kadar küpe numarası takip güvencesi.
                </span>
              </div>
            </div>
          </div>

          {/* Plant & Logistics Diagram */}
          <div className="lg:col-span-6 bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-red-700" />
                <h3 className="text-base font-bold text-stone-900">Beylikdüzü Entegre Et Tesisi</h3>
              </div>
              <span className="text-[11px] text-stone-500 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>İstanbul / Beylikdüzü</span>
              </span>
            </div>

            {/* Metric Blocks */}
            <div className="grid grid-cols-2 gap-4">
              {facilityStats.map((stat, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs">
                  <span className="text-2xl font-black text-red-700 font-mono tabular-nums block">
                    {stat.value}
                  </span>
                  <span className="text-xs font-bold text-stone-900 block mt-0.5">
                    {stat.unit}
                  </span>
                  <p className="text-[11px] text-stone-500 mt-1">
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-stone-800 space-y-1">
              <span className="font-bold text-red-800 block">Kırılmayan +4°C Soğuk Zincir Lojistiğimiz:</span>
              <p className="text-stone-600 leading-relaxed">
                Tüm et ürünlerimiz 0°C ile +4°C aralığında iklimlendirilmiş hijyenik odalarda işlenir ve müşterilerimize ulaştırılana dek ısı kırılması yaşanmaz.
              </p>
            </div>
          </div>
        </div>

        {/* Quality Certifications */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-red-700 uppercase">
            <span>Uluslararası Standartlar</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Gıda Güvenliği</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900">Kalite & Gıda Güvencesi Sertifikalarımız</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert, index) => (
              <div key={index} className="p-5 bg-stone-50 border border-stone-200 rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-red-700">{cert.code}</span>
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">{cert.name}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
