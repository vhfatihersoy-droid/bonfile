import React from 'react';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Award, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SiteSection } from '../../types/siteBuilder';
import { SiteConfig } from '../../types';

interface DynamicBlockRendererProps {
  section: SiteSection;
  config: SiteConfig;
}

export const DynamicBlockRenderer: React.FC<DynamicBlockRendererProps> = ({ section, config }) => {
  switch (section.type) {
    case 'text-block':
      return (
        <div className="py-12 px-6 max-w-4xl mx-auto text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {section.title}
          </h3>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            {section.subtitle || section.content || '1905 yılından bu yana et ve et ürünleri sektöründe kalite, hijyen ve lezzeti bir arada sunmanın gururunu yaşıyoruz.'}
          </p>
        </div>
      );

    case 'image-text':
      return (
        <div className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-xl overflow-hidden border border-neutral-800 aspect-[4/3] bg-neutral-900">
            <svg viewBox="0 0 400 300" className="w-full h-full object-cover">
              <rect width="400" height="300" fill="#18181B" />
              <circle cx="200" cy="150" r="100" fill="#27272A" />
              <g transform="translate(130, 90)">
                <ellipse cx="70" cy="60" rx="60" ry="45" fill="#991B1B" />
                <path d="M40 50 Q70 65 100 50" stroke="#FECACA" strokeWidth="3" fill="none" opacity="0.8" />
                <circle cx="60" cy="50" r="2" fill="#FFFFFF" />
                <circle cx="85" cy="70" r="2" fill="#FFFFFF" />
              </g>
            </svg>
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur px-3 py-1 rounded text-xs text-amber-400 font-semibold">
              Geleneksel Kuru Dinlendirme Odaları
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Öne Çıkan Özellik</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{section.title}</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {section.subtitle || 'Özel Himalaya tuz tuğlalarıyla donatılmış dinlendirme odalarımızda, etin lezzet yoğunluğu zirveye ulaşır.'}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-neutral-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>%100 Doğal Olgunlaşma</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Usta Kasap Seçimi</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'features-grid':
      return (
        <div className="py-16 px-6 max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-2xl font-bold text-white">{section.title}</h3>
            <p className="text-xs text-neutral-400 mt-1">{section.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">01. Besi Kalitesi</span>
              <h4 className="text-base font-bold text-white">Doğal Besi Hayvanlar</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Trakya ve Balıkesir meralarında serbest dolaşan, veteriner kontrolündeki sağlıklı hayvanlardan elde edilen taze karkaslar.
              </p>
            </div>
            <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2">
              <span className="text-red-400 text-xs font-bold uppercase tracking-wider block">02. Soğuk Zincir</span>
              <h4 className="text-base font-bold text-white">+4°C Frigorifik Sevkiyat</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Kesimhaneden tesisimize ve kapınıza kadar ısı takip telemetrisiyle korunan kesintisiz soğuk hava zinciri.
              </p>
            </div>
            <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2">
              <span className="text-sky-400 text-xs font-bold uppercase tracking-wider block">03. Hijyen Standardı</span>
              <h4 className="text-base font-bold text-white">AB Onaylı Tesis</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                ISO 22000 Gıda Güvenliği ve TSE Helal sertifikalı laboratuvar analizleriyle onaylanan sıfır kontaminasyon.
              </p>
            </div>
          </div>
        </div>
      );

    case 'cta-banner':
      return (
        <div className="py-16 px-6 max-w-5xl mx-auto text-center space-y-6">
          <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-red-950/60 to-neutral-950 border border-red-900/50 shadow-2xl space-y-6">
            <h3 className="text-2xl sm:text-4xl font-black text-white">{section.title}</h3>
            <p className="text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
              {section.subtitle || 'Haftanın her günü taze kesim etler ve gurme steakhouse siparişleriniz için WhatsApp sipariş hattımızla iletişime geçin.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp'tan Hemen Sipariş Ver</span>
              </a>
              <a
                href={`tel:${config.phone}`}
                className="flex items-center gap-2 px-6 py-3.5 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-white font-semibold text-xs rounded-md"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Telefon: {config.phone}</span>
              </a>
            </div>
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="py-16 px-6 max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Bize Ulaşın</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">{section.title}</h3>
            <p className="text-xs text-neutral-400 mt-1">{section.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Contact details */}
            <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-xl p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white">Genel Müdürlük & Entegre Tesis</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">{config.address}, {config.city}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white">Müşteri Hizmetleri & Sipariş</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">{config.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white">Kurumsal E-Posta</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">{config.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white">Fabrika Satış Mağazası Saatleri</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">Hafta içi & Cumartesi: 08:30 - 19:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Google Maps iframe / map card */}
            <div className="lg:col-span-7 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 h-80 relative flex flex-col justify-between p-6">
              {/* Stylized Google Map Visual */}
              <div className="absolute inset-0 opacity-25">
                <svg viewBox="0 0 600 400" className="w-full h-full object-cover">
                  <rect width="600" height="400" fill="#18181B" />
                  <path d="M0 100 Q150 120 300 90 T600 130" stroke="#3F3F46" strokeWidth="8" fill="none" />
                  <path d="M100 0 Q120 180 90 400" stroke="#3F3F46" strokeWidth="6" fill="none" />
                  <path d="M450 0 Q400 200 460 400" stroke="#3F3F46" strokeWidth="6" fill="none" />
                  <circle cx="300" cy="180" r="12" fill="#DC2626" />
                  <circle cx="300" cy="180" r="28" stroke="#DC2626" strokeWidth="2" fill="none" opacity="0.6" />
                </svg>
              </div>

              <div className="relative z-10 bg-neutral-950/90 backdrop-blur border border-neutral-700 rounded-lg p-4 max-w-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span className="text-xs font-bold text-white">{config.brandName} Beylikdüzü Fabrika Satış</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  E-5 Haramidere çıkışı, Dereağzı Mevkii, İstanbul
                </p>
              </div>

              <div className="relative z-10 flex justify-end">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${config.brandName} ${config.address} ${config.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Haritalarda Aç</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
