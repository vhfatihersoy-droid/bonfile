import React, { useState } from 'react';
import { Search, ShoppingBag, Eye, Flame, Check, Sparkles } from 'lucide-react';
import { Product, MeatCategory } from '../types';
import { MeatVisual } from './MeatVisual';

interface ProductCatalogProps {
  products: Product[];
  categories: readonly { id: string; name: string }[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, selectedWeight: { label: string; grams: number; multiplier: number }) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  categories,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MeatCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({});
  const [addedAnimation, setAddedAnimation] = useState<string | null>(null);

  // Filter products based on category and search
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.cutLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getProductWeight = (product: Product) => {
    const weightIndex = selectedWeights[product.id] ?? 0;
    return product.weights[weightIndex] || product.weights[0];
  };

  const handleWeightChange = (productId: string, weightIndex: number) => {
    setSelectedWeights((prev) => ({ ...prev, [productId]: weightIndex }));
  };

  const handleAdd = (product: Product) => {
    const weight = getProductWeight(product);
    onAddToCart(product, weight);
    setAddedAnimation(product.id);
    setTimeout(() => setAddedAnimation(null), 1200);
  };

  return (
    <section id="urunler" className="py-16 bg-stone-50/70 text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-red-700 uppercase">
              <span>Seçkin Kesimler</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>%100 Yerli Besi Dana & Kuzu</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 mt-1">
              Taze Et & Şarküteri Kataloğu
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Himalaya tuz odalarında dinlendirilmiş steak kesimlerinden dağ kekiği ve zeytinyağıyla marine edilmiş özel seçkilere kadar tüm ürünlerimiz soğuk zincir güvencesiyle hazırlanır.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün veya kesim ara (örn. Dallas, Antrikot)..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition-colors shadow-2xs"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-stone-400 hover:text-stone-700 font-medium"
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as MeatCategory)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-red-700 text-white font-bold shadow-md shadow-red-700/20'
                  : 'bg-white text-stone-700 hover:text-red-800 hover:bg-stone-100 border border-stone-200/90 shadow-2xs'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-stone-300 rounded-2xl bg-white">
            <Flame className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">Aradığınız kriterde ürün bulunamadı</h3>
            <p className="text-xs text-stone-500 mt-1">Farklı bir arama terimi deneyebilir veya kategoriyi değiştirebilirsiniz.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-bold bg-stone-800 text-white rounded-lg hover:bg-stone-700"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const currentWeight = getProductWeight(product);
              const price = Math.round(product.basePrice * currentWeight.multiplier);
              const isAdded = addedAnimation === product.id;

              return (
                <div
                  key={product.id}
                  className="group bg-white border border-stone-200/90 rounded-xl overflow-hidden flex flex-col justify-between hover:border-red-300 hover:shadow-xl transition-all duration-300 shadow-2xs"
                >
                  <div>
                    {/* Visual Media Header */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onSelectProduct(product)}>
                      <MeatVisual
                        slug={product.slug}
                        name={product.name}
                        category={product.category}
                        imageUrl={product.imageUrl}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                        {product.badge && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-red-700 text-white rounded shadow-xs">
                            {product.badge}
                          </span>
                        )}
                        {product.agingDays && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-white/95 text-stone-800 border border-stone-200 rounded shadow-xs">
                            {product.agingDays} Gün Dry-Aged
                          </span>
                        )}
                      </div>

                      {/* Quick View Button on Hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-white/95 hover:bg-white text-stone-900 rounded-md border border-stone-200 transition-opacity shadow-xs group-hover:opacity-100"
                      >
                        <Eye className="w-3.5 h-3.5 text-red-700" />
                        <span>Detay</span>
                      </button>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 space-y-3">
                      <div>
                        {/* Clean unboxed metadata kicker */}
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
                          <span>{product.cutLocation}</span>
                          <span aria-hidden="true" className="text-stone-300">·</span>
                          <span>{product.fatRatio}</span>
                        </div>

                        {/* Title */}
                        <h3
                          onClick={() => onSelectProduct(product)}
                          className="text-base font-bold text-stone-900 group-hover:text-red-700 transition-colors mt-0.5 cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h3>

                        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                          {product.tagline}
                        </p>
                      </div>

                      {/* Weight Selector */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                          Paket Gramajı Seçin:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {product.weights.map((w, index) => {
                            const isSelected = (selectedWeights[product.id] ?? 0) === index;
                            return (
                              <button
                                key={index}
                                onClick={() => handleWeightChange(product.id, index)}
                                className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-red-700 text-white font-bold shadow-2xs'
                                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200 border border-stone-200'
                                }`}
                              >
                                {w.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Price & Add to Cart */}
                  <div className="p-4 pt-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-medium text-stone-500">Gramaj Tutarı</div>
                      <div className="text-lg font-black text-red-700 font-mono tabular-nums">
                        {price.toLocaleString('tr-TR')} <span className="text-xs font-bold text-stone-600 font-sans">TL</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdd(product)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white shadow-sm shadow-red-700/20'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Eklendi</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Sepete Ekle</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
