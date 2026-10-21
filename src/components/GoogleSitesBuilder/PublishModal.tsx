import React, { useState } from 'react';
import { X, Globe, CheckCircle2, ExternalLink, Copy, Check, Download, ShieldCheck } from 'lucide-react';
import { SiteConfig } from '../../types';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onViewLive: () => void;
  onDownloadHtml: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  config,
  onViewLive,
  onDownloadHtml,
}) => {
  if (!isOpen) return null;

  const [customWebAddress, setCustomWebAddress] = useState(
    config.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'bonfilet-1905'
  );
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [published, setPublished] = useState(false);

  const fullPublishUrl = `https://sites.google.com/view/${customWebAddress}`;

  const handlePublishConfirm = () => {
    setPublished(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPublishUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-bold text-white">Web'de Yayınla</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {published ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-600/50 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Siteniz Başarıyla Yayınlandı!</h4>
              <p className="text-neutral-300">
                Web siteniz artık canlıda görüntülenebilir ve paylaşılabilir.
              </p>

              <div className="p-3 bg-neutral-900 rounded border border-neutral-800 flex items-center justify-between gap-2">
                <span className="font-mono text-amber-400 truncate">{fullPublishUrl}</span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-[11px] font-semibold shrink-0 cursor-pointer"
                >
                  {copiedUrl ? 'Kopyalandı' : 'Kopyala'}
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onViewLive();
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer"
                >
                  Canlı Siteyi Gör
                </button>
                <button
                  onClick={onDownloadHtml}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded cursor-pointer"
                >
                  HTML İndir
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-neutral-300 font-medium mb-1.5">
                  Web Adresi (Google Sites URL)
                </label>
                <div className="flex rounded bg-neutral-900 border border-neutral-700 overflow-hidden text-neutral-400">
                  <span className="px-3 py-2 bg-neutral-950 border-r border-neutral-700 text-[11px] font-mono select-none">
                    https://sites.google.com/view/
                  </span>
                  <input
                    type="text"
                    value={customWebAddress}
                    onChange={(e) => setCustomWebAddress(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 px-3 py-2 text-white font-mono bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-neutral-900/80 rounded border border-neutral-800 space-y-1.5">
                <span className="text-neutral-300 font-semibold block">Arama Ayarları</span>
                <div className="flex items-center gap-2 text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Google Arama ve arama motorları için SEO optimizasyonu aktif.</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  İptal
                </button>

                <button
                  type="button"
                  onClick={handlePublishConfirm}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer shadow-md"
                >
                  Yayınla
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
