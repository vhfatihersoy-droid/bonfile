import React, { useState } from 'react';
import { X, Check, Download, Copy, Sliders, Plus, RefreshCw, Palette, Sparkles, Building, Phone, Mail, MapPin } from 'lucide-react';
import { SiteConfig, Product } from '../types';

interface SiteCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onUpdateConfig: (newConfig: SiteConfig) => void;
  onAddCustomProduct: (product: Product) => void;
  onResetDefaults: () => void;
}

export const SiteCustomizerModal: React.FC<SiteCustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onAddCustomProduct,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'general' | 'new-product' | 'export'>('general');
  const [copiedCode, setCopiedCode] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'steak' | 'beef' | 'lamb' | 'meatball' | 'charcuterie'>('steak');
  const [newProdPrice, setNewProdPrice] = useState(450);
  const [newProdTagline, setNewProdTagline] = useState('');
  const [newProdCutLocation, setNewProdCutLocation] = useState('Özel Kesim');
  const [prodAddedSuccess, setProdAddedSuccess] = useState(false);

  const handleConfigChange = (field: keyof SiteConfig, value: any) => {
    onUpdateConfig({
      ...config,
      [field]: value,
    });
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProd: Product = {
      id: `custom-${Date.now()}`,
      name: newProdName,
      slug: 'dana-bonfile-lokum',
      category: newProdCategory,
      categoryName:
        newProdCategory === 'steak'
          ? 'Steakhouse Kesimleri'
          : newProdCategory === 'beef'
          ? 'Taze Dana Eti'
          : newProdCategory === 'lamb'
          ? 'Taze Kuzu Eti'
          : newProdCategory === 'meatball'
          ? 'Köfte & Burger'
          : 'Şarküteri & Sucuk',
      tagline: newProdTagline || 'Özel hazırlanmış lezzetli et ürünü',
      description: 'Sizin tarafınızdan özel olarak eklenen taze ve lezzetli et ürünü.',
      basePrice: Number(newProdPrice) || 350,
      unitWeight: '500g',
      weights: [
        { label: '500g Paket', grams: 500, multiplier: 1 },
        { label: '1000g Eko Paket', grams: 1000, multiplier: 1.95 },
      ],
      cutLocation: newProdCutLocation,
      fatRatio: '%10 - %15',
      cookingMethods: ['Tava', 'Izgara'],
      cookingTimeMinutes: 6,
      origin: 'Yerli Besi',
      badge: 'Yeni Ürün',
      inStock: true,
      nutritionPer100g: {
        calories: 190,
        protein: 22,
        fat: 11,
        carbs: 0,
      },
      chefAdvice: 'Döküm tavada yüksek ateşte mühürleyip servis yapın.',
      accentColor: '#B91C1C',
    };

    onAddCustomProduct(newProd);
    setProdAddedSuccess(true);
    setNewProdName('');
    setNewProdTagline('');
    setTimeout(() => setProdAddedSuccess(false), 2000);
  };

  // Generate single standalone HTML export with embedded styling
  const generateExportHtml = () => {
    return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.brandName} - ${config.tagline}</title>
  <meta name="description" content="${config.brandName} Et ve Et Ürünleri - ${config.establishedYear}'ten Beri Kalite">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0a0a0a; color: #fff; }
  </style>
