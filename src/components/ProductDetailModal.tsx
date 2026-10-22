import React, { useState } from 'react';
import { X, Flame, Clock, Award, ShieldCheck, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { MeatVisual } from './MeatVisual';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    selectedWeight: { label: string; grams: number; multiplier: number },
    customOptions?: { marinade?: string; sliceThickness?: string; packaging?: string }
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0);
  const [selectedMarinade, setSelectedMarinade] = useState('Dağ Kekiği & Ayvalık Sızma Zeytinyağlı');
  const [selectedThickness, setSelectedThickness] = useState('Standart Dilim (2 cm)');
  const [selectedPackaging, setSelectedPackaging] = useState('Çift Kat Termoform Vakum (+4°C)');
  const [justAdded, setJustAdded] = useState(false);

  const currentWeight = product.weights[selectedWeightIndex] || product.weights[0];
  const totalPrice = Math.round(product.basePrice * currentWeight.multiplier);

  const handleAdd = () => {
    onAddToCart(product, currentWeight, {
      marinade: selectedMarinade,
      sliceThickness: selectedThickness,
      packaging: selectedPackaging,
    });
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xl text-stone-900 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header / Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-900 bg-white/90 rounded-full border border-stone-200 shadow-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Visual Showcase */}
          <div className="relative rounded-xl overflow-hidden border border-stone-200 aspect-[16/9] bg-stone-100">
            <MeatVisual
              slug={product.slug}
              name={product.name}
              category={product.category}
              imageUrl={product.imageUrl}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-black uppercase bg-red-700 text-white rounded-md shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Title & Category */}
          <div>
            <div className="flex items-center gap-2 text-xs text-red-700 font-bold uppercase tracking-wider">
              <span>{product.categoryName}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{product.origin}</span>
            </div>
            <h2 className="text-2xl font-black text-stone-950 mt-1">{product.name}</h2>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Cut Location & Quality Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">Kesim Yeri</span>
              <span className="font-bold text-stone-900 mt-0.5 block">{product.cutLocation}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">Yağ Dengesi</span>
              <span className="font-bold text-stone-900 mt-0.5 block">{product.fatRatio}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">Önerilen Pişirme</span>
              <span className="font-bold text-stone-900 mt-0.5 block">{product.cookingMethods.join(', ')}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">İdeal Süre</span>
              <span className="font-bold text-stone-900 mt-0.5 block">{product.cookingTimeMinutes} Dakika</span>
            </div>
          </div>

          {/* Chef Advice Box */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-2 text-red-800 font-bold">
              <Flame className="w-4 h-4 text-red-700" />
              <span>Özlemce Şefinin Pişirme & Marinasyon Sırrı</span>
            </div>
            <p className="text-stone-700 leading-relaxed pl-6">
              {product.chefAdvice}
            </p>
          </div>

          {/* Nutritional Values (100g) */}
          <div>
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              100g İçin Besin Değerleri
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 text-[10px]">Enerji</span>
                <div className="font-mono font-bold text-stone-900 tabular-nums">{product.nutritionPer100g.calories} kcal</div>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 text-[10px]">Protein</span>
                <div className="font-mono font-black text-red-700 tabular-nums">{product.nutritionPer100g.protein} g</div>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 text-[10px]">Yağ</span>
                <div className="font-mono font-bold text-stone-900 tabular-nums">{product.nutritionPer100g.fat} g</div>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 text-[10px]">Karbonhidrat</span>
                <div className="font-mono font-bold text-stone-900 tabular-nums">{product.nutritionPer100g.carbs} g</div>
              </div>
            </div>
          </div>

          {/* Butcher Marinade & Preparation Selection */}
          <div className="pt-2 border-t border-stone-200 space-y-3">
            <div>
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-1.5">
                Usta Kasap Marinasyonu:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { name: 'Dağ Kekiği & Ayvalık Sızma Zeytinyağlı', desc: 'Taze kekik, sızma zeytinyağı ve deniz tuzu' },
                  { name: 'Taze Biberiye & Sarımsaklı', desc: 'Biberiye dalı, ezilmiş sarımsak ve karabiber' },
                  { name: 'Doğal / Marinesiz', desc: 'Klasik katkısız taze kasap kesimi' },
                ].map((m) => {
                  const isSel = selectedMarinade === m.name;
                  return (
                    <button
                      key={m.name}
                      onClick={() => setSelectedMarinade(m.name)}
                      className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                        isSel
                          ? 'border-red-600 bg-red-50/70 text-red-900 ring-1 ring-red-600'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">{m.name}</span>
                      <span className="text-[10px] text-stone-500 mt-0.5 block leading-tight">{m.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-1.5">
                  Dilim Kalınlığı:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Standart Dilim (2 cm)',
                    'Steakhouse Kalın (3.5 cm)',
                    'Bütün Blok (Dilimsiz)',
                  ].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedThickness(t)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        selectedThickness === t
                          ? 'bg-stone-900 text-white font-bold border-stone-900'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-1.5">
                  Ambalaj & Koruma:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Çift Kat Termoform Vakum (+4°C)',
                    'Kasap Kağıdında Taze Sarım',
                  ].map((pkg) => (
                    <button
                      key={pkg}
                      onClick={() => setSelectedPackaging(pkg)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        selectedPackaging === pkg
                          ? 'bg-stone-900 text-white font-bold border-stone-900'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200'
                      }`}
                    >
                      {pkg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Gramaj / Porsiyon:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.weights.map((w, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedWeightIndex(idx)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                      selectedWeightIndex === idx
                        ? 'bg-red-700 text-white font-bold shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs text-stone-500 font-medium">Toplam Fiyat</span>
                <div className="text-2xl font-black text-red-700 font-mono tabular-nums">
                  {totalPrice.toLocaleString('tr-TR')} <span className="text-sm font-bold text-stone-600 font-sans">TL</span>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-6 py-3 text-sm font-bold bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white rounded-lg transition-all cursor-pointer shadow-md shadow-red-700/20"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Sepete Eklendi!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Sepete Ekle</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
