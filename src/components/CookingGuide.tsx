import React, { useState } from 'react';
import { Flame, Clock, Thermometer, Utensils, ChevronRight, CheckCircle2 } from 'lucide-react';
import { recipes } from '../data/mockData';

const donenessLevels = [
  {
    key: 'rare',
    name: 'Az Pişmiş (Rare)',
    temp: '50°C - 52°C',
    color: '#991B1B',
    centerColor: '#7F1D1D',
    desc: 'Merkezi tamamen parlak kırmızı ve ılık. Maksimum sululuk ve etin saf dokusu.',
    firmness: 'Yumuşak (Baş parmak gevşekken baş ve işaret parmağı etli kısmı hissi)',
    restTime: '3-4 Dakika',
  },
  {
    key: 'medium-rare',
    name: 'Orta Az (Medium Rare)',
    temp: '55°C - 57°C',
    color: '#B91C1C',
    centerColor: '#991B1B',
    desc: 'Şeflerin önerisi: İpeksi pembe merkez, dışta hafif karamelize kabuk, ideal sululuk.',
    firmness: 'Hafif elastik (Baş parmak ile orta parmak birleştiğindeki avuç içi sertliği)',
    restTime: '4-5 Dakika',
    isChefChoice: true,
  },
  {
    key: 'medium',
    name: 'Orta (Medium)',
    temp: '60°C - 63°C',
    color: '#C2410C',
    centerColor: '#B45309',
    desc: 'Etin tam ortasında ince pembe bir hat, sulu fakat daha sıkı lif yapısı.',
    firmness: 'Dengeli direnç (Baş parmak ile yüzük parmağı birleştiğindeki sertlik)',
    restTime: '5 Dakika',
  },
  {
    key: 'medium-well',
    name: 'Orta İyi (Medium Well)',
    temp: '65°C - 68°C',
    color: '#78350F',
    centerColor: '#713F12',
    desc: 'Hafif pembe ton kalmış, lifleri büyük oranda pişmiş ve sıkılaşmış doku.',
    firmness: 'Sertçe',
    restTime: '5 Dakika',
  },
  {
    key: 'well-done',
    name: 'İyi Pişmiş (Well Done)',
    temp: '71°C+',
    color: '#451A03',
    centerColor: '#3F200A',
    desc: 'Hiç pembe kalmamış, tamamen pişmiş kahverengi iç yapı.',
    firmness: 'Tamamen sert (Baş parmak ile serçe parmak birleşimi hissi)',
    restTime: '6 Dakika',
  },
];