</head>
<body class="bg-neutral-950 text-neutral-100 min-h-screen">
  <!-- Duyuru -->
  <div class="bg-neutral-900 border-b border-neutral-800 text-xs py-2 px-4 text-center text-amber-400 font-semibold">
    ${config.establishedYear}'TEN BERİ · ${config.brandName.toUpperCase()} SOĞUK ZİNCİR (+4°C) TESLİMAT GÜVENCESİ
  </div>

  <!-- Header -->
  <header class="border-b border-neutral-800 bg-neutral-950/95 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded bg-red-700 flex items-center justify-center font-black text-white text-xs">${config.establishedYear}</div>
        <h1 class="text-2xl font-black tracking-wider text-white">${config.brandName}</h1>
      </div>
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
        <a href="#urunler" class="hover:text-amber-400">Ürünlerimiz</a>
        <a href="#kurumsal" class="hover:text-amber-400">Kurumsal</a>
        <a href="#iletisim" class="hover:text-amber-400">İletişim</a>
      </nav>
      <a href="tel:${config.phone}" class="px-4 py-2 bg-red-700 hover:bg-red-800 rounded font-bold text-xs text-white">
        ${config.phone}
      </a>
    </div>
  </header>

  <!-- Hero -->
  <section class="py-20 px-6 max-w-5xl mx-auto text-center space-y-6">
    <span class="text-xs font-bold text-amber-400 uppercase tracking-widest">${config.establishedYear}'ten Beri Ustalık</span>
    <h2 class="text-4xl md:text-6xl font-black text-white">${config.tagline}</h2>
    <p class="text-neutral-400 max-w-2xl mx-auto text-sm md:text-base">
      En seçkin taze dana, kuzu ve dry-aged steakhouse kesimleri, çiftlikten sofranıza soğuk zincir güvencesiyle.
    </p>
    <div class="pt-4 flex justify-center gap-4">
      <a href="#urunler" class="px-6 py-3 bg-red-700 font-bold text-sm text-white rounded">Ürünleri İncele</a>
      <a href="https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}" class="px-6 py-3 bg-neutral-900 border border-neutral-700 font-bold text-sm text-white rounded">WhatsApp Sipariş</a>
    </div>
  </section>

  <!-- Footer -->
  <footer id="iletisim" class="mt-24 border-t border-neutral-800 py-12 px-6 text-center text-xs text-neutral-500">
    <p class="font-bold text-neutral-300 mb-1">${config.brandName} Gıda San. ve Tic. A.Ş.</p>
    <p>${config.address} - ${config.city} · Tel: ${config.phone} · E-Posta: ${config.email}</p>
    <p class="mt-4 text-neutral-600">© ${new Date().getFullYear()} ${config.brandName}. Tüm hakları saklıdır.</p>
  </footer>
