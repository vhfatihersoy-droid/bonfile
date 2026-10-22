/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialSiteConfig, categories, products as initialProducts } from './data/mockData';
import { initialPages, defaultThemes } from './data/builderData';
import { Product, CartItem, SiteConfig, OrderReceipt, Coupon, MeatCategory } from './types';
import {
  getStoredOrders,
  saveStoredOrders,
  getStoredProducts,
  saveStoredProducts,
  getStoredCoupons,
  saveStoredCoupons,
} from './data/orderStore';
import { DeviceMode, ViewMode, SidebarTab, SitePage, SiteSection, GoogleSitesTheme, SectionType } from './types/siteBuilder';
import { TopToolbar } from './components/GoogleSitesBuilder/TopToolbar';
import { RightSidebar } from './components/GoogleSitesBuilder/RightSidebar';
import { BuilderCanvas } from './components/GoogleSitesBuilder/BuilderCanvas';
import { PublishModal } from './components/GoogleSitesBuilder/PublishModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { SiteCustomizerModal } from './components/SiteCustomizerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Sliders, MessageCircle, Code2, Globe, ShieldCheck } from 'lucide-react';

export default function App() {
  // Site configuration & products
  const [config, setConfig] = useState<SiteConfig>(initialSiteConfig);
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [orders, setOrders] = useState<OrderReceipt[]>(() => getStoredOrders());
  const [coupons, setCoupons] = useState<Coupon[]>(() => getStoredCoupons());

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // E-commerce live search & category filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MeatCategory>('all');

  // Sync state changes with localStorage
  const handleUpdateProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    saveStoredProducts(updatedProducts);
  };

  const handleUpdateOrders = (updatedOrders: OrderReceipt[]) => {
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);
  };

  const handleUpdateCoupons = (updatedCoupons: Coupon[]) => {
    setCoupons(updatedCoupons);
    saveStoredCoupons(updatedCoupons);
  };

  const handleAddNewOrder = (newOrder: OrderReceipt) => {
    const next = [newOrder, ...orders];
    setOrders(next);
    saveStoredOrders(next);
  };

  // Google Sites Builder state
  const [pages, setPages] = useState<SitePage[]>(initialPages);
  const [activePageId, setActivePageId] = useState<string>(initialPages[0].id);
  const [activeTab, setActiveTab] = useState<SidebarTab>('insert');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('live');
  const [selectedTheme, setSelectedTheme] = useState<GoogleSitesTheme>(defaultThemes[0]);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<SitePage[][]>([initialPages]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = (newPages: SitePage[]) => {
    const updated = history.slice(0, historyIndex + 1);
    updated.push(newPages);
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
    setPages(newPages);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPages(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPages(history[historyIndex + 1]);
    }
  };

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];

  // Navigation smoothly scrolls to anchor
  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    selectedWeight: { label: string; grams: number; multiplier: number },
    customOptions?: { marinade?: string; sliceThickness?: string; packaging?: string }
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedWeight.grams === selectedWeight.grams &&
          item.marinade === customOptions?.marinade
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += 1;
        return copy;
      } else {
        return [
          ...prev,
          {
            product,
            selectedWeight,
            quantity: 1,
            marinade: customOptions?.marinade,
            sliceThickness: customOptions?.sliceThickness,
            packaging: customOptions?.packaging,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, weightGrams: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedWeight.grams === weightGrams) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string, weightGrams: number) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedWeight.grams === weightGrams))
    );
  };

  // Page operations
  const handleAddPage = (pageName: string) => {
    const slug = pageName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newPage: SitePage = {
      id: `page-${Date.now()}`,
      name: pageName,
      slug,
      isHome: false,
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          type: 'text-block',
          title: pageName,
          subtitle: `${pageName} sayfası için içeriklerinizi buradan düzenleyebilirsiniz.`,
          bgColor: 'bg-neutral-950',
          isVisible: true,
        },
      ],
    };
    const nextPages = [...pages, newPage];
    pushHistory(nextPages);
    setActivePageId(newPage.id);
  };

  const handleDeletePage = (pageId: string) => {
    const nextPages = pages.filter((p) => p.id !== pageId);
    pushHistory(nextPages);
    if (activePageId === pageId) {
      setActivePageId(nextPages[0].id);
    }
  };

  // Section operations on active page
  const handleAddSection = (sectionType: SectionType) => {
    const newSection: SiteSection = {
      id: `sec-${Date.now()}`,
      type: sectionType,
      title:
        sectionType === 'hero'
          ? 'Ustalıkla Dinlendirilmiş Gerçek Et'
          : sectionType === 'catalog'
          ? 'Taze Et & Şarküteri Kataloğu'
          : sectionType === 'cooking-guide'
          ? 'Şefin Pişirme Rehberi'
          : sectionType === 'horeca'
          ? 'Horeca Kurumsal Tedarik'
          : sectionType === 'contact'
          ? 'İletişim & Fabrika Konumu'
          : sectionType === 'cta-banner'
          ? 'WhatsApp Sipariş Hattımız Hizmetinizde'
          : sectionType === 'features-grid'
          ? 'Öne Çıkan Standartlarımız'
          : 'Yeni Metin Bölümü',
      subtitle: 'Bu bölümün başlığını ve içeriğini sol taraftaki menüden düzenleyebilirsiniz.',
      bgColor: 'bg-neutral-950',
      isVisible: true,
    };

    const nextPages = pages.map((p) => {
      if (p.id === activePageId) {
        return {
          ...p,
          sections: [...p.sections, newSection],
        };
      }
      return p;
    });

    pushHistory(nextPages);
  };

  const handleUpdateSection = (updatedSection: SiteSection) => {
    const nextPages = pages.map((p) => {
      if (p.id === activePageId) {
        return {
          ...p,
          sections: p.sections.map((s) => (s.id === updatedSection.id ? updatedSection : s)),
        };
      }
      return p;
    });
    pushHistory(nextPages);
  };

  const handleDuplicateSection = (sectionId: string) => {
    const sectionToDup = activePage.sections.find((s) => s.id === sectionId);
    if (!sectionToDup) return;

    const duplicated: SiteSection = {
      ...sectionToDup,
      id: `sec-${Date.now()}`,
      title: `${sectionToDup.title} (Kopya)`,
    };

    const nextPages = pages.map((p) => {
      if (p.id === activePageId) {
        const idx = p.sections.findIndex((s) => s.id === sectionId);
        const copy = [...p.sections];
        copy.splice(idx + 1, 0, duplicated);
        return { ...p, sections: copy };
      }
      return p;
    });

    pushHistory(nextPages);
  };

  const handleDeleteSection = (sectionId: string) => {
    const nextPages = pages.map((p) => {
      if (p.id === activePageId) {
        return {
          ...p,
          sections: p.sections.filter((s) => s.id !== sectionId),
        };
      }
      return p;
    });
    pushHistory(nextPages);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activePage.sections.length) return;

    const nextPages = pages.map((p) => {
      if (p.id === activePageId) {
        const copy = [...p.sections];
        const [moved] = copy.splice(index, 1);
        copy.splice(targetIndex, 0, moved);
        return { ...p, sections: copy };
      }
      return p;
    });

    pushHistory(nextPages);
  };

  // HTML Export generator
  const handleDownloadHtml = () => {
    setIsCustomizerOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, item) => {
    const itemPrice = Math.round(item.product.basePrice * item.selectedWeight.multiplier);
    return acc + itemPrice * item.quantity;
  }, 0);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-stone-100 font-sans selection:bg-red-700 selection:text-white">
      {/* Google Sites Iconic Top Toolbar (Always available in Editor mode) */}
      {viewMode !== 'live' ? (
        <TopToolbar
          config={config}
          onUpdateSiteName={(name) => setConfig({ ...config, brandName: name })}
          deviceMode={deviceMode}
          onDeviceChange={setDeviceMode}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onPublish={() => setIsPublishOpen(true)}
          onDownloadHtml={handleDownloadHtml}
          isPublished={isPublished}
        />
      ) : (
        /* Floating banner in Live Mode to easily return to Google Sites Editor */
        <div className="bg-white border-b border-stone-200 px-4 py-2 flex items-center justify-between text-xs text-stone-700 z-50 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-bold text-stone-900">Canlı Kasap Mağazası Önizleme Modu</span>
            <span className="hidden sm:inline text-stone-300">·</span>
            <span className="hidden sm:inline text-stone-500">Bonfilet tarzı geniş slider, dairesel kategori ikonları ve entegre arama aktif.</span>
          </div>
          <button
            onClick={() => setViewMode('editor')}
            className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-md cursor-pointer shadow-2xs"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Google Sites Düzenleyici</span>
          </button>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Central Canvas with responsive frame simulation */}
        <BuilderCanvas
          deviceMode={deviceMode}
          viewMode={viewMode}
          activePage={activePage}
          config={config}
          products={products}
          categories={categories}
          cartCount={totalCartCount}
          cartTotal={totalCartPrice}
          orders={orders}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
          onAddToCart={handleAddToCart}
          onNavigateSection={handleNavigateSection}
          onUpdateSection={handleUpdateSection}
          onDuplicateSection={handleDuplicateSection}
          onDeleteSection={handleDeleteSection}
          onMoveSection={handleMoveSection}
          onAddSection={handleAddSection}
        />

        {/* Google Sites Right Sidebar (Ekle / Sayfalar / Temalar) - only in Editor mode */}
        {viewMode === 'editor' && (
          <RightSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            pages={pages}
            activePageId={activePageId}
            onSelectPage={setActivePageId}
            onAddPage={handleAddPage}
            onDeletePage={handleDeletePage}
            onAddSection={handleAddSection}
            selectedTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
          />
        )}
      </div>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        config={config}
        coupons={coupons}
        onAddOrder={handleAddNewOrder}
      />

      {/* Store & Butcher Admin Management Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProducts={handleUpdateProducts}
        orders={orders}
        onUpdateOrders={handleUpdateOrders}
        coupons={coupons}
        onUpdateCoupons={handleUpdateCoupons}
        config={config}
        onUpdateConfig={setConfig}
      />

      <SiteCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onUpdateConfig={setConfig}
        onAddCustomProduct={(p) => handleUpdateProducts([p, ...products])}
        onResetDefaults={() => {
          setConfig(initialSiteConfig);
          handleUpdateProducts(initialProducts);
          setPages(initialPages);
        }}
      />

      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        config={config}
        onViewLive={() => {
          setIsPublishOpen(false);
          setViewMode('live');
        }}
        onDownloadHtml={() => {
          setIsPublishOpen(false);
          setIsCustomizerOpen(true);
        }}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5">
        {/* Admin Dashboard Floating Shortcut */}
        <button
          onClick={() => setIsAdminOpen(true)}
          title="Özlemce Et Entegre Tesisi Mağaza & Sipariş Yönetim Paneli"
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-amber-500/50 rounded-full shadow-2xl text-xs font-bold cursor-pointer transition-transform hover:scale-105"
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Yönetim Paneli</span>
        </button>

        {/* WhatsApp Customer Order */}
        <a
          href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl text-xs font-bold cursor-pointer transition-transform hover:scale-105"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Sipariş</span>
        </a>
      </div>

      {viewMode === 'live' && (
        <div className="fixed bottom-5 left-5 z-40">
          <button
            onClick={() => setViewMode('editor')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl text-xs font-bold cursor-pointer transition-transform hover:scale-105 border border-blue-400/40"
          >
            <Code2 className="w-4 h-4" />
            <span>Google Sites Düzenleyicisi</span>
          </button>
        </div>
      )}
    </div>
  );
}
