import React from 'react';
import {
  Undo,
  Redo,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Globe,
  Download,
  Share2,
  Settings,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { DeviceMode, ViewMode } from '../../types/siteBuilder';
import { SiteConfig } from '../../types';

interface TopToolbarProps {
  config: SiteConfig;
  onUpdateSiteName: (name: string) => void;
  deviceMode: DeviceMode;
  onDeviceChange: (mode: DeviceMode) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onPublish: () => void;
  onDownloadHtml: () => void;
  isPublished: boolean;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  config,
  onUpdateSiteName,
  deviceMode,
  onDeviceChange,
  viewMode,
  onViewModeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onPublish,
  onDownloadHtml,
  isPublished,
}) => {
  return (
    <div className="h-14 bg-neutral-900 border-b border-neutral-800 px-4 flex items-center justify-between text-white shrink-0 z-50">
      {/* Left: Google Sites logo + Site Title + Undo/Redo */}
      <div className="flex items-center gap-3">
        {/* Google Sites Styled Icon */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-neutral-400">
            Google Sites Studio
          </span>
        </div>

        <div className="h-4 w-px bg-neutral-700 hidden sm:block" />

        {/* Editable Site Name */}
        <input
          type="text"
          value={config.brandName}
          onChange={(e) => onUpdateSiteName(e.target.value)}
          placeholder="Adsız Site"
          title="Site Başlığını Düzenleyin"
          className="text-xs sm:text-sm font-bold bg-transparent hover:bg-neutral-800 focus:bg-neutral-800 px-2 py-1 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors w-32 sm:w-44"
        />

        {/* Undo / Redo */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Geri Al (Ctrl+Z)"
            className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 rounded hover:bg-neutral-800 cursor-pointer"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="İleri Al (Ctrl+Y)"
            className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 rounded hover:bg-neutral-800 cursor-pointer"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center: Responsive Device Switcher (Masaüstü, Tablet, Mobil) */}
      <div className="flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800">
        <button
          onClick={() => onDeviceChange('desktop')}
          title="Büyük Ekran / Masaüstü (1440px)"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            deviceMode === 'desktop'
              ? 'bg-neutral-800 text-blue-400 shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Monitor className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDeviceChange('tablet')}
          title="Tablet Ekran (768px)"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            deviceMode === 'tablet'
              ? 'bg-neutral-800 text-blue-400 shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Tablet className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDeviceChange('mobile')}
          title="Akıllı Telefon / Mobil (375px)"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            deviceMode === 'mobile'
              ? 'bg-neutral-800 text-blue-400 shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Preview, Code Export, Publish Actions */}
      <div className="flex items-center gap-2">
        {/* Toggle Editor vs Live Mode */}
        <button
          onClick={() => onViewModeChange(viewMode === 'live' ? 'editor' : 'live')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            viewMode === 'live'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
          }`}
        >
          {viewMode === 'live' ? (
            <>
              <Code2 className="w-3.5 h-3.5" />
              <span>Düzenleyiciye Dön</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Canlı Site Modu</span>
            </>
          )}
        </button>

        {/* Download Standalone Code */}
        <button
          onClick={onDownloadHtml}
          title="Tek Dosya HTML Olarak İndir"
          className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden md:inline">HTML İndir</span>
        </button>

        {/* Publish Button */}
        <button
          onClick={onPublish}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          {isPublished ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Yayınlandı</span>
            </>
          ) : (
            <span>Yayınla</span>
          )}
        </button>
      </div>
    </div>
  );
};