export const CookingGuide: React.FC = () => {
  const [activeDoneness, setActiveDoneness] = useState(donenessLevels[1]);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState(0);

  const selectedRecipe = recipes[activeRecipeIndex];

  return (
    <section id="pisirme-rehberi" className="py-20 bg-white text-stone-900 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-wider text-red-700 uppercase">
            <span>Ustalık Sırları</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Şefin Mutfağı</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 mt-1">
            Steak & Et Pişirme Rehberi
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            İyi bir et doğru marine edilip pişirildiğinde efsaneleşir. Doğru iç sıcaklık derecelerini, kekik ve sızma zeytinyağlı mühürleme tekniklerini keşfedin.
          </p>
        </div>

        {/* Part 1: Interactive Steak Doneness Thermometer */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 lg:p-8 space-y-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
            <div>
              <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-wider">
                <Thermometer className="w-4 h-4" />
                <span>İç Sıcaklık & Pişme Seviyesi</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mt-1">
                İdeal Pişme Derecenizi Seçin
              </h3>
            </div>

            {/* Segmented doneness buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200">
              {donenessLevels.map((lvl) => (
                <button
                  key={lvl.key}
                  onClick={() => setActiveDoneness(lvl)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    activeDoneness.key === lvl.key
                      ? 'bg-red-700 text-white font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {lvl.name.split(' ')[0]}
                  {lvl.isChefChoice && <span className="ml-1 text-amber-300">★</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive display card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Cross-Section of Steak */}
            <div className="lg:col-span-5 bg-stone-50 rounded-xl border border-stone-200 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-full max-w-xs h-28 rounded-xl overflow-hidden border border-stone-300 shadow-inner flex flex-col justify-between">
                {/* Outer grilled seared crust */}
                <div className="h-4 bg-[#3E1A0F] border-b border-[#281109]" />

                {/* Doneness Center Simulation */}
                <div
                  className="flex-1 flex items-center justify-center transition-all duration-300 relative"
                  style={{ backgroundColor: activeDoneness.centerColor }}
                >
                  <div
                    className="absolute inset-y-1 inset-x-8 rounded-full filter blur-sm transition-all duration-300"
                    style={{ backgroundColor: activeDoneness.color }}
                  />
                  <span className="relative z-10 text-white font-mono font-bold text-sm drop-shadow">
                    {activeDoneness.temp}
                  </span>
                </div>

                {/* Bottom crust */}
                <div className="h-4 bg-[#3E1A0F] border-t border-[#281109]" />
              </div>

              <div>
                <span className="text-xs text-stone-500 font-medium">Termometre Hedefi</span>
                <div className="text-2xl font-black text-red-700 font-mono tabular-nums">
                  {activeDoneness.temp}
                </div>
              </div>
            </div>

            {/* Explanation & Chef's Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="text-xl font-bold text-stone-900">{activeDoneness.name}</h4>
                {activeDoneness.isChefChoice && (
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-md">
                    Şefin Tavsiyesi
                  </span>
                )}
              </div>

              <p className="text-sm text-stone-600 leading-relaxed">
                {activeDoneness.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Etin Dokusu (El Testi)</span>
                  <span className="font-semibold text-stone-800 mt-1 block">{activeDoneness.firmness}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Tavadan Sonra Dinlendirme</span>
                  <span className="font-bold text-red-700 mt-1 block">{activeDoneness.restTime} (Ahşap Tahtada)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: 4-Step Searing Technique */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-red-700 uppercase">
            <span>Altın Kurallar</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Mühürleme Sanatı</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900">
            Döküm Tavada Kusursuz Mühürleme Tekniği
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-white border border-stone-200 rounded-xl space-y-2 shadow-2xs">
              <span className="text-sm font-black text-red-700 block">01. Oda Sıcaklığı</span>
              <h5 className="text-sm font-bold text-stone-900">Eti Buzdolabından Erken Çıkarın</h5>
              <p className="text-xs text-stone-500 leading-relaxed">
                Eti pişirmeden 30-40 dakika önce buzdolabından çıkarın. Soğuk et tavaya girdiğinde sıcaklığı düşürür ve mühürlenmek yerine suyunu salıp haşlanır.
              </p>
            </div>

            <div className="p-5 bg-white border border-stone-200 rounded-xl space-y-2 shadow-2xs">
              <span className="text-sm font-black text-red-700 block">02. Yüzey Kurulama & Yağlama</span>
              <h5 className="text-sm font-bold text-stone-900">Zeytinyağı ve Kaya Tuzu</h5>
              <p className="text-xs text-stone-500 leading-relaxed">
                Islak yüzey Maillard reaksiyonunu engeller. Eti iyice kurulayın, soğuk sıkım sızma zeytinyağı ile ovup sadece iri deniz tuzu, taze kekik ve tane karabiber ekleyin.
              </p>
            </div>

            <div className="p-5 bg-white border border-stone-200 rounded-xl space-y-2 shadow-2xs">
              <span className="text-sm font-black text-red-700 block">03. Arrose & Kekik Banyosu</span>
              <h5 className="text-sm font-bold text-stone-900">Tereyağı & Taze Dağ Kekiği</h5>
              <p className="text-xs text-stone-500 leading-relaxed">
                Eti çevirdikten sonra tavaya 1 kaşık tereyağı, ezilmiş sarımsak ve taze kekik dalı atın. Köpüren tereyağını bir kaşıkla sürekli etin üzerine dökerek pişirin.
              </p>
            </div>

            <div className="p-5 bg-white border border-stone-200 rounded-xl space-y-2 shadow-2xs">
              <span className="text-sm font-black text-red-700 block">04. Dinlendirme</span>
              <h5 className="text-sm font-bold text-stone-900">Lifleri Gevşetin</h5>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tavadan alır almaz eti kesmeyin! Tahta tahtada 4-5 dakika bekletin. Böylece merkezdeki et suyu liflere geri dağılır ve lezzet hapsolur.
              </p>
            </div>
          </div>
        </div>

        {/* Part 3: Chef Recipes Feature */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Şefin Reçetesi</span>
              <h4 className="text-lg font-bold text-stone-900 mt-0.5">{selectedRecipe.title}</h4>
            </div>

            <div className="flex items-center gap-2">
              {recipes.map((r, idx) => (
                <button
                  key={r.id}
                  onClick={() => setActiveRecipeIndex(idx)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                    activeRecipeIndex === idx
                      ? 'bg-red-700 text-white font-bold shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200'
                  }`}
                >
                  {r.meatType}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Ingredients */}
            <div className="lg:col-span-5 space-y-3 bg-stone-50 p-5 rounded-xl border border-stone-200">
              <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-200 pb-2">
                <span>Hazırlık: {selectedRecipe.prepTime}</span>
                <span>Pişirme: {selectedRecipe.cookTime}</span>
                <span>Zorluk: {selectedRecipe.difficulty}</span>
              </div>

              <h5 className="text-xs font-bold text-red-700 uppercase tracking-wider pt-1">
                Gerekli Malzemeler ({selectedRecipe.servings} Kişilik)
              </h5>
              <ul className="space-y-2 text-xs text-stone-700">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-700 font-bold">·</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation Steps */}
            <div className="lg:col-span-7 space-y-4">
              <h5 className="text-xs font-bold text-red-700 uppercase tracking-wider">
                Adım Adım Hazırlanışı
              </h5>
              <div className="space-y-3 text-xs text-stone-700">
                {selectedRecipe.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="font-mono font-bold text-red-700 text-xs shrink-0 pt-0.5 tabular-nums">
                      0{idx + 1}.
                    </span>
                    <p className="leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-stone-800">
                <span className="font-bold text-red-800">Şefin Altın Notu: </span>
                {selectedRecipe.chefTip}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
