import React, { useState } from 'react';
import { X, Flame, Clock, Award, ShieldCheck, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { MeatVisual } from './MeatVisual';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedWeight: { label: string; grams: number; multiplier: number }) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const currentWeight = product.weights[selectedWeightIndex] || product.weights[0];
  const totalPrice = Math.round(product.basePrice * currentWeight.multiplier);

  const handleAdd = () => {
    onAddToCart(product, currentWeight);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl text-white max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header / Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-white bg-neutral-900/80 rounded-full border border-neutral-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Visual Showcase */}
          <div className="relative rounded-lg overflow-hidden border border-neutral-800 aspect-[16/9] bg-neutral-900">
            <MeatVisual
              slug={product.slug}
              name={product.name}
              category={product.category}
              imageUrl={product.imageUrl}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold uppercase bg-red-700 text-white rounded">
                {product.badge}
              </span>
            )}
          </div>

          {/* Title & Category */}
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
              <span>{product.categoryName}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>{product.origin}</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">{product.name}</h2>
            <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Cut Location & Quality Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-neutral-900 rounded border border-neutral-800">
              <span className="text-neutral-400 block text-[11px]">Kesim Yeri</span>
              <span className="font-bold text-white mt-0.5 block">{product.cutLocation}</span>
            </div>
            <div className="p-3 bg-neutral-900 rounded border border-neutral-800">
              <span className="text-neutral-400 block text-[11px]">Yağ Dengesi</span>
              <span className="font-bold text-white mt-0.5 block">{product.fatRatio}</span>
            </div>
            <div className="p-3 bg-neutral-900 rounded border border-neutral-800">
              <span className="text-neutral-400 block text-[11px]">Önerilen Pişirme</span>
              <span className="font-bold text-white mt-0.5 block">{product.cookingMethods.join(', ')}</span>
            </div>
            <div className="p-3 bg-neutral-900 rounded border border-neutral-800">
              <span className="text-neutral-400 block text-[11px]">İdeal Süre</span>
              <span className="font-bold text-white mt-0.5 block">{product.cookingTimeMinutes} Dakika</span>
            </div>
          </div>

          {/* Chef Advice Box */}
          <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Efecioğlu Şefinin Pişirme Sırrı</span>
            </div>
            <p className="text-neutral-300 leading-relaxed pl-6">
              {product.chefAdvice}
            </p>
          </div>

          {/* Nutritional Values (100g) */}
          <div>
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              100g İçin Besin Değerleri
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-neutral-900/60 rounded border border-neutral-800/80">
                <span className="text-neutral-400 text-[10px]">Enerji</span>
                <div className="font-mono font-bold text-white tabular-nums">{product.nutritionPer100g.calories} kcal</div>
              </div>
              <div className="p-2 bg-neutral-900/60 rounded border border-neutral-800/80">
                <span className="text-neutral-400 text-[10px]">Protein</span>
                <div className="font-mono font-bold text-amber-400 tabular-nums">{product.nutritionPer100g.protein} g</div>
              </div>
              <div className="p-2 bg-neutral-900/60 rounded border border-neutral-800/80">
                <span className="text-neutral-400 text-[10px]">Yağ</span>
                <div className="font-mono font-bold text-white tabular-nums">{product.nutritionPer100g.fat} g</div>
              </div>
              <div className="p-2 bg-neutral-900/60 rounded border border-neutral-800/80">
                <span className="text-neutral-400 text-[10px]">Karbonhidrat</span>
                <div className="font-mono font-bold text-white tabular-nums">{product.nutritionPer100g.carbs} g</div>
              </div>
            </div>
          </div>

          {/* Weight Selection & Purchase bar */}
          <div className="pt-2 border-t border-neutral-800 space-y-3">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Gramaj / Paket Seçeneği:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.weights.map((w, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedWeightIndex(idx)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                      selectedWeightIndex === idx
                        ? 'bg-red-700 text-white font-bold'
                        : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-700'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs text-neutral-400">Toplam Fiyat</span>
                <div className="text-2xl font-black text-white font-mono tabular-nums">
                  {totalPrice.toLocaleString('tr-TR')} <span className="text-sm font-normal text-neutral-400 font-sans">TL</span>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-6 py-3 text-sm font-bold bg-red-700 hover:bg-red-800 text-white rounded-md transition-colors cursor-pointer"
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
