import React, { useState } from 'react';
import { Snowflake, Truck, ShieldCheck, Thermometer, MapPin, CheckCircle2, Clock, Search, ArrowRight } from 'lucide-react';
import { OrderReceipt } from '../types';

interface ColdChainMonitorProps {
  orders: OrderReceipt[];
}

export const ColdChainMonitor: React.FC<ColdChainMonitorProps> = ({ orders }) => {
  const [trackingInput, setTrackingInput] = useState('EFC-984201');
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<OrderReceipt | null>(
    orders[0] || null
  );
  const [searchFeedback, setSearchFeedback] = useState<string>('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = trackingInput.trim().toUpperCase();
    const found = orders.find((o) => o.orderId.toUpperCase() === cleanId);
    if (found) {
      setActiveTrackingOrder(found);
      setSearchFeedback('');
    } else {
      setSearchFeedback('Sipariş bulunamadı. Lütfen kontrol ediniz (Örn: EFC-984201).');
    }
  };

  const facilitySensors = [
    { name: 'Kuru Dinlendirme (Dry-Aged) Tuz Odası', temp: '+1.6°C', humidity: '%78 Nem', status: 'Optimal', code: 'CHAMBER-01' },
    { name: 'Taze Kırmızı Et Parçalama & İşleme', temp: '+3.8°C', humidity: '%65 Nem', status: 'Optimal', code: 'HALL-02' },
    { name: 'Derin Dondurucu Şoklama Tüneli', temp: '-38.4°C', humidity: 'Kuru Hava', status: 'Optimal', code: 'BLAST-01' },
    { name: 'Frigorifik Sevkiyat Aracı #04 (Ahmet Usta)', temp: '+3.1°C', humidity: 'Sabit Soğuk', status: 'Yolda', code: 'FRIGO-04' },
  ];

  const steps = [
    { title: 'Sipariş Onayı & Kesim Planı', time: '10:15', done: true, desc: 'Usta kasaplarımız tarafından karkastan taze kesim yapıldı.' },
    { title: 'Dağ Kekiği & Vakum Paketleme', time: '10:45', done: true, desc: 'Çift kat termoform bariyerli vakum ambalaja alındı.' },
    { title: 'Termobox & Soğutucu Jel Eşleşmesi', time: '11:10', done: true, desc: 'Isı yalıtımlı özel koli ve -18°C buz aküleri eklendi.' },
    { title: 'Frigorifik Kurye Dağıtımı', time: '11:35', done: true, desc: '+4°C iklimlendirmeli özel frigo araçla yola çıktı.' },
    { title: 'Müşteri Adresine Teslimat', time: 'Bekleniyor (~45 dk)', done: false, desc: 'Kapıda soğuk zincir bozulmadan teslim edilecek.' },
  ];

  return (
    <section id="soguk-zincir" className="py-20 bg-white text-stone-900 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-red-700 uppercase">
            <span>Kırılmayan +4°C Güvencesi</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Canlı Lojistik Takip</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-950 mt-1">
            Entegre Soğuk Zincir & Sıcaklık Kontrolü
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Özlemce Et Entegre Tesisleri'nden kapınıza kadar her paket; termal sensörler, özel yalıtımlı termobox koliler ve +4°C frigorifik araçlarımızla kesintisiz soğuk zincir altında taşınır.
          </p>
        </div>

        {/* Live Facility Telemetry Sensor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {facilitySensors.map((sensor, idx) => (
            <div key={idx} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-stone-400 text-[10px]">{sensor.code}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {sensor.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-stone-900">{sensor.name}</h4>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl font-black font-mono text-red-700">{sensor.temp}</span>
                <span className="text-[11px] text-stone-500 font-medium">{sensor.humidity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Tracking Order Interactive Box */}
        <div className="bg-stone-50/80 rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <h3 className="text-lg font-bold text-stone-950">
                Canlı Sipariş & Kargo Sıcaklık Sorgulama
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Sipariş takip numaranızı girerek kolisinin anlık sıcaklığını ve aşamasını görüntüleyin.
              </p>
            </div>

            <form onSubmit={handleTrack} className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Örn: EFC-984201"
                className="px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 font-mono uppercase focus:outline-none focus:border-red-700 w-full sm:w-48 shadow-2xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Sorgula</span>
              </button>
            </form>
          </div>

          {searchFeedback && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs font-medium border border-red-200">
              {searchFeedback}
            </div>
          )}

          {activeTrackingOrder && (
            <div className="space-y-6">
              {/* Order summary banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-stone-950">
                      #{activeTrackingOrder.orderId}
                    </span>
                    <span className="text-xs text-stone-500">· {activeTrackingOrder.customerName}</span>
                  </div>
                  <div className="text-xs text-stone-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{activeTrackingOrder.customerAddress}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Paket İçi Sıcaklık</span>
                    <span className="text-base font-black font-mono text-emerald-600">+3.2°C (İdeal)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Frigo Kurye</span>
                    <span className="text-xs font-bold text-stone-800">{activeTrackingOrder.courierName || 'Özlemce Frigo #04'}</span>
                  </div>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {steps.map((st, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      st.done
                        ? 'bg-white border-stone-200 shadow-2xs'
                        : 'bg-stone-100/50 border-dashed border-stone-300 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-stone-400">0{idx + 1}</span>
                      {st.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-stone-400" />
                      )}
                    </div>
                    <h5 className="text-xs font-bold text-stone-900 leading-tight">{st.title}</h5>
                    <p className="text-[11px] text-stone-500 mt-1 leading-snug">{st.desc}</p>
                    <span className="text-[10px] font-mono font-semibold text-red-700 block mt-2">
                      {st.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
