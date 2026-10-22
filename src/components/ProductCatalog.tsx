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
    <section id="urunler" className="py-20 bg-stone-50/50 text-stone-900 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-red-700 uppercase">
              <span>Seçkin Kesimler</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>%100 Yerli Besi Dana & Kuzu</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-950 mt-1">
              Taze Et & Şarküteri Kataloğu
            </h2>
            <p className="text-sm text-stone-600 mt-1.5 max-w-xl">
              Himalaya tuz odalarında dinlendirilmiş steak kesimlerinden dağ kekiği ve Ayvalık sızma zeytinyağıyla marine edilmiş taze kasap seçkilerine kadar tüm ürünlerimiz +4°C soğuk zincirle sunulur.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün veya kesim ara (örn. Dallas, Bonfile)..."
              className="w-full pl-10 pr-4 py-3 text-xs bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition-all shadow-xs"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs text-stone-400 hover:text-stone-700 font-medium"
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs - Clean Modern Segmented Control */}
        <div className="flex items-center gap-1.5 p-1.5 bg-stone-100 rounded-xl overflow-x-auto scrollbar-none mb-10">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as MeatCategory)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-stone-200 rounded-2xl bg-white">
            <Flame className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">Aradığınız kriterde ürün bulunamadı</h3>
            <p className="text-xs text-stone-500 mt-1">Farklı bir arama terimi deneyebilir veya kategoriyi değiştirebilirsiniz.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2.5 text-xs font-bold bg-stone-900 text-white rounded-xl hover:bg-stone-800 cursor-pointer"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((product) => {
              const currentWeight = getProductWeight(product);
              const price = Math.round(product.basePrice * currentWeight.multiplier);
              const isAdded = addedAnimation === product.id;

              return (
                <div
                  key={product.id}
                  className="group bg-white border border-stone-200/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-red-400 hover:shadow-xl transition-all duration-300"
                >
                  <div>
                    {/* Visual Media Header */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onSelectProduct(product)}>
                      <MeatVisual
                        slug={product.slug}
                        name={product.name}
                        category={product.category}
                        imageUrl={product.imageUrl}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                        {product.badge && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-red-700 text-white rounded-md shadow-xs">
                            {product.badge}
                          </span>
                        )}
                        {product.agingDays && (
                          <span className="text-[10px] font-bold px-2 py-1 bg-white/95 text-stone-900 border border-stone-200 rounded-md shadow-xs">
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
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-white/95 hover:bg-white text-stone-900 rounded-lg border border-stone-200 transition-opacity shadow-xs group-hover:opacity-100"
                      >
                        <Eye className="w-3.5 h-3.5 text-red-700" />
                        <span>İncele</span>
                      </button>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-3">
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
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                          Gramaj Tercihi:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {product.weights.map((w, index) => {
                            const isSelected = (selectedWeights[product.id] ?? 0) === index;
                            return (
                              <button
                                key={index}
                                onClick={() => handleWeightChange(product.id, index)}
                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-stone-900 text-white font-bold'
                                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
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
                  <div className="p-5 pt-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-medium text-stone-500">Fiyat</div>
                      <div className="text-xl font-black text-red-700 font-mono tabular-nums">
                        {price.toLocaleString('tr-TR')} <span className="text-xs font-bold text-stone-600 font-sans">TL</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdd(product)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-700 hover:bg-red-800 text-white shadow-xs'
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
