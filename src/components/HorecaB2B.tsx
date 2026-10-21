import React, { useState } from 'react';
import { Building2, Truck, ShieldCheck, CheckCircle2, Send, FileText, Phone, Mail } from 'lucide-react';
import { SiteConfig } from '../types';

interface HorecaB2BProps {
  config: SiteConfig;
}

export const HorecaB2B: React.FC<HorecaB2BProps> = ({ config }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    businessType: 'Restoran & Steakhouse',
    contactPerson: '',
    phone: '',
    email: '',
    city: 'İstanbul',
    monthlyVolume: '500 - 1.500 kg / Ay',
    selectedProducts: ['Dana Steak & Antrikot', 'Köfte Çeşitleri'],
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const productOptions = [
    'Dana Steak & Antrikot',
    'Dana Bonfile (Lokum)',
    'Kuzu Pirzola & İncik',
    'Köfte Çeşitleri (Kasap/Smash)',
    'Odun Ateşi Yaprak Döner',
    'Şarküteri & Sucuk',
    'Sabit Gramajlı Porsiyonluk Etler',
  ];

  const handleProductToggle = (prod: string) => {
    setFormData((prev) => {
      const exists = prev.selectedProducts.includes(prod);
      if (exists) {
        return { ...prev, selectedProducts: prev.selectedProducts.filter((p) => p !== prod) };
      } else {
        return { ...prev, selectedProducts: [...prev.selectedProducts, prod] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setErrorMsg('Lütfen firma adı, telefon ve e-posta alanlarını eksiksiz doldurunuz.');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
  };

  return (
    <section id="horeca" className="py-16 bg-neutral-900 text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
            <span>Ev Dışı Tüketim (EDT)</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Horeca Tedarik Çözümleri</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
            Restoran, Otel & Şefler İçin Endüstriyel Et Tedariği
          </h2>
          <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
            Türkiye'nin önde gelen steakhouse, otel ve catering zincirlerine standart gramajlı, sıfır fireli ve AB standartlarında soğuk zincir frigorifik teslimat ile toptan et çözümleri sağlıyoruz.
          </p>
        </div>

        {/* 3 Pillars for B2B */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Sabit Gramaj & Sıfır Fire</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Mutfak maliyetinizi kontrol altına alın. İstediğiniz kalınlık ve gramajda lazer kontrollü kesim sayesinde porsiyon başına maliyetiniz daima sabittir.
            </p>
          </div>

          <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-sky-950/60 border border-sky-800/40 flex items-center justify-center text-sky-400">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Özmal Frigorifik Filo</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              +4°C sıcaklık kontrollü, telemetri takip sistemine sahip özel frigorifik araçlarımızla haftanın 6 günü belirlenen saat aralığında kapınıza teslimat.
            </p>
          </div>

          <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">AB Onaylı Entegre Tesis</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Beylikdüzü'nde 15.000 m² entegre üretim alanında ISO 22000, ISO 9001 ve Helal sertifikalı veteriner hekim denetiminde endüstriyel üretim.
            </p>
          </div>
        </div>

        {/* Interactive B2B Quote Form */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 lg:p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-700/60 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Kurumsal Teklif Talebiniz Alındı</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Talebiniz Horeca Satış Direktörlüğümüze iletilmiştir. {formData.companyName} adına belirtilen irtibat numarası ({formData.phone}) üzerinden işletmenize özel toptan fiyat listesi ile 2 saat içinde dönüş yapılacaktır.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-5 py-2 text-xs font-semibold bg-neutral-800 text-white rounded-md hover:bg-neutral-700 cursor-pointer"
              >
                Yeni Talep Oluştur
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <h3 className="text-lg font-bold text-white">Kurumsal Fiyat & Numune Teklifi İsteyin</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  İşletmenizin ihtiyacına uygun ürünleri seçerek özel iskonto oranları ve frigorifik teslimat şartları için teklif alın.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs rounded">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Firma / İşletme Adı *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Örn: BigChefs / Hilton / Nusr-et"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">İşletme Türü</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  >
                    <option>Restoran & Steakhouse</option>
                    <option>Otel & Tatil Köyü</option>
                    <option>Catering & Toplu Yemek</option>
                    <option>Kasap & Gurme Şarküteri</option>
                    <option>Burger & Fast-Food Zinciri</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Yetkili Adı Soyadı</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Ad Soyad"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Telefon Numarası *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0532 xxx xx xx"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Kurumsal E-Posta *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="satin-alma@firma.com"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Tahmini Aylık Tüketim</label>
                  <select
                    value={formData.monthlyVolume}
                    onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  >
                    <option>100 - 500 kg / Ay</option>
                    <option>500 - 1.500 kg / Ay</option>
                    <option>1.500 - 5.000 kg / Ay</option>
                    <option>5.000 kg ve Üzeri / Ay</option>
                  </select>
                </div>
              </div>

              {/* Product Selection check pills */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-300">
                  İlgilendiğiniz Ürün Gruplarını Seçiniz:
                </label>
                <div className="flex flex-wrap gap-2">
                  {productOptions.map((prod) => {
                    const isSelected = formData.selectedProducts.includes(prod);
                    return (
                      <button
                        type="button"
                        key={prod}
                        onClick={() => handleProductToggle(prod)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-neutral-950 font-bold'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {prod}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-300 font-medium mb-1">
                  Özel Talepleriniz / Kesim Spesifikasyonları
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Örn: 220g sabit antrikot dilimleri, %18 yağ oranlı smash köfte..."
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Bilgileriniz KVKK kapsamında gizli tutulur ve yalnızca teklif amacıyla kullanılır.</span>
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold bg-red-700 hover:bg-red-800 text-white rounded-md transition-colors cursor-pointer shadow-md whitespace-nowrap shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Kurumsal Teklif Talebini Gönder</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
