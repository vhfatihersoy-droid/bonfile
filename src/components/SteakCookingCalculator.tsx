import React, { useState, useEffect } from 'react';
import { Flame, Clock, Thermometer, Utensils, Play, Pause, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

interface CutOption {
  id: string;
  name: string;
  defaultThickness: number; // in cm
  fatLevel: 'low' | 'medium' | 'high';
}

const cutOptions: CutOption[] = [
  { id: 'antrikot', name: 'Dana Antrikot (Ribeye)', defaultThickness: 2.5, fatLevel: 'high' },
  { id: 'bonfile', name: 'Dana Bonfile (Lokum)', defaultThickness: 3.0, fatLevel: 'low' },
  { id: 'dallas', name: 'Dallas Steak (Kemikli)', defaultThickness: 3.5, fatLevel: 'high' },
  { id: 'tbone', name: 'T-Bone Steak', defaultThickness: 3.0, fatLevel: 'medium' },
  { id: 'pirzola', name: 'Kuzu Pirzola', defaultThickness: 2.0, fatLevel: 'medium' },
];

const donenessOptions = [
  { id: 'rare', name: 'Az Pişmiş (Rare)', internalTemp: 52, chefChoice: false },
  { id: 'med-rare', name: 'Orta Az (Medium Rare)', internalTemp: 56, chefChoice: true },
  { id: 'medium', name: 'Orta (Medium)', internalTemp: 62, chefChoice: false },
  { id: 'med-well', name: 'Orta İyi (Medium Well)', internalTemp: 66, chefChoice: false },
  { id: 'well', name: 'İyi Pişmiş (Well Done)', internalTemp: 72, chefChoice: false },
];

const equipmentOptions = [
  { id: 'cast-iron', name: 'Döküm Demir Tava', tempDesc: 'Duman çıkana kadar 5-6 dk kızdırılmış' },
  { id: 'charcoal', name: 'Kömürlü Meşe Mangalı', tempDesc: 'Beyaz küllenmiş kor ateş' },
  { id: 'gas-grill', name: 'Gazlı Izgara', tempDesc: 'Yüksek ateşe ayarlı çift kademe' },
];

export const SteakCookingCalculator: React.FC = () => {
  const [selectedCut, setSelectedCut] = useState<CutOption>(cutOptions[0]);
  const [thickness, setThickness] = useState<number>(2.5);
  const [selectedDoneness, setSelectedDoneness] = useState(donenessOptions[1]);
  const [selectedEquipment, setSelectedEquipment] = useState(equipmentOptions[0]);

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Calculate timing based on math:
  // Base time per side in seconds
  const baseTimePerSide = Math.round(
    (thickness * 45) +
    (selectedDoneness.internalTemp - 50) * 4 +
    (selectedCut.fatLevel === 'low' ? -15 : 10)
  );

  const restTimeMinutes = Math.max(3, Math.round(thickness * 1.5));
  const butterBastingTime = Math.max(30, Math.round(baseTimePerSide * 0.4));

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const handleStartTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section id="pisirme-hesaplayici" className="py-16 bg-stone-50/70 text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-red-700 uppercase">
              <span>Şefin Et Laboratuvarı</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Hassas Mühürleme Hesaplayıcısı</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-950 mt-1">
              Steak Mühürleme & Pişirme Asistanı
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Etinizi kurutmadan, dışı karamelize kabuklu ve içi tam istediğiniz sululukta pişirin. Kesim, kalınlık ve pişme derecenizi seçtiğinizde ideal mühürleme ve dinlendirme süreleri saniye hassasiyetiyle hesaplanır.
            </p>
          </div>
        </div>

        {/* 2-Column Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
            
            {/* Step 1: Kesim Seçimi */}
            <div>
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-2.5">
                1. Et Kesimi
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {cutOptions.map((cut) => {
                  const isSelected = cut.id === selectedCut.id;
                  return (
                    <button
                      key={cut.id}
                      onClick={() => {
                        setSelectedCut(cut);
                        setThickness(cut.defaultThickness);
                      }}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-600 bg-red-50/60 ring-1 ring-red-600'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <span className={`text-xs font-bold block ${isSelected ? 'text-red-800' : 'text-stone-900'}`}>
                        {cut.name}
                      </span>
                      <span className="text-[10px] text-stone-500 mt-0.5 block">
                        Varsayılan: {cut.defaultThickness} cm
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Kalınlık Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  2. Dilim Kalınlığı: <span className="text-red-700 font-mono font-black">{thickness.toFixed(1)} cm</span>
                </label>
                <span className="text-[11px] text-stone-500">
                  {thickness >= 3.5 ? 'Steakhouse Kalın Kesim' : thickness <= 2.0 ? 'İnce Kasap Kesimi' : 'Standart Kesim'}
                </span>
              </div>
              <input
                type="range"
                min="1.5"
                max="4.5"
                step="0.5"
                value={thickness}
                onChange={(e) => setThickness(parseFloat(e.target.value))}
                className="w-full accent-red-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                <span>1.5 cm</span>
                <span>2.5 cm</span>
                <span>3.5 cm</span>
                <span>4.5 cm</span>
              </div>
            </div>

            {/* Step 3: Pişme Derecesi */}
            <div>
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-2.5">
                3. Arzu Edilen Pişme Derecesi
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {donenessOptions.map((done) => {
                  const isSelected = done.id === selectedDoneness.id;
                  return (
                    <button
                      key={done.id}
                      onClick={() => setSelectedDoneness(done)}
                      className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-600 bg-red-700 text-white shadow-xs'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
                      }`}
                    >
                      <span className="text-xs font-bold block">{done.name.split(' ')[0]}</span>
                      <span className={`text-[10px] font-mono mt-0.5 block ${isSelected ? 'text-red-200' : 'text-stone-500'}`}>
                        {done.internalTemp}°C
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Ekipman Seçimi */}
            <div>
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-2.5">
                4. Pişirme Ekipmanı
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {equipmentOptions.map((eq) => {
                  const isSelected = eq.id === selectedEquipment.id;
                  return (
                    <button
                      key={eq.id}
                      onClick={() => setSelectedEquipment(eq)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-600 bg-red-50/60 ring-1 ring-red-600'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <span className={`text-xs font-bold block ${isSelected ? 'text-red-800' : 'text-stone-900'}`}>
                        {eq.name}
                      </span>
                      <span className="text-[10px] text-stone-500 mt-0.5 block leading-tight">
                        {eq.tempDesc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result & Live Timing Card (5 cols) */}
          <div className="lg:col-span-5 bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-md border border-stone-800">
            
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-red-400 uppercase block">
                  Hesaplanan Reçete
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">
                  {selectedCut.name} ({thickness} cm)
                </h4>
              </div>
              <span className="text-xs font-mono font-bold bg-stone-800 px-2.5 py-1 rounded text-red-400 border border-stone-700">
                Hedef: {selectedDoneness.internalTemp}°C
              </span>
            </div>

            {/* Big Timing Numbers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-stone-800/80 rounded-xl border border-stone-700/80">
                <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  <span>Yüz Başı Süre</span>
                </div>
                <div className="text-2xl font-black font-mono text-white">
                  {Math.floor(baseTimePerSide / 60)} dk {baseTimePerSide % 60} sn
                </div>
                <div className="text-[10px] text-stone-400 mt-1">
                  Her iki yüz eşit süre mühürlenir
                </div>
              </div>

              <div className="p-4 bg-stone-800/80 rounded-xl border border-stone-700/80">
                <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dinlendirme</span>
                </div>
                <div className="text-2xl font-black font-mono text-white">
                  {restTimeMinutes} Dakika
                </div>
                <div className="text-[10px] text-stone-400 mt-1">
                  Tahtada kesmeden bekletiniz
                </div>
              </div>
            </div>

            {/* Chef Protocol Step-by-Step */}
            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Oda Sıcaklığı:</strong> Eti buzdolabından çıkarıp en az 30 dakika bekletin. Soğuk et tavaya girdiğinde tavanın ısısını düşürür.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Zeytinyağı & Dağ Kekiği:</strong> Yüzeyine hafif sızma zeytinyağı, çekilmiş deniz tuzu ve taze dağ kekiği sürün.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Arrose (Banyolatma):</strong> Mühürlemenin son {butterBastingTime} saniyesinde tavaya 1 yemek kaşığı köy tereyağı ve 1 dal taze biberiye atıp kaşıkla etin üzerine gezdirin.
                </span>
              </div>
            </div>

            {/* Interactive Searing Stopwatch */}
            <div className="pt-2 border-t border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-300">Canlı Pişirme Zamanlayıcısı:</span>
                <span className="font-mono text-xl font-black text-amber-400">
                  {formatTime(timerSeconds)}
                </span>
              </div>

              <div className="flex gap-2">
                {!isTimerRunning ? (
                  <button
                    onClick={() => handleStartTimer(baseTimePerSide)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold text-xs cursor-pointer transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Mühürlemeyi Başlat ({baseTimePerSide} sn)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsTimerRunning(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs cursor-pointer transition-colors"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Zamanlayıcıyı Duraklat</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(baseTimePerSide);
                  }}
                  className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg cursor-pointer transition-colors"
                  title="Sıfırla"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
