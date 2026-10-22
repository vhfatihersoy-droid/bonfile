import React, { useState } from 'react';
import { Flame, Clock, Award, ChevronRight, Sparkles, Check, Info } from 'lucide-react';
import { Product } from '../types';

interface MeatCutInfo {
  id: string;
  name: string;
  animal: 'dana' | 'kuzu';
  anatomicalRegion: string;
  tendernessScore: number; // 1-10
  fatMarbling: string;
  recommendedAging: string;
  bestCookingMethod: string;
  description: string;
  chefTips: string;
  relatedProductSlug?: string;
}

const meatCutsData: MeatCutInfo[] = [
  {
    id: 'bonfile',
    name: 'Dana Bonfile (Tenderloin)',
    animal: 'dana',
    anatomicalRegion: 'Sırt içi omurga altı (En az çalışan kas grubu)',
    tendernessScore: 10,
    fatMarbling: '%3 - %5 (Yağsız & İpeksi)',
    recommendedAging: '14 - 21 Gün Islak Dinlendirme (Wet-Aged)',
    bestCookingMethod: 'Kızgın döküm tava veya ızgara (Hızlı mühürleme)',
    description: 'Büyükbaş karkasının en yumuşak, sinirsiz ve en kıymetli bölümüdür. Hayvanın neredeyse hiç hareket etmeyen bölgesinde yer aldığından lifleri kadife yumuşaklığındadır.',
    chefTips: 'Fazla pişirilmemeli (İdeal: Medium-Rare 54°C). Pişirme sonunda taze kekik ve köy tereyağı ile arrose (banyolatma) yapılmalıdır.',
    relatedProductSlug: 'dana-bonfile-lokum',
  },
  {
    id: 'antrikot',
    name: 'Dana Antrikot (Ribeye)',
    animal: 'dana',
    anatomicalRegion: 'Sırt omurları 6-12 arası (Kaburga gözü)',
    tendernessScore: 9,
    fatMarbling: '%15 - %20 (Yüksek Mermerleşme)',
    recommendedAging: '28 Gün Himalaya Tuz Odası (Dry-Aged)',
    bestCookingMethod: 'Kömür ızgarası veya kalın döküm tava',
    description: 'Etin içinde örümcek ağı gibi dağılan doğal yağ damarları (marbling) pişerken eriyerek ete benzersiz bir sululuk, yoğun aroma ve lezzet derinliği kazandırır.',
    chefTips: 'Oda sıcaklığında 30 dk bekletildikten sonra yüksek ısıda mühürlenmeli; içindeki doğal yağın erimesi için orta pişirme (medium) tavsiye edilir.',
    relatedProductSlug: 'dana-antrikot',
  },
  {
    id: 't-bone',
    name: 'T-Bone & Porterhouse',
    animal: 'dana',
    anatomicalRegion: 'Bel omuru (T şeklindeki kemiğin iki yanı)',
    tendernessScore: 9,
    fatMarbling: '%12 - %16 (Dengeli)',
    recommendedAging: '21 - 28 Gün Kuru Dinlendirme',
    bestCookingMethod: 'Döküm tavada mühürleme + fırın bitirişi',
    description: 'T şeklindeki kemiğin bir tarafında aromatik kontrfile (New York Strip), diğer tarafında ise pamuksu bonfile yer alır. İki farklı et lezzetini tek kesimde sunar.',
    chefTips: 'Kemik ısının içe doğru eşit iletilmesini sağlar. Pişirme sonrası kemiğin yanından dilimleyip deniz tuzu kristalleriyle servis ediniz.',
    relatedProductSlug: 't-bone-steak',
  },
  {
    id: 'dallas',
    name: 'Dallas / Tomahawk Steak',
    animal: 'dana',
    anatomicalRegion: 'Ön kaburga sırt kısmı (Kemikli pirzola)',
    tendernessScore: 9,
    fatMarbling: '%18 - %22 (Zengin Mermer)',
    recommendedAging: '28 Gün Dry-Aged',
    bestCookingMethod: 'Ön mühürleme + Dolaylı mangal ateşi',
    description: 'Kemikli antrikotun kalın kesilmiş halidir. Kemik iliği ve kaburga çevresindeki aromatik yağlar pişme esnasında ete yoğun lezzet katar.',
    chefTips: 'En az 3.5 - 4 cm kalınlığında kesilir. Dış yüzeyi nar gibi karamelize olduktan sonra iç derecesi 56°C olana kadar dinlendirilir.',
    relatedProductSlug: 'dallas-steak',
  },
  {
    id: 'kuzu-pirzola',
    name: 'Kıvırcık Kuzu Pirzola',
    animal: 'kuzu',
    anatomicalRegion: 'Kuzu sırt ve kaburga kafesi',
    tendernessScore: 10,
    fatMarbling: '%14 - %18 (Doğal Süt Yağı)',
    recommendedAging: '5 - 7 Gün Soğuk Dinlendirme',
    bestCookingMethod: 'Yüksek ateşli ızgara veya fırın',
    description: 'Trakya ve Balıkesir yöresi doğal otlaklarında beslenen kıvırcık kuzulardan elde edilir. Ağır koku barındırmaz, lokum gibi yumuşaktır.',
    chefTips: 'Dağ kekiği, sarımsak ve sızma zeytinyağı ile marine edilip kömür ızgarasında her iki yüzü 3’er dakika pişirildiğinde zirve lezzete ulaşır.',
    relatedProductSlug: 'kuzu-pirzola',
  },
  {
    id: 'kuzu-incik',
    name: 'Kuzu İncik & Gerdan',
    animal: 'kuzu',
    anatomicalRegion: 'Kuzu ön ve arka bacak / boyun',
    tendernessScore: 8,
    fatMarbling: '%10 - %12 (Kolajen & Bağ Dokusu)',
    recommendedAging: '3 - 5 Gün Soğuk Muhafaza',
    bestCookingMethod: 'Düşük ısıda ağır fırınlama (Slow Cook 140°C - 3 saat)',
    description: 'Yüksek kolajen ve kemik iliği içeriği sayesinde fırında yavaş piştiğinde kemiğinden kendiliğinden ayrılan enfes bir ziyafet yemeğine dönüşür.',
    chefTips: 'Arpacık soğan, tane karabiber ve taze biberiye eşliğinde güveçte veya fırın torbasında kendi buharında pişirilmelidir.',
    relatedProductSlug: 'kuzu-incik-osso-buco',
  },
];

