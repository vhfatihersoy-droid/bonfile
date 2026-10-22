import React, { useState } from 'react';
import {
  Type,
  Image as ImageIcon,
  Layout,
  Plus,
  Trash2,
  FileText,
  Palette,
  Layers,
  MapPin,
  SplitSquareVertical,
  Sliders,
  Utensils,
  ShoppingBag,
  Building2,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { SidebarTab, SitePage, GoogleSitesTheme, SectionType, SiteSection } from '../../types/siteBuilder';
import { defaultThemes } from '../../data/builderData';

interface RightSidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  pages: SitePage[];
  activePageId: string;
  onSelectPage: (pageId: string) => void;
  onAddPage: (pageName: string) => void;
  onDeletePage: (pageId: string) => void;
  onAddSection: (sectionType: SectionType) => void;
  selectedTheme: GoogleSitesTheme;
  onSelectTheme: (theme: GoogleSitesTheme) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  activeTab,
  onTabChange,
  pages,
  activePageId,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onAddSection,
  selectedTheme,
  onSelectTheme,
}) => {
  const [newPageName, setNewPageName] = useState('');
  const [isAddingPage, setIsAddingPage] = useState(false);

  const handleCreatePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName.trim()) return;
    onAddPage(newPageName.trim());
    setNewPageName('');
    setIsAddingPage(false);
  };

  return (
    <div className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col shrink-0 text-white select-none z-30">
      {/* 3 Iconic Google Sites Tabs: EKLE | SAYFALAR | TEMALAR */}
      <div className="flex border-b border-neutral-800 bg-neutral-950 text-xs font-semibold">
        <button
          onClick={() => onTabChange('insert')}
          className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
            activeTab === 'insert'
              ? 'border-blue-500 text-blue-400 bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          EKLE
        </button>
        <button
          onClick={() => onTabChange('pages')}
          className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
            activeTab === 'pages'
              ? 'border-blue-500 text-blue-400 bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          SAYFALAR
        </button>
        <button
          onClick={() => onTabChange('themes')}
          className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
            activeTab === 'themes'
              ? 'border-blue-500 text-blue-400 bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          TEMALAR
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* --- TAB 1: EKLE (INSERT) --- */}
        {activeTab === 'insert' && (
          <div className="space-y-6">
            {/* Quick 2x2 Basic Insert Tools */}
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Temel Bileşenler
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAddSection('text-block')}
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer group text-center"
                >
                  <Type className="w-5 h-5 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-neutral-200">Metin Kutusu</span>
                </button>

                <button
                  onClick={() => onAddSection('image-text')}
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer group text-center"
                >
                  <ImageIcon className="w-5 h-5 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-neutral-200">Görsel & Metin</span>
                </button>

                <button
                  onClick={() => onAddSection('cta-banner')}
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer group text-center"
                >
                  <SplitSquareVertical className="w-5 h-5 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-neutral-200">Aksiyon Butonu</span>
                </button>

                <button
                  onClick={() => onAddSection('features-grid')}
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer group text-center"
                >
                  <Layout className="w-5 h-5 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-neutral-200">Bento Düzen</span>
                </button>
              </div>
            </div>

            {/* Özlemce Et / E-Ticaret Özel Blokları */}
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Hazır Et & E-Ticaret Blokları
              </span>
              <div className="space-y-2">
                <button
                  onClick={() => onAddSection('hero')}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Karşılama / Hero Bloğu</span>
                      <span className="text-[10px] text-neutral-400">Marka mirası ve manşet vitrini</span>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-neutral-500" />
                </button>

                <button
                  onClick={() => onAddSection('catalog')}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-red-500" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Ürün Kataloğu & Sepet</span>
                      <span className="text-[10px] text-neutral-400">Dallas steak, antrikot, sucuk</span>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-neutral-500" />
                </button>

                <button
                  onClick={() => onAddSection('cooking-guide')}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Şefin Pişirme Rehberi</span>
                      <span className="text-[10px] text-neutral-400">İnteraktif steak termometresi</span>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-neutral-500" />
                </button>

                <button
                  onClick={() => onAddSection('horeca')}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-sky-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">HORECA Kurumsal Tedarik</span>
                      <span className="text-[10px] text-neutral-400">Restoran ve otel B2B teklif formu</span>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-neutral-500" />
                </button>

                <button
                  onClick={() => onAddSection('contact')}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Harita & İletişim Bloğu</span>
                      <span className="text-[10px] text-neutral-400">Beylikdüzü fabrika ve mağaza</span>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-neutral-500" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: SAYFALAR (PAGES) --- */}
        {activeTab === 'pages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Site Sayfaları ({pages.length})
              </span>
              <button
                onClick={() => setIsAddingPage(!isAddingPage)}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni Sayfa</span>
              </button>
            </div>

            {/* New page form input */}
            {isAddingPage && (
              <form onSubmit={handleCreatePageSubmit} className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-2">
                <input
                  type="text"
                  autoFocus
                  required
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  placeholder="Sayfa Adı (Örn: Blog, Sertifikalar)"
                  className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingPage(false)}
                    className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                  >
                    Ekle
                  </button>
                </div>
              </form>
            )}

            {/* Pages list */}
            <div className="space-y-1">
              {pages.map((p) => {
                const isActive = p.id === activePageId;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectPage(p.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 font-semibold'
                        : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="text-xs truncate">{p.name}</span>
                      {p.isHome && (
                        <span className="text-[10px] text-neutral-500 font-normal">
                          (Ana Sayfa)
                        </span>
                      )}
                    </div>

                    {!p.isHome && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePage(p.id);
                        }}
                        className="opacity-0 hover:opacity-100 group-hover:opacity-100 p-1 text-neutral-500 hover:text-red-400 rounded"
                        title="Sayfayı Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- TAB 3: TEMALAR (THEMES) --- */}
        {activeTab === 'themes' && (
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              Google Sites Temaları
            </span>

            <div className="space-y-3">
              {defaultThemes.map((thm) => {
                const isSelected = selectedTheme.id === thm.id;
                return (
                  <div
                    key={thm.id}
                    onClick={() => onSelectTheme(thm)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-neutral-950 shadow-md ring-1 ring-blue-500'
                        : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{thm.name}</span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-blue-400 uppercase">
                          Seçili
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-neutral-700 shrink-0"
                        style={{ backgroundColor: thm.primaryColor }}
                        title="Birincil Renk"
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-neutral-700 shrink-0"
                        style={{ backgroundColor: thm.accentColor }}
                        title="Vurgu Rengi"
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-neutral-700 shrink-0"
                        style={{ backgroundColor: thm.bgDark }}
                        title="Zemin Rengi"
                      />
                      <span className="text-[11px] text-neutral-400 ml-auto font-mono">
                        {thm.fontFamily}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
