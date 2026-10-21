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
    <section id="urunler" className="py-16 bg-neutral-900/60 text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
              <span>Seçkin Kesimler</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>%100 Yerli Besi Dana & Kuzu</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              Et & Şarküteri Kataloğu
            </h2>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl">
              Himalaya tuz odalarında dinlendirilmiş steak kesimlerinden geleneksel odun ateşi dönerine kadar tüm ürünler hijyenik vakumlu ambalajında hazırlanır.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün veya kesim ara (örn. Dallas, Antrikot)..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-neutral-400 hover:text-white"
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs (Interactive Filter Buttons adhering to guidelines) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as MeatCategory)}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-red-700 text-white font-semibold shadow-sm'
                  : 'bg-neutral-950/80 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-neutral-800 rounded-xl">
            <Flame className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-neutral-300">Aradığınız kriterde ürün bulunamadı</h3>
            <p className="text-xs text-neutral-500 mt-1">Farklı bir arama terimi deneyebilir veya kategoriyi değiştirebilirsiniz.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-medium bg-neutral-800 text-white rounded-md hover:bg-neutral-700"
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
                  className="group bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all duration-200"
                >
                  <div>
                    {/* Visual Media Header */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900 cursor-pointer" onClick={() => onSelectProduct(product)}>
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
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-red-700 text-white rounded shadow-sm">
                            {product.badge}
                          </span>
                        )}
                        {product.agingDays && (
                          <span className="text-[10px] font-medium px-2 py-0.5 bg-neutral-900/90 text-amber-300 border border-amber-500/30 rounded">
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
                        className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-neutral-900/90 hover:bg-neutral-800 text-white rounded border border-neutral-700 transition-opacity opacity-90 group-hover:opacity-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detay</span>
                      </button>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 space-y-3">
                      <div>
                        {/* Clean unboxed metadata kicker */}
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                          <span>{product.cutLocation}</span>
                          <span aria-hidden="true" className="text-neutral-600">·</span>
                          <span>{product.fatRatio}</span>
                        </div>

                        {/* Title */}
                        <h3
                          onClick={() => onSelectProduct(product)}
                          className="text-base font-bold text-white group-hover:text-amber-400 transition-colors mt-0.5 cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h3>

                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                          {product.tagline}
                        </p>
                      </div>

                      {/* Weight Selector */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                          Paket Gramajı Seçin:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {product.weights.map((w, index) => {
                            const isSelected = (selectedWeights[product.id] ?? 0) === index;
                            return (
                              <button
                                key={index}
                                onClick={() => handleWeightChange(product.id, index)}
                                className={`px-2 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-neutral-800 text-amber-400 border border-amber-400/50 font-semibold'
                                    : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
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
                  <div className="p-4 pt-3 border-t border-neutral-900 bg-neutral-950/40 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] text-neutral-400">Seçilen Gramaj Tutarı</div>
                      <div className="text-lg font-black text-white font-mono tabular-nums">
                        {price.toLocaleString('tr-TR')} <span className="text-xs font-normal text-neutral-400 font-sans">TL</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdd(product)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-700 hover:bg-red-800 text-white shadow-sm'
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