interface MeatAnatomyExplorerProps {
  products: Product[];
  onSelectProductBySlug: (slug: string) => void;
}

export const MeatAnatomyExplorer: React.FC<MeatAnatomyExplorerProps> = ({
  products,
  onSelectProductBySlug,
}) => {
  const [selectedCutId, setSelectedCutId] = useState<string>('bonfile');
  const [selectedAnimal, setSelectedAnimal] = useState<'dana' | 'kuzu'>('dana');

  const filteredCuts = meatCutsData.filter((cut) => cut.animal === selectedAnimal);
  const activeCut = meatCutsData.find((cut) => cut.id === selectedCutId) || filteredCuts[0];

  const matchedProduct = activeCut.relatedProductSlug
    ? products.find((p) => p.slug === activeCut.relatedProductSlug)
    : null;

  return (
    <section id="anatomi-rehberi" className="py-16 bg-white text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header with anti-slop clean typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-red-700 uppercase">
              <span>Usta Kasap Kılavuzu</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Anatomik Karkas Haritası</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-950 mt-1">
              Etin Anatomisi & Kesim Rehberi
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Doğru pişirme yöntemi doğru kesimle başlar. Özlemce Entegre Tesisleri'nde uzman kasaplarımızın hazırladığı karkas haritasını inceleyerek etin dokusunu, mermerleşme oranını ve şef sırlarını keşfedin.
            </p>
          </div>

          {/* Animal Selector Buttons */}
          <div className="flex items-center p-1 bg-stone-100 rounded-lg shrink-0">
            <button
              onClick={() => {
                setSelectedAnimal('dana');
                setSelectedCutId('bonfile');
              }}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                selectedAnimal === 'dana'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              Yerli Dana Karkas
            </button>
            <button
              onClick={() => {
                setSelectedAnimal('kuzu');
                setSelectedCutId('kuzu-pirzola');
              }}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                selectedAnimal === 'kuzu'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              Kıvırcık Kuzu Karkas
            </button>
          </div>
        </div>

        {/* Interactive Anatomy Visual & Detail Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cuts List / Anatomy Selector */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Bölge Seçiniz ({selectedAnimal === 'dana' ? 'Dana Kesimleri' : 'Kuzu Kesimleri'})
            </div>

            <div className="space-y-2.5">
              {filteredCuts.map((cut) => {
                const isActive = cut.id === activeCut.id;
                return (
                  <button
                    key={cut.id}
                    onClick={() => setSelectedCutId(cut.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-red-50/60 border-red-600 shadow-sm ring-1 ring-red-600'
                        : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isActive ? 'text-red-800' : 'text-stone-900'}`}>
                          {cut.name}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500">
                        {cut.anatomicalRegion}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-right shrink-0">
                      <div className="text-[11px] font-mono font-bold text-red-700">
                        {cut.fatMarbling.split(' ')[0]}
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-red-700' : 'text-stone-400'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quality Note Box */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1.5 mt-4">
              <div className="flex items-center gap-1.5 font-bold text-stone-900">
                <Info className="w-4 h-4 text-red-700" />
                <span>Özlemce Et Dinlendirme Standardı</span>
              </div>
              <p className="leading-relaxed">
                Tüm etlerimiz vakumlanmadan önce veteriner hekim onayından geçer ve özel soğuk hava tünellerinde pH ve nem dengesi kontrol edilerek dinlendirilir.
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Cut Breakdown & Recipe/Action Card */}
          <div className="lg:col-span-7 bg-stone-50/80 rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            
            {/* Header of Active Cut */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider block">
                  {activeCut.animal === 'dana' ? 'Dana Eti Anatomisi' : 'Kuzu Eti Anatomisi'}
                </span>
                <h3 className="text-2xl font-black text-stone-950 mt-0.5">
                  {activeCut.name}
                </h3>
                <span className="text-xs text-stone-500 mt-1 block">
                  {activeCut.anatomicalRegion}
                </span>
              </div>

              {/* Tenderness meter */}
              <div className="bg-white px-4 py-2.5 rounded-xl border border-stone-200 shadow-2xs text-center shrink-0">
                <span className="text-[11px] font-bold text-stone-500 uppercase block">Yumuşaklık Skoru</span>
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-xl font-black text-red-700 font-mono">{activeCut.tendernessScore}</span>
                  <span className="text-xs text-stone-400 font-mono">/10</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-stone-700 leading-relaxed">
              {activeCut.description}
            </p>

            {/* Technical Attribute Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  Mermerleşme (Yağ Dağılımı)
                </span>
                <span className="text-xs font-bold text-stone-900 block">
                  {activeCut.fatMarbling}
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  Tavsiye Dinlendirme
                </span>
                <span className="text-xs font-bold text-stone-900 block">
                  {activeCut.recommendedAging}
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  İdeal Pişirme
                </span>
                <span className="text-xs font-bold text-stone-900 block">
                  {activeCut.bestCookingMethod}
                </span>
              </div>
            </div>

            {/* Chef Secret Advice */}
            <div className="p-4 bg-red-50/70 border border-red-200/90 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-red-800">
                <Flame className="w-4 h-4 text-red-700" />
                <span>Özlemce Baş Kasabından Pişirme & Marinasyon Tüyosu</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed pl-6">
                {activeCut.chefTips}
              </p>
            </div>

            {/* Direct Shop Action */}
            {matchedProduct && (
              <div className="pt-2 flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center gap-3">
                  <img
                    src={matchedProduct.imageUrl}
                    alt={matchedProduct.name}
                    className="w-14 h-14 rounded-lg object-cover border border-stone-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{matchedProduct.name}</h4>
                    <span className="text-sm font-black text-red-700 font-mono">
                      {matchedProduct.basePrice} ₺ <span className="text-xs font-normal text-stone-500">/ {matchedProduct.unitWeight}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectProductBySlug(matchedProduct.slug)}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Ürünü İncele & Sipariş Ver
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