</body>
</html>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateExportHtml());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadFile = () => {
    const htmlContent = generateExportHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.brandName.toLowerCase().replace(/\s+/g, '-')}-website.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl text-white max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Site Yönetim & Özelleştirme Stüdyosu</h3>
              <p className="text-xs text-neutral-400">Bu web sitesini kendi markanız için düzenleyin ve tek tıkla indirin.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-800 bg-neutral-950 text-xs">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-3 font-semibold text-center transition-colors cursor-pointer border-b-2 ${
              activeTab === 'general'
                ? 'border-amber-400 text-amber-400 bg-neutral-900/50'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Marka & İletişim Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('new-product')}
            className={`flex-1 py-3 font-semibold text-center transition-colors cursor-pointer border-b-2 ${
              activeTab === 'new-product'
                ? 'border-amber-400 text-amber-400 bg-neutral-900/50'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Yeni Ürün Ekle
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 font-semibold text-center transition-colors cursor-pointer border-b-2 ${
              activeTab === 'export'
                ? 'border-amber-400 text-amber-400 bg-neutral-900/50'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Site Kodunu İndir (HTML)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Marka Adı (Sitede Gözükecek)
                  </label>
                  <input
                    type="text"
                    value={config.brandName}
                    onChange={(e) => handleConfigChange('brandName', e.target.value)}
                    placeholder="Örn: BONFİLET / ÖZSOY ET / GURME KASAP"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Kuruluş Yılı
                  </label>
                  <input
                    type="text"
                    value={config.establishedYear}
                    onChange={(e) => handleConfigChange('establishedYear', e.target.value)}
                    placeholder="1905"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-300 font-medium mb-1">
                    Ana Slogan / Başlık
                  </label>
                  <input
                    type="text"
                    value={config.tagline}
                    onChange={(e) => handleConfigChange('tagline', e.target.value)}
                    placeholder="1905'ten Bugüne Değişmeyen Ustalık ve Kalite"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Telefon Numarası
                  </label>
                  <input
                    type="text"
                    value={config.phone}
                    onChange={(e) => handleConfigChange('phone', e.target.value)}
                    placeholder="0212 880 05 55"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    WhatsApp Sipariş Hattı
                  </label>
                  <input
                    type="text"
                    value={config.whatsapp}
                    onChange={(e) => handleConfigChange('whatsapp', e.target.value)}
                    placeholder="0530 880 05 55"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    E-Posta Adresi
                  </label>
                  <input
                    type="email"
                    value={config.email}
                    onChange={(e) => handleConfigChange('email', e.target.value)}
                    placeholder="iletisim@bonfilet.com.tr"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Ücretsiz Soğuk Zincir Kargo Limiti (TL)
                  </label>
                  <input
                    type="number"
                    value={config.freeShippingThreshold}
                    onChange={(e) => handleConfigChange('freeShippingThreshold', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-300 font-medium mb-1">
                    Tesis / Mağaza Adresi
                  </label>
                  <input
                    type="text"
                    value={config.address}
                    onChange={(e) => handleConfigChange('address', e.target.value)}
                    placeholder="Dereağzı Mah. Sultan Fatih Cad. No:29/1"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
                <button
                  type="button"
                  onClick={onResetDefaults}
                  className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-neutral-300 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Orijinal Bonfilet Bilgilerine Sıfırla</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded cursor-pointer"
                >
                  Değişiklikleri Uygula
                </button>
              </div>
            </div>
          )}

          {activeTab === 'new-product' && (
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="p-3 bg-neutral-900 rounded border border-neutral-800">
                <h4 className="font-bold text-white mb-0.5">Kataloğa Yeni Bir Et Ürünü Ekleyin</h4>
                <p className="text-neutral-400 text-[11px]">Eklediğiniz ürün anında katalogda listelenecektir.</p>
              </div>

              {prodAddedSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 text-emerald-200 rounded flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Ürün başarıyla eklendi! Kataloğunuzda görüntülenebilir.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Ürün Adı *</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Örn: Tomahawk Steak / Kuzu Gerdan"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Kategori</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="steak">Steakhouse Kesimleri</option>
                    <option value="beef">Taze Dana Eti</option>
                    <option value="lamb">Taze Kuzu Eti</option>
                    <option value="meatball">Köfte & Burger</option>
                    <option value="charcuterie">Şarküteri & Sucuk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Fiyat (500g için TL) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Kesim Yeri</label>
                  <input
                    type="text"
                    value={newProdCutLocation}
                    onChange={(e) => setNewProdCutLocation(e.target.value)}
                    placeholder="Örn: Dana Sırt / Kuzu Kafes"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-300 font-medium mb-1">Kısa Açıklama / Slogan</label>
                  <input
                    type="text"
                    value={newProdTagline}
                    onChange={(e) => setNewProdTagline(e.target.value)}
                    placeholder="Örn: 28 gün dinlendirilmiş, kemikli enfes lezzet"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ürünü Kataloğa Ekle</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-900 rounded border border-neutral-800 space-y-2">
                <h4 className="text-sm font-bold text-white">Tek Dosya Olarak Web Sitenizi İndirin</h4>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  Bu özellik sayesinde hazırladığınız siteyi tek bir <code className="text-amber-400">website.html</code> dosyası olarak indirebilir, istediğiniz herhangi bir hostinge (cPanel, Vercel, Netlify, GoDaddy, vb.) yükleyip hemen canlıya alabilirsiniz!
                </p>
              </div>

              {downloadSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 text-emerald-200 rounded flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>HTML dosyası bilgisayarınıza başarıyla indirildi!</span>
                </div>
              )}

              {copiedCode && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 text-emerald-200 rounded flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Tüm HTML ve CSS kodları panoya kopyalandı!</span>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadFile}
                  className="flex items-center gap-2 px-5 py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>HTML Dosyasını İndir (.html)</span>
                </button>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-2 px-5 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold rounded cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>Kodu Panoya Kopyala</span>
                </button>
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded font-mono text-[10px] text-neutral-400 max-h-40 overflow-y-auto">
                <pre>{generateExportHtml().slice(0, 700)}...</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
