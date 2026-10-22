import React from 'react';
import { DeviceMode, ViewMode, SiteSection, SitePage } from '../../types/siteBuilder';
import { Product, CartItem, SiteConfig, OrderReceipt, MeatCategory } from '../../types';
import { SectionWrapper } from './SectionWrapper';
import { DynamicBlockRenderer } from './DynamicBlockRenderer';
import { BonfiletHeroSlider } from '../BonfiletHeroSlider';
import { CategoryCircleShowcase } from '../CategoryCircleShowcase';
import { Hero } from '../Hero';
import { ProductCatalog } from '../ProductCatalog';
import { AboutFacility } from '../AboutFacility';
import { CookingGuide } from '../CookingGuide';
import { HorecaB2B } from '../HorecaB2B';
import { Testimonials } from '../Testimonials';
import { MeatAnatomyExplorer } from '../MeatAnatomyExplorer';
import { SteakCookingCalculator } from '../SteakCookingCalculator';
import { ColdChainMonitor } from '../ColdChainMonitor';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { Plus } from 'lucide-react';

interface BuilderCanvasProps {
  deviceMode: DeviceMode;
  viewMode: ViewMode;
  activePage: SitePage;
  config: SiteConfig;
  products: Product[];
  categories: readonly { id: string; name: string }[];
  cartCount: number;
  cartTotal?: number;
  orders?: OrderReceipt[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedCategory?: MeatCategory;
  onSelectCategory?: (category: MeatCategory) => void;
  onOpenCart: () => void;
  onOpenCustomizer: () => void;
  onOpenAdmin?: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, weight: any) => void;
  onNavigateSection: (sectionId: string) => void;
  onUpdateSection: (updated: SiteSection) => void;
  onDuplicateSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onMoveSection: (index: number, direction: 'up' | 'down') => void;
  onAddSection: (type: any) => void;
}

export const BuilderCanvas: React.FC<BuilderCanvasProps> = ({
  deviceMode,
  viewMode,
  activePage,
  config,
  products,
  categories,
  cartCount,
  cartTotal = 0,
  orders = [],
  searchQuery = '',
  onSearchChange,
  selectedCategory = 'all',
  onSelectCategory,
  onOpenCart,
  onOpenCustomizer,
  onOpenAdmin,
  onSelectProduct,
  onAddToCart,
  onNavigateSection,
  onUpdateSection,
  onDuplicateSection,
  onDeleteSection,
  onMoveSection,
  onAddSection,
}) => {
  // Determine width based on device simulation
  const getContainerWidthClass = () => {
    if (viewMode === 'live') return 'w-full';
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[375px] my-6 rounded-3xl border-8 border-neutral-800 shadow-2xl overflow-hidden';
      case 'tablet':
        return 'max-w-[768px] my-6 rounded-2xl border-8 border-neutral-800 shadow-2xl overflow-hidden';
      case 'desktop':
      default:
        return 'w-full max-w-full';
    }
  };

  const renderSectionContent = (section: SiteSection) => {
    switch (section.type) {
      case 'hero':
        return (
          <>
            <BonfiletHeroSlider
              config={config}
              onExploreProducts={() => onNavigateSection('urunler')}
              onRequestB2BQuote={() => onNavigateSection('horeca')}
              onNavigateSection={onNavigateSection}
            />
            <CategoryCircleShowcase
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                if (onSelectCategory) onSelectCategory(cat);
              }}
            />
          </>
        );

      case 'catalog':
        return (
          <ProductCatalog
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart}
          />
        );

      case 'about':
        return <AboutFacility config={config} />;

      case 'anatomy-explorer':
        return (
          <MeatAnatomyExplorer
            products={products}
            onSelectProductBySlug={(slug) => {
              const p = products.find((x) => x.slug === slug);
              if (p) onSelectProduct(p);
            }}
          />
        );

      case 'cooking-guide':
        return <CookingGuide />;

      case 'steak-calculator':
        return <SteakCookingCalculator />;

      case 'cold-chain':
        return <ColdChainMonitor orders={orders || []} />;

      case 'horeca':
        return <HorecaB2B config={config} />;

      case 'testimonials':
        return <Testimonials />;

      default:
        return <DynamicBlockRenderer section={section} config={config} />;
    }
  };

  return (
    <div className="flex-1 bg-stone-100 overflow-y-auto flex flex-col items-center">
      {/* If simulated device, show banner */}
      {viewMode === 'editor' && deviceMode !== 'desktop' && (
        <div className="py-2 text-center text-xs text-stone-500 font-mono">
          {deviceMode === 'mobile' ? 'Mobil Görünüm (375px)' : 'Tablet Görünüm (768px)'}
        </div>
      )}

      <div className={`transition-all duration-300 bg-white ${getContainerWidthClass()}`}>
        {/* Render Site Header / Navbar */}
        <Navbar
          config={config}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onOpenCart={onOpenCart}
          onOpenCustomizer={onOpenCustomizer}
          onOpenAdmin={onOpenAdmin}
          activeSection="hero"
          onNavigate={onNavigateSection}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSelectCategory={onSelectCategory}
        />

        {/* Sections of the active page */}
        <div className="divide-y divide-stone-200">
          {activePage.sections.map((section, index) => (
            <SectionWrapper
              key={section.id}
              section={section}
              index={index}
              totalSections={activePage.sections.length}
              viewMode={viewMode}
              onUpdateSection={onUpdateSection}
              onDuplicateSection={onDuplicateSection}
              onDeleteSection={onDeleteSection}
              onMoveSection={onMoveSection}
            >
              {renderSectionContent(section)}
            </SectionWrapper>
          ))}
        </div>

        {/* Quick Add Section button in Editor Mode */}
        {viewMode === 'editor' && (
          <div className="py-8 bg-neutral-900/30 border-t border-dashed border-neutral-800 text-center">
            <button
              onClick={() => onAddSection('text-block')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-300 rounded-md transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>Yeni Bölüm Ekle</span>
            </button>
          </div>
        )}

        {/* Render Site Footer */}
        <Footer
          config={config}
          onNavigate={onNavigateSection}
          onOpenCustomizer={onOpenCustomizer}
          onOpenAdmin={onOpenAdmin}
        />
      </div>
    </div>
  );
};
